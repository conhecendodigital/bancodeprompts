"use client";

import { useState } from "react";
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
        "from-purple-600 to-blue-600",
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
        <div className="group relative rounded-2xl overflow-hidden bg-[var(--bg-card)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                {prompt.image_url ? (
                    <img
                        src={prompt.image_url}
                        alt={prompt.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className={`w-full h-full bg-gradient-to-br ${placeholderGradients[gradientIndex]} flex items-center justify-center`}
                    >
                        <span className="text-white/30 text-6xl font-bold">
                            {prompt.title.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Title badge - top left */}
                <div className="absolute top-3 left-3 right-16 flex items-center">
                    <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full truncate">
                        {prompt.title}
                    </span>
                </div>
            </div>

            {/* Bottom content */}
            <div className="p-4">
                {/* Prompt preview */}
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 mb-3 min-h-[3.75rem]">
                    {prompt.full_prompt}
                </p>

                {/* Footer: Copy button + Author */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleCopy}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${copied
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                Copiado!
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Copiar
                            </>
                        )}
                    </button>

                    {prompt.author_name && (
                        <span className="text-xs text-gray-400">
                            por{" "}
                            <span className="text-gray-300 font-medium">
                                {prompt.author_name}
                            </span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
