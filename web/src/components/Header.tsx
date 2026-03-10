"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Don't render header on login page
    if (pathname === "/login") return null;

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="glass-header sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 no-underline cursor-pointer group">
                        <div className="size-10 bg-gradient-to-tr from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.4)] border border-white/20 group-hover:scale-105 transition-transform">
                            <span className="text-white text-sm font-black font-display tracking-wider">BP</span>
                        </div>
                        <div>
                            <span className="block text-lg font-black font-display tracking-tight leading-none text-white">Banco de Prompts</span>
                            <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Biblioteca Exclusiva</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-semibold text-primary border-b-2 border-primary pb-0.5 no-underline cursor-pointer"
                        >
                            Explorar
                        </Link>
                        <Link
                            href="#sobre"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors no-underline cursor-pointer hover-lift"
                        >
                            Sobre
                        </Link>
                        <div className="w-px h-5 bg-white/10 mx-1" />
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">logout</span>
                            SAIR
                        </button>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        aria-label="Menu"
                    >
                        <span className="material-symbols-outlined text-[24px]">
                            {menuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>

                {/* Mobile Nav */}
                {menuOpen && (
                    <nav className="md:hidden py-4 border-t border-white/10 flex flex-col gap-2">
                        <Link
                            href="/"
                            onClick={() => setMenuOpen(false)}
                            className="text-sm font-semibold text-primary py-3 px-4 bg-primary/10 rounded-lg no-underline cursor-pointer"
                        >
                            Explorar
                        </Link>
                        <Link
                            href="#sobre"
                            onClick={() => setMenuOpen(false)}
                            className="text-sm font-medium text-slate-400 hover:text-white py-3 px-4 hover:bg-white/5 rounded-lg transition-colors no-underline cursor-pointer"
                        >
                            Sobre
                        </Link>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                handleLogout();
                            }}
                            className="flex items-center gap-2 text-sm font-medium text-red-400 py-3 px-4 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-left"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Sair
                        </button>
                    </nav>
                )}
            </div>
        </header>
    );
}
