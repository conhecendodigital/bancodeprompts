"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase, type Prompt } from "@/lib/supabase";

function DetailSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-5 w-48 bg-white/10 rounded-md mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="aspect-[4/3] bg-white/10 rounded-3xl" />
                <div className="space-y-5">
                    <div className="h-10 bg-white/10 rounded-xl w-3/4" />
                    <div className="h-4 bg-white/10 rounded-md w-1/3" />
                    <div className="mt-8 space-y-3">
                        <div className="h-4 bg-white/10 rounded-md w-full" />
                        <div className="h-4 bg-white/10 rounded-md w-full" />
                        <div className="h-4 bg-white/10 rounded-md w-5/6" />
                        <div className="h-4 bg-white/10 rounded-md w-4/5" />
                    </div>
                    <div className="h-12 bg-white/10 rounded-xl w-40 mt-6" />
                    <div className="flex gap-3 mt-8">
                        <div className="h-8 w-24 bg-white/10 rounded-full" />
                        <div className="h-8 w-28 bg-white/10 rounded-full" />
                        <div className="h-8 w-20 bg-white/10 rounded-full" />
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
            const { data, error } = await supabase()
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

    const placeholderGradients = [
        "from-orange-600 to-blue-600",
        "from-amber-600 to-red-600",
        "from-emerald-600 to-teal-600",
        "from-pink-600 to-rose-600",
        "from-indigo-600 to-violet-600",
        "from-orange-600 to-yellow-600",
    ];

    const gradientIndex = prompt
        ? prompt.original_id
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        placeholderGradients.length
        : 0;

    return (
        <div className="min-h-screen bg-background-dark pt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-10 no-underline hover-lift"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        arrow_back
                    </span>
                    Voltar para a Galeria
                </Link>

                {/* Loading state */}
                {loading && <DetailSkeleton />}

                {/* Not found */}
                {notFound && !loading && (
                    <div className="text-center py-20 glass-card rounded-3xl border border-white/5 max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center size-24 rounded-3xl bg-primary/10 mb-8 shadow-[0_0_30px_rgba(255,107,0,0.2)] border border-primary/20">
                            <span className="material-symbols-outlined text-[40px] text-primary">search_off</span>
                        </div>
                        <h2 className="text-3xl font-black font-display tracking-tight text-white mb-4">
                            Prompt não encontrado
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            O prompt que você procura não existe ou foi removido.
                        </p>
                        <Link
                            href="/"
                            className="btn-magnetic inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold tracking-widest text-[11px] uppercase shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] border border-primary-light/50 transition-all no-underline"
                        >
                            <span className="material-symbols-outlined text-[16px]">gallery_thumbnail</span>
                            Voltar à galeria
                        </Link>
                    </div>
                )}

                {/* Detail content */}
                {prompt && !loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Left column — Image */}
                        <div className="relative sticky top-32">
                            {prompt.image_url ? (
                                <img
                                    src={prompt.image_url}
                                    alt={prompt.title}
                                    className="w-full rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] border border-white/10 object-cover object-center aspect-[4/3] lg:aspect-auto"
                                />
                            ) : (
                                <div className={`w-full aspect-[4/3] rounded-3xl bg-gradient-to-br ${placeholderGradients[gradientIndex]} flex items-center justify-center shadow-[0_10px_50px_rgba(0,0,0,0.5)] border border-white/10`}>
                                    <span className="text-white/30 text-[10rem] font-black font-display tracking-tighter mix-blend-overlay">
                                        {prompt.title.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right column — Info */}
                        <div className="py-2">
                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-[1.1] mb-8">
                                {prompt.title}
                            </h1>

                            {/* Prompt block */}
                            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 shadow-inner group">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-blue-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 rounded-2xl"></div>
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold tracking-widest uppercase text-slate-500 flex items-center gap-1">
                                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        PROMPT PRONTO
                                    </span>
                                </div>
                                <p className="text-base sm:text-lg text-slate-300 leading-relaxed whitespace-pre-wrap font-sans font-medium">
                                    {prompt.full_prompt}
                                </p>
                            </div>

                            {/* Copy button */}
                            <button
                                onClick={handleCopy}
                                className={`btn-magnetic inline-flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 rounded-xl text-[12px] font-bold tracking-widest uppercase transition-all duration-300 ${copied
                                    ? "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                                    : "bg-primary text-white shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] border border-primary-light/50 hover:scale-105"
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                        PROMPT COPIADO
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">content_copy</span>
                                        COPIAR PROMPT
                                    </>
                                )}
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/10">
                                {/* Onde Usar — só exibe se model_name existir */}
                                {prompt.model_name && (
                                    <div>
                                        <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">integration_instructions</span>
                                            ONDE USAR
                                        </h3>
                                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-primary/10 border border-primary/20 rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.1)]">
                                            <span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
                                            <span className="text-sm font-bold text-primary tracking-wide">
                                                {prompt.model_name}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {prompt.tags && prompt.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">sell</span>
                                            CATEGORIAS
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {prompt.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-4 py-2 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold rounded-lg border border-white/10 cursor-default"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
