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
        <div className="sticky top-24 z-40 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
                    <h3 className="text-xs font-bold font-sora tracking-widest uppercase text-white">
                        REFINAR PESQUISA
                    </h3>
                </div>
                {totalActiveFilters > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-[10px] font-bold text-primary hover:text-primary-light transition-colors uppercase tracking-widest cursor-pointer hover-lift flex items-center gap-1"
                    >
                        Limpar Filtros ({totalActiveFilters})
                        <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                )}
            </div>

            {/* Search bar */}
            <div className="relative mb-6 input-glass group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">
                    search
                </span>
                <input
                    type="text"
                    value={localQuery}
                    onChange={handleInputChange}
                    placeholder="Pesquisar por título ou prompt..."
                    className="w-full pl-12 pr-4 py-3 bg-transparent border-none text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 transition-all font-sans"
                />
            </div>

            {/* Active filters indicator */}
            {totalActiveFilters > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-6 pb-6 border-b border-white/5">
                    <span className="text-xs text-slate-500 uppercase tracking-widest self-center mr-2 font-bold flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Ativos:
                    </span>
                    {activeModel && (
                        <button
                            onClick={() => onModelToggle(activeModel)}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30 transition-all hover:bg-primary/30 hover:border-primary/50 cursor-pointer shadow-[0_0_10px_rgba(123,97,255,0.1)] hover-lift"
                        >
                            <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                            {activeModel}
                            <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                    )}
                    {activeTags.map((tag) => (
                        <button
                            key={`active-${tag}`}
                            onClick={() => onTagToggle(tag)}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30 transition-all hover:bg-primary/30 hover:border-primary/50 cursor-pointer shadow-[0_0_10px_rgba(123,97,255,0.1)] hover-lift"
                        >
                            {tag}
                            <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Categories — 100% dinâmicas do banco */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                {categories.map((category) => {
                    const isExpanded = expandedCategories.has(category.title);
                    const hasActiveTags = category.isModel
                        ? !!activeModel
                        : category.tags.some((t) => activeTags.includes(t));

                    return (
                        <div key={category.title} className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                            <button
                                onClick={() => toggleCategory(category.title)}
                                className="flex items-center justify-between w-full text-left group cursor-pointer hover:bg-white/5 rounded-lg px-3 py-2 transition-all duration-300"
                            >
                                <span
                                    className={`text-[11px] font-bold font-sora tracking-widest uppercase flex items-center gap-2 ${hasActiveTags
                                        ? "text-primary"
                                        : "text-slate-400"
                                        }`}
                                >
                                    {category.title}
                                    {hasActiveTags && (
                                        <span className="size-1.5 bg-primary rounded-full shadow-[0_0_5px_rgba(123,97,255,0.5)]"></span>
                                    )}
                                </span>
                                <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                                    expand_more
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="flex flex-wrap gap-2 mt-4 px-3 pb-2">
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
                                                className={`px-4 py-2 rounded-lg text-[11px] font-semibold tracking-wide cursor-pointer transition-all duration-300 hover-lift ${isActive
                                                    ? "bg-primary text-white shadow-[0_0_15px_rgba(123,97,255,0.3)] border border-primary-light/50"
                                                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
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

