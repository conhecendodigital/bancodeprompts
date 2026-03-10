"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";

/* ── Tipos ── */
interface SearchFiltersProps {
    onSearchChange: (query: string) => void;
    onTagToggle: (tag: string) => void;
    onModelToggle: (model: string) => void;
    activeTags: string[];
    activeModel: string;
    searchQuery: string;
    dynamicTags?: string[];
    modelNames?: string[];
    tagCounts?: Record<string, number>;
    modelCounts?: Record<string, number>;
}

/* ── Ícones por modelo de IA ── */
const MODEL_ICONS: Record<string, string> = {
    chatgpt: "smart_toy",
    midjourney: "auto_awesome",
    "nanobanana/gemini": "palette",
    gemini: "palette",
    "dall-e": "brush",
    "stable diffusion": "image",
    leonardo: "draw",
};

function getModelIcon(model: string): string {
    const key = model.trim().toLowerCase();
    return MODEL_ICONS[key] ?? "smart_toy";
}

/* ── Helpers ── */
const INITIAL_VISIBLE = 14;

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

/* ── Componente principal ── */
export default function SearchFilters({
    onSearchChange,
    onTagToggle,
    onModelToggle,
    activeTags,
    activeModel,
    searchQuery,
    dynamicTags = [],
    modelNames = [],
    tagCounts = {},
    modelCounts = {},
}: SearchFiltersProps) {
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [categorySearch, setCategorySearch] = useState("");
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(true);

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

    const uniqueModels = useMemo(() => deduplicateStrings(modelNames), [modelNames]);
    const uniqueTags = useMemo(() => deduplicateStrings(dynamicTags), [dynamicTags]);

    const totalActiveFilters = activeTags.length + (activeModel ? 1 : 0);

    const handleClearAll = useCallback(() => {
        activeTags.forEach((t) => onTagToggle(t));
        if (activeModel) onModelToggle(activeModel);
    }, [activeTags, activeModel, onTagToggle, onModelToggle]);

    /* Filtrar categorias pelo mini-search */
    const visibleTags = useMemo(() => {
        let filtered = uniqueTags;

        if (categorySearch.trim()) {
            const q = categorySearch.trim().toLowerCase();
            filtered = uniqueTags.filter((t) =>
                t.toLowerCase().includes(q)
            );
        }

        if (!showAllCategories && !categorySearch.trim()) {
            return filtered.slice(0, INITIAL_VISIBLE);
        }
        return filtered;
    }, [uniqueTags, categorySearch, showAllCategories]);

    const hiddenCount = useMemo(() => {
        if (categorySearch.trim()) return 0;
        return Math.max(0, uniqueTags.length - INITIAL_VISIBLE);
    }, [uniqueTags.length, categorySearch]);

    const hasAnyCounts =
        Object.keys(tagCounts).length > 0 ||
        Object.keys(modelCounts).length > 0;

    const getCount = useCallback(
        (tag: string, isModel?: boolean) => {
            const counts = isModel ? modelCounts : tagCounts;
            const key = tag.trim().toLowerCase();
            return counts[tag] ?? counts[key] ?? 0;
        },
        [tagCounts, modelCounts]
    );

    return (
        <div className="relative z-40">
            {/* ═══ Search bar (sempre visível) ═══ */}
            <div className="relative input-glass group mb-4">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">
                    search
                </span>
                <input
                    type="text"
                    value={localQuery}
                    onChange={handleInputChange}
                    placeholder="Pesquisar por título ou prompt..."
                    className="w-full pl-12 pr-32 py-3.5 bg-transparent border-none text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 transition-all font-sans"
                />
                <button
                    onClick={() => setFiltersOpen((p) => !p)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 ${filtersOpen
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10"
                        }`}
                >
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    Filtros
                    {totalActiveFilters > 0 && (
                        <span className="bg-primary text-white text-[9px] font-bold rounded-full size-4 flex items-center justify-center">
                            {totalActiveFilters}
                        </span>
                    )}
                </button>
            </div>

            {/* ═══ Active filters bar ═══ */}
            {totalActiveFilters > 0 && (
                <div className="flex items-center flex-wrap gap-2 mb-4 animate-[fadeIn_0.3s_ease-out]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5 mr-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Filtros ativos:
                    </span>
                    {activeModel && (
                        <button
                            onClick={() => onModelToggle(activeModel)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/25 transition-all hover:bg-primary/25 cursor-pointer hover-lift"
                        >
                            <span className="material-symbols-outlined text-[13px]">{getModelIcon(activeModel)}</span>
                            {activeModel}
                            <span className="material-symbols-outlined text-[12px] opacity-60">close</span>
                        </button>
                    )}
                    {activeTags.map((tag) => (
                        <button
                            key={`active-${tag}`}
                            onClick={() => onTagToggle(tag)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/25 transition-all hover:bg-primary/25 cursor-pointer hover-lift"
                        >
                            {tag}
                            <span className="material-symbols-outlined text-[12px] opacity-60">close</span>
                        </button>
                    ))}
                    <button
                        onClick={handleClearAll}
                        className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest cursor-pointer ml-2 flex items-center gap-1"
                    >
                        Limpar tudo
                        <span className="material-symbols-outlined text-[13px]">delete_sweep</span>
                    </button>
                </div>
            )}

            {/* ═══ Filters panel (collapsible) ═══ */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${filtersOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.06] p-5">

                    {/* ── Destaque: Ensaio Fotográfico ── */}
                    <div className="mb-5 rounded-xl p-4 bg-gradient-to-r from-primary/[0.06] to-transparent border border-primary/10">
                        <div className="flex items-center gap-2.5 mb-3">
                            <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                            <div>
                                <h4 className="text-[11px] font-bold font-sora tracking-widest uppercase text-white">
                                    Ensaio Fotográfico com IA
                                </h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">Retratos e looks profissionais</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["Corporate", "Portrait", "Fashion"].map((tag) => {
                                const isActive = activeTags.some(
                                    (at) => at.trim().toLowerCase() === tag.trim().toLowerCase()
                                );
                                const count = getCount(tag);
                                return (
                                    <button
                                        key={`featured-${tag}`}
                                        onClick={() => onTagToggle(tag)}
                                        className={`px-4 py-2 rounded-lg text-[11px] font-semibold tracking-wide cursor-pointer transition-all duration-300 hover-lift inline-flex items-center gap-2 ${isActive
                                            ? "bg-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.3)] border border-primary-light/50"
                                            : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                                            }`}
                                    >
                                        {tag}
                                        {hasAnyCounts && count > 0 && (
                                            <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"}`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Layout em grid: Modelos | Categorias ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

                        {/* ════ Coluna esquerda: Modelos de IA ════ */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold font-sora tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2 px-1">
                                <span className="material-symbols-outlined text-[15px] text-primary">smart_toy</span>
                                Modelo de IA
                            </h3>
                            <div className="space-y-1.5">
                                {uniqueModels.map((model) => {
                                    const isActive =
                                        activeModel.trim().toLowerCase() === model.trim().toLowerCase();
                                    const count = getCount(model, true);
                                    return (
                                        <button
                                            key={model}
                                            onClick={() => onModelToggle(model)}
                                            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-all duration-300 hover-lift ${isActive
                                                ? "bg-primary/15 text-white border border-primary/30 shadow-[0_0_15px_rgba(255,107,0,0.1)]"
                                                : "bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent hover:border-white/10"
                                                }`}
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${isActive ? "text-primary" : "text-slate-500"}`}>
                                                {getModelIcon(model)}
                                            </span>
                                            <span className="flex-1 text-left truncate">{model}</span>
                                            {hasAnyCounts && count > 0 && (
                                                <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${isActive ? "bg-primary/30 text-primary-light" : "bg-white/5 text-slate-500"}`}>
                                                    {count}
                                                </span>
                                            )}
                                            {isActive && (
                                                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ════ Coluna direita: Categorias ════ */}
                        <div className="space-y-3 lg:border-l lg:border-white/5 lg:pl-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-bold font-sora tracking-[0.2em] uppercase text-slate-400 flex items-center gap-2 px-1">
                                    <span className="material-symbols-outlined text-[15px] text-primary">label</span>
                                    Categorias
                                    <span className="text-[9px] font-normal text-slate-600 ml-1">{uniqueTags.length}</span>
                                </h3>
                            </div>

                            {/* Mini search */}
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[15px]">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={categorySearch}
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                    placeholder="Filtrar categorias..."
                                    className="w-full pl-9 pr-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_15px_rgba(255,107,0,0.06)] transition-all font-sans"
                                />
                            </div>

                            {/* Tag chips */}
                            <div className="flex flex-wrap gap-1.5">
                                {visibleTags.map((tag) => {
                                    const isActive = activeTags.includes(tag);
                                    const count = getCount(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => onTagToggle(tag)}
                                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide cursor-pointer transition-all duration-300 hover-lift inline-flex items-center gap-1.5 ${isActive
                                                ? "bg-primary text-white shadow-[0_0_12px_rgba(255,107,0,0.25)] border border-primary-light/50"
                                                : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
                                                }`}
                                        >
                                            {tag}
                                            {hasAnyCounts && count > 0 && (
                                                <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"}`}>
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Ver mais / Ver menos */}
                            {!categorySearch.trim() && hiddenCount > 0 && (
                                <button
                                    onClick={() => setShowAllCategories((p) => !p)}
                                    className="text-[10px] font-bold text-primary hover:text-primary-light uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center gap-1 px-1 pt-1"
                                >
                                    {showAllCategories ? (
                                        <>
                                            Ver menos
                                            <span className="material-symbols-outlined text-[14px]">expand_less</span>
                                        </>
                                    ) : (
                                        <>
                                            Ver mais (+{hiddenCount})
                                            <span className="material-symbols-outlined text-[14px]">expand_more</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
