"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // We only want to run this if there is a valid session
    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If there's no session, they shouldn't be here (the link from email automatically logs them in)
                setMessage({ type: "error", text: "Link de redefinição inválido ou expirado." });
            }
        };
        checkSession();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "As senhas não coincidem." });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: "error", text: "A senha deve ter pelo menos 6 caracteres." });
            return;
        }

        setLoading(true);
        setMessage(null);

        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage({ type: "error", text: "Erro ao atualizar a senha: " + error.message });
        } else {
            setMessage({ type: "success", text: "Senha atualizada com sucesso! Redirecionando..." });
            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 2000);
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
                            Criar Nova Senha
                        </h2>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            Insira a sua nova senha abaixo para restaurar o acesso à biblioteca.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
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

                    {/* Form Inputs Container */}
                    <div className="space-y-5">
                        {/* New Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2.5 ml-1"
                            >
                                Nova Senha
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative input-glass rounded-2xl overflow-hidden flex items-center border border-white/10 group-focus-within:border-primary/50 transition-colors bg-[#110e1f]/80">
                                    <span className="material-symbols-outlined text-slate-500 text-[20px] pl-5 group-focus-within:text-primary transition-colors">
                                        lock
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-transparent text-white placeholder-slate-600 px-4 py-4.5 text-sm font-medium focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="pr-5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                        title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2.5 ml-1"
                            >
                                Confirmar Nova Senha
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative input-glass rounded-2xl overflow-hidden flex items-center border border-white/10 group-focus-within:border-primary/50 transition-colors bg-[#110e1f]/80">
                                    <span className="material-symbols-outlined text-slate-500 text-[20px] pl-5 group-focus-within:text-primary transition-colors">
                                        lock_reset
                                    </span>
                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-transparent text-white placeholder-slate-600 px-4 py-4.5 text-sm font-medium focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || message?.type === 'success' || message?.text === "Link de redefinição inválido ou expirado."}
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
                                        ATUALIZANDO...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">save</span>
                                        SALVAR NOVA SENHA
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </form>

                {/* Back Link */}
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
