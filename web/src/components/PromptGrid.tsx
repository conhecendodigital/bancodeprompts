import PromptCard from "./PromptCard";
import type { Prompt } from "@/lib/supabase";

interface PromptGridProps {
    prompts: Prompt[];
    loading: boolean;
}

function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] shadow-[var(--shadow-card)] animate-pulse">
            <div className="aspect-[4/3] bg-gray-700" />
            <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-600 rounded w-full" />
                <div className="h-3 bg-gray-600 rounded w-4/5" />
                <div className="h-3 bg-gray-600 rounded w-3/5" />
                <div className="flex justify-between items-center pt-1">
                    <div className="h-6 bg-gray-600 rounded-full w-20" />
                    <div className="h-3 bg-gray-600 rounded w-16" />
                </div>
            </div>
        </div>
    );
}

export default function PromptGrid({ prompts, loading }: PromptGridProps) {
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-light)] mb-4">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
                    Nenhum prompt encontrado
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                    Tente ajustar sua busca ou remover alguns filtros.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
            ))}
        </div>
    );
}
