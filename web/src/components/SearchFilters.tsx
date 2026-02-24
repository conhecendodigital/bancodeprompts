"use client";

import { useCallback, useEffect, useState } from "react";

const FILTER_CATEGORIES = [
    {
        title: "ESTILOS ARTÍSTICOS",
        tags: [
            "Realista",
            "Cinemático",
            "Anime",
            "Arquitetura",
            "Cartoon",
            "3D Render",
            "Vetor",
            "Aquarela",
            "Sketch / Line Art",
            "Óleo",
            "Abstrato",
            "Surreal",
            "Moda",
            "Fotografia",
            "Retrato",
        ],
    },
    {
        title: "CORPORATIVO & PROFISSIONAL",
        tags: [
            "Corporativo",
            "Negócios",
            "Minimalista",
            "Moderno",
            "Produto / Poster",
            "Logo",
            "Infográfico",
            "Concept Art",
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

interface SearchFiltersProps {
    onSearchChange: (query: string) => void;
    onTagToggle: (tag: string) => void;
    activeTags: string[];
    searchQuery: string;
}

export default function SearchFilters({
    onSearchChange,
    onTagToggle,
    activeTags,
    searchQuery,
}: SearchFiltersProps) {
    const [localQuery, setLocalQuery] = useState(searchQuery);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [localQuery, onSearchChange]);

    const clearAll = useCallback(() => {
        setLocalQuery("");
        onSearchChange("");
        activeTags.forEach((tag) => onTagToggle(tag));
    }, [activeTags, onSearchChange, onTagToggle]);

    const hasFilters = activeTags.length > 0 || searchQuery.length > 0;

    return (
        <section className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="inline-block bg-[var(--bg-card)] text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md">
                    REFINAR GALERIA
                </span>
                {hasFilters && (
                    <button
                        onClick={clearAll}
                        className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-1">
                Filtre imagens por estilo e técnica
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-5">
                Pesquise títulos ou criadores, depois selecione tags para encontrar o prompt ideal.
            </p>

            {/* Search bar */}
            <div className="relative mb-6">
                <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
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
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Pesquisar títulos, criadores ou prompts..."
                    className="w-full pl-10 pr-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
                />
                {localQuery && (
                    <button
                        onClick={() => {
                            setLocalQuery("");
                            onSearchChange("");
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Filter categories */}
            <div className="space-y-5">
                {FILTER_CATEGORIES.map((category) => (
                    <div key={category.title}>
                        <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-[var(--accent)] mb-2.5">
                            {category.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {category.tags.map((tag) => {
                                const isActive = activeTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => onTagToggle(tag)}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium ${isActive
                                                ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                                                : "bg-white text-[var(--text)] border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-subtle)]"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
