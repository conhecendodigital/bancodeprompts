"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase, type Prompt } from "@/lib/supabase";

function DetailSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-5 w-48 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="mt-6 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 rounded w-4/5" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded-xl w-36 mt-4" />
                    <div className="flex gap-2 mt-6">
                        <div className="h-7 w-20 bg-gray-200 rounded-full" />
                        <div className="h-7 w-24 bg-gray-200 rounded-full" />
                        <div className="h-7 w-16 bg-gray-200 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PromptDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchPrompt() {
            setLoading(true);
            const { data, error } = await supabase
                .from("published_prompts_view")
                .select("*")
                .eq("original_id", id)
                .limit(1)
                .maybeSingle();

            if (error || !data) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setPrompt(data);
            setLoading(false);
        }

        fetchPrompt();
    }, [id]);

    const handleCopy = async () => {
        if (!prompt) return;
        try {
            await navigator.clipboard.writeText(prompt.full_prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = prompt.full_prompt;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8 no-underline"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Voltar para a galeria
                </Link>

                {/* Loading state */}
                {loading && <DetailSkeleton />}

                {/* Not found */}
                {notFound && !loading && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
                            Prompt não encontrado
                        </h2>
                        <p className="text-[var(--text-muted)] mb-6">
                            O prompt que você procura não existe ou foi removido.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-xl font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors no-underline"
                        >
                            Voltar à galeria
                        </Link>
                    </div>
                )}

                {/* Detail content */}
                {prompt && !loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left column — Image */}
                        <div className="relative">
                            {prompt.image_url ? (
                                <img
                                    src={prompt.image_url}
                                    alt={prompt.title}
                                    className="w-full rounded-2xl shadow-lg object-cover object-center"
                                />
                            ) : (
                                <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white/30 text-8xl font-bold">
                                        {prompt.title.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right column — Info */}
                        <div>
                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] leading-tight mb-6">
                                {prompt.title}
                            </h1>

                            {/* Prompt block */}
                            <div className="relative bg-slate-50 border border-[var(--border)] rounded-xl p-5 mb-4">
                                <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap font-mono">
                                    {prompt.full_prompt}
                                </p>
                            </div>

                            {/* Copy button */}
                            <button
                                onClick={handleCopy}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${copied
                                    ? "bg-emerald-500 text-white"
                                    : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm"
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                        Copiar Prompt
                                    </>
                                )}
                            </button>

                            {/* Onde Usar — só exibe se model_name existir */}
                            {prompt.model_name && (
                                <div className="mt-8">
                                    <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
                                        ONDE USAR
                                    </h3>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-[var(--border)] rounded-xl">
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
                                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                            <path d="M2 17l10 5 10-5" />
                                            <path d="M2 12l10 5 10-5" />
                                        </svg>
                                        <span className="text-sm font-medium text-[var(--text)]">
                                            {prompt.model_name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {prompt.tags && prompt.tags.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
                                        TAGS
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {prompt.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1.5 bg-[var(--accent-light)] text-[var(--accent)] text-xs font-medium rounded-full border border-[var(--accent)]/20"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
