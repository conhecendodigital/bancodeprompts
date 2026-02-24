"use client";

import { useCallback, useEffect, useState } from "react";

interface FilterCategory {
    title: string;
    tags: string[];
}

interface SearchFiltersProps {
    onSearchChange: (query: string) => void;
    onTagToggle: (tag: string) => void;
    activeTags: string[];
    searchQuery: string;
    dynamicTags?: string[];
    modelNames?: string[];
}

// Tags base (sempre disponíveis como fallback)
const BASE_CATEGORIES: FilterCategory[] = [
    {
        title: "ESTILOS ARTÍSTICOS",
        tags: [
            "Realista", "Cinemático", "Anime", "Arquitetura", "Cartoon",
            "3D Render", "Vetor", "Aquarela", "Sketch / Line Art", "Óleo",
            "Abstrato", "Surreal", "Moda", "Fotografia", "Retrato",
        ],
    },
    {
        title: "CORPORATIVO & PROFISSIONAL",
        tags: [
            "Corporativo", "Negócios", "Minimalista", "Moderno",
            "Produto / Poster", "Logo", "Infográfico", "Concept Art",
        ],
    },
    {
        title: "GÊNERO & TEMAS",
        tags: ["Fantasia", "Ficção Científica", "Cyberpunk", "Retrô / Vintage", "Grunge"],
    },
    {
        title: "ATMOSFERA & TOM",
        tags: ["Vibrante / Colorido", "Dark / Moody", "Elegante"],
    },
    {
        title: "IDIOMA",
        tags: ["Árabe", "Francês", "Inglês", "Espanhol", "Português"],
    },
];

function buildCategories(
    dynamicTags: string[],
    modelNames: string[]
): FilterCategory[] {
    const categories: FilterCategory[] = [...BASE_CATEGORIES];

    // Adiciona modelos de IA como categoria se houver dados
    if (modelNames.length > 0) {
        categories.unshift({
            title: "MODELO DE IA",
            tags: modelNames.slice(0, 20),
        });
    }

    // Adiciona tags do banco que não estão nas categorias base
    const allBaseTags = new Set(
        BASE_CATEGORIES.flatMap((c) => c.tags.map((t) => t.toLowerCase()))
    );
    const extraTags = dynamicTags.filter(
        (t) => !allBaseTags.has(t.toLowerCase())
    );
    if (extraTags.length > 0) {
        categories.push({
            title: "TAGS DO BANCO",
            tags: extraTags.slice(0, 30),
        });
    }

    return categories;
}

export default function SearchFilters({
    onSearchChange,
    onTagToggle,
    activeTags,
    searchQuery,
    dynamicTags = [],
    modelNames = [],
}: SearchFiltersProps) {
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(["MODELO DE IA"])
    );

    // Debounce da busca
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [localQuery, onSearchChange]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocalQuery(e.target.value);
        },
        []
    );

    const toggleCategory = useCallback((title: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(title)) next.delete(title);
            else next.add(title);
            return next;
        });
    }, []);

    const categories = buildCategories(dynamicTags, modelNames);

    return (
        <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-[var(--border)] shadow-sm p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--text)]">
                        REFINAR GALERIA
                    </h3>
                </div>
                {activeTags.length > 0 && (
                    <button
                        onClick={() => activeTags.forEach((t) => onTagToggle(t))}
                        className="text-[10px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors uppercase tracking-wider"
                    >
                        Limpar Filtros ({activeTags.length})
                    </button>
                )}
            </div>

            {/* Search bar */}
            <div className="relative mb-5">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    value={localQuery}
                    onChange={handleInputChange}
                    placeholder="Pesquisar por título ou prompt..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
                />
            </div>

            {/* Active tags indicator */}
            {activeTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-[var(--border)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider self-center mr-1">
                        Ativos:
                    </span>
                    {activeTags.map((tag) => (
                        <button
                            key={`active-${tag}`}
                            onClick={() => onTagToggle(tag)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--accent)] text-white transition-all hover:bg-[var(--accent-hover)]"
                        >
                            {tag}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    ))}
                </div>
            )}

            {/* Categories */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {categories.map((category) => {
                    const isExpanded = expandedCategories.has(category.title);
                    const hasActiveTags = category.tags.some((t) =>
                        activeTags.includes(t)
                    );

                    return (
                        <div key={category.title}>
                            <button
                                onClick={() => toggleCategory(category.title)}
                                className="flex items-center justify-between w-full text-left mb-2 group cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1 -mx-2 transition-all duration-200"
                            >
                                <span
                                    className={`text-[10px] font-bold tracking-[0.12em] uppercase ${hasActiveTags
                                        ? "text-[var(--accent)]"
                                        : "text-[var(--text-muted)]"
                                        }`}
                                >
                                    {category.title}
                                    {hasActiveTags && (
                                        <span className="ml-1 text-[var(--accent)]">●</span>
                                    )}
                                </span>
                                <svg
                                    className={`w-3 h-3 text-[var(--text-muted)] transition-transform ${isExpanded ? "rotate-180" : ""
                                        }`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {isExpanded && (
                                <div className="flex flex-wrap gap-1.5">
                                    {category.tags.map((tag) => {
                                        const isActive = activeTags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => onTagToggle(tag)}
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-all duration-200 ${isActive
                                                        ? "bg-[var(--accent)] text-white shadow-sm ring-2 ring-[var(--accent)]/30"
                                                        : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--accent)] border border-[var(--border)] hover:border-[var(--accent)]/40"
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
