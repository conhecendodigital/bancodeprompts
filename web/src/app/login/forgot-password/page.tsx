"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login/reset-password`,
        });

        if (error) {
            setMessage({ type: "error", text: "Erro ao enviar o e-mail de recuperação. Verifique se o e-mail está correto." });
        } else {
            setMessage({ type: "success", text: "E-mail de recuperação enviado! Verifique sua caixa de entrada e spam." });
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark font-sans items-center justify-center p-6 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-[420px] relative z-10 glass-card p-8 rounded-[2rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                {/* Branding */}
                <div className="flex flex-col items-center gap-4 mb-10">
                    <div className="size-12 bg-gradient-to-tr from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.4)] border border-white/20">
                        <span className="text-white text-base font-black font-display tracking-wider">BP</span>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black font-display tracking-tight text-white mb-2">
                            Recuperar Senha
                        </h2>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            Digite seu e-mail para receber um link mágico de redefinição.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                    {/* Alerts */}
                    {message && (
                        <div className={`animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-2xl px-5 py-4 border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                            <span className={`material-symbols-outlined text-[20px] mt-0.5 ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                {message.type === 'error' ? 'error' : 'check_circle'}
                            </span>
                            <p className={`text-sm font-medium leading-relaxed ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                {message.text}
                            </p>
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2.5 ml-1"
                        >
                            Sua conta de e-mail
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative input-glass rounded-2xl overflow-hidden flex items-center border border-white/10 group-focus-within:border-primary/50 transition-colors bg-[#110e1f]/80">
                                <span className="material-symbols-outlined text-slate-500 text-[20px] pl-5 group-focus-within:text-primary transition-colors">
                                    mail
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    className="w-full bg-transparent text-white placeholder-slate-600 px-4 py-4.5 text-sm font-medium focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || message?.type === 'success'}
                            className="btn-magnetic relative w-full group overflow-hidden rounded-2xl border border-white/10 bg-primary/90 text-white font-bold tracking-widest text-[12px] uppercase transition-all duration-300 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_40px_rgba(255,107,0,0.5)]"
                            style={{ minHeight: '56px' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]"></div>

                            <div className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        ENVIANDO...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">send</span>
                                        ENVIAR LINK MAGICO
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </form>

                {/* Back to Login */}
                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Voltar para o Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
