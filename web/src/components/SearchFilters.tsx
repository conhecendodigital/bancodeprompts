"use client";

import { useCallback, useEffect, useState } from "react";

interface FilterCategory {
    title: string;
    tags: string[];
    isModel?: boolean;
}

interface SearchFiltersProps {
    onSearchChange: (query: string) => void;
    onTagToggle: (tag: string) => void;
    onModelToggle: (model: string) => void;
    activeTags: string[];
    activeModel: string;
    searchQuery: string;
    dynamicTags?: string[];
    modelNames?: string[];
}

/**
 * Deduplica uma lista de strings normalizando com trim + lowercase,
 * mas preserva a capitalização da primeira ocorrência.
 */
function deduplicateStrings(items: string[]): string[] {
    const seen = new Map<string, string>();
    for (const item of items) {
        const key = item.trim().toLowerCase();
        if (key && !seen.has(key)) {
            seen.set(key, item.trim());
        }
    }
    return Array.from(seen.values());
}

function buildCategories(
    dynamicTags: string[],
    modelNames: string[]
): FilterCategory[] {
    const categories: FilterCategory[] = [];

    // Modelos de IA (campo model_name)
    const uniqueModels = deduplicateStrings(modelNames);
    if (uniqueModels.length > 0) {
        categories.push({
            title: "MODELO DE IA",
            tags: uniqueModels,
            isModel: true,
        });
    }

    // Tags dinâmicas do banco (campo tags[])
    const uniqueTags = deduplicateStrings(dynamicTags);
    if (uniqueTags.length > 0) {
        categories.push({
            title: "CATEGORIAS",
            tags: uniqueTags,
        });
    }

    return categories;
}

export default function SearchFilters({
    onSearchChange,
    onTagToggle,
    onModelToggle,
    activeTags,
    activeModel,
    searchQuery,
    dynamicTags = [],
    modelNames = [],
}: SearchFiltersProps) {
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(["MODELO DE IA", "CATEGORIAS"])
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

    const totalActiveFilters = activeTags.length + (activeModel ? 1 : 0);

    const handleClearAll = useCallback(() => {
        activeTags.forEach((t) => onTagToggle(t));
        if (activeModel) onModelToggle(activeModel);
    }, [activeTags, activeModel, onTagToggle, onModelToggle]);

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
                {totalActiveFilters > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-[10px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors uppercase tracking-wider cursor-pointer"
                    >
                        Limpar Filtros ({totalActiveFilters})
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

            {/* Active filters indicator */}
            {totalActiveFilters > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-4 pb-4 border-b border-[var(--border)]">
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider self-center mr-1 font-semibold">
                        Ativos:
                    </span>
                    {activeModel && (
                        <button
                            onClick={() => onModelToggle(activeModel)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-[var(--accent)] text-white transition-all hover:bg-[var(--accent-hover)] hover:scale-105 cursor-pointer shadow-md"
                        >
                            🤖 {activeModel}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                    {activeTags.map((tag) => (
                        <button
                            key={`active-${tag}`}
                            onClick={() => onTagToggle(tag)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-[var(--accent)] text-white transition-all hover:bg-[var(--accent-hover)] hover:scale-105 cursor-pointer shadow-md"
                        >
                            {tag}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    ))}
                </div>
            )}

            {/* Categories — 100% dinâmicas do banco */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {categories.map((category) => {
                    const isExpanded = expandedCategories.has(category.title);
                    const hasActiveTags = category.isModel
                        ? !!activeModel
                        : category.tags.some((t) => activeTags.includes(t));

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
                                <div className="flex flex-wrap gap-2.5">
                                    {category.tags.map((tag) => {
                                        const isActive = category.isModel
                                            ? activeModel.trim().toLowerCase() === tag.trim().toLowerCase()
                                            : activeTags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() =>
                                                    category.isModel
                                                        ? onModelToggle(tag)
                                                        : onTagToggle(tag)
                                                }
                                                className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${isActive
                                                    ? "bg-[var(--accent)] text-white shadow-md ring-2 ring-[var(--accent)]/40 scale-105"
                                                    : "bg-[var(--bg-subtle)] text-[var(--text)] hover:bg-slate-100 hover:text-[var(--accent)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:shadow-sm"
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
