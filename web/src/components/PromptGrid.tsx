"use client";

import { useEffect, useRef } from "react";
import PromptCard from "./PromptCard";
import type { Prompt } from "@/lib/supabase";

interface PromptGridProps {
    prompts: Prompt[];
    loading: boolean;
    loadingMore?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
}

function SkeletonCard() {
    return (
        <div className="glass-card rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/10 animate-pulse">
            <div className="aspect-[4/3] bg-white/5" />
            <div className="p-5 space-y-4">
                <div className="h-4 bg-white/10 rounded-md w-full" />
                <div className="h-4 bg-white/10 rounded-md w-4/5" />
                <div className="h-4 bg-white/10 rounded-md w-3/5" />
                <div className="flex justify-between items-center pt-2">
                    <div className="h-8 bg-white/10 rounded-full w-24" />
                    <div className="h-4 bg-white/10 rounded-md w-16" />
                </div>
            </div>
        </div>
    );
}

export default function PromptGrid({
    prompts,
    loading,
    loadingMore = false,
    hasMore = false,
    onLoadMore,
}: PromptGridProps) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver para paginação infinita
    useEffect(() => {
        if (!onLoadMore || !hasMore || loading) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    onLoadMore();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [onLoadMore, hasMore, loading, loadingMore]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (prompts.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-primary/10 mb-6 shadow-[0_0_30px_rgba(255,107,0,0.2)] border border-primary/20">
                    <span className="material-symbols-outlined text-[32px] text-primary">search_off</span>
                </div>
                <h3 className="text-xl font-bold font-sora tracking-tight text-white mb-2">
                    Nenhum prompt encontrado
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Tente ajustar sua busca ou remover alguns filtros para encontrar o que procura.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                ))}
            </div>

            {/* Sentinel para infinite scroll */}
            {hasMore && (
                <div ref={sentinelRef} className="mt-12">
                    {loadingMore && (
                        <div className="flex flex-col items-center justify-center gap-4 py-8">
                            <div className="size-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
                            <span className="text-sm font-semibold tracking-wider text-primary uppercase">
                                Carregando mais prompts...
                            </span>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
