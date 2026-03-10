"use client";

import { useState } from "react";
import Link from "next/link";
import type { Prompt } from "@/lib/supabase";

interface PromptCardProps {
    prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(prompt.full_prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
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

    const gradientIndex =
        prompt.original_id
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        placeholderGradients.length;

    return (
        <Link href={`/prompts/${prompt.original_id}`} className="block no-underline">
            <div className="group relative rounded-2xl overflow-hidden glass-card shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_40px_rgba(255,107,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer aspect-[3/4] border border-white/10 hover:border-primary/50">
                {/* Image */}
                <div className="absolute inset-0 overflow-hidden">
                    {prompt.image_url ? (
                        <img
                            src={prompt.image_url}
                            alt={prompt.title}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div
                            className={`w-full h-full bg-gradient-to-br ${placeholderGradients[gradientIndex]} flex items-center justify-center`}
                        >
                            <span className="text-white/30 text-6xl font-black font-display tracking-tighter mix-blend-overlay">
                                {prompt.title.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Title badge - top left */}
                    <div className="absolute top-3 left-3 right-16 flex items-center">
                        <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg truncate border border-white/10 shadow-lg">
                            {prompt.title}
                        </span>
                    </div>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent p-5 pt-20 transition-all duration-300 group-hover:from-background-dark group-hover:via-background-dark/95">
                    {/* Prompt preview */}
                    <p className="text-sm font-medium text-slate-300 leading-relaxed line-clamp-3 mb-4 group-hover:text-white transition-colors duration-300">
                        {prompt.full_prompt}
                    </p>

                    {/* Footer: Copy button */}
                    <div className="flex items-center">
                        <button
                            onClick={handleCopy}
                            className={`inline-flex items-center gap-2 text-[11px] font-bold tracking-widest px-4 py-2 rounded-xl transition-all duration-300 hover-lift ${copied
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
                                }`}
                        >
                            {copied ? (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">check</span>
                                    COPIADO
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                    COPIAR PROMPT
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
