"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 no-underline cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                            <span className="text-white text-sm font-bold">BP</span>
                        </div>
                        <span className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--text)]">
                            Banco de Prompts
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-sm font-medium text-[var(--accent)] border-b-2 border-[var(--accent)] pb-0.5 no-underline cursor-pointer"
                        >
                            Explorar
                        </Link>
                        <Link
                            href="#sobre"
                            className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors no-underline cursor-pointer"
                        >
                            Sobre
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                        aria-label="Menu"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            {menuOpen ? (
                                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            ) : (
                                <>
                                    <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                {menuOpen && (
                    <nav className="md:hidden pb-4 flex flex-col gap-2">
                        <Link
                            href="/"
                            onClick={() => setMenuOpen(false)}
                            className="text-sm font-medium text-[var(--accent)] py-2 no-underline cursor-pointer"
                        >
                            Explorar
                        </Link>
                        <Link
                            href="#sobre"
                            onClick={() => setMenuOpen(false)}
                            className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] py-2 no-underline cursor-pointer"
                        >
                            Sobre
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
