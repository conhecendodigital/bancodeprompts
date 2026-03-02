"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, supabase as getSupabase, type Prompt } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Showcase Prompts State
    const [showcasePrompts, setShowcasePrompts] = useState<Prompt[]>([]);
    const [activePromptIndex, setActivePromptIndex] = useState(0);

    // Fetch showcase prompts
    useEffect(() => {
        async function fetchShowcase() {
            const supabase = getSupabase();
            // Try fetching featured or just random/latest prompts
            const { data } = await supabase
                .from("published_prompts_view")
                .select("*")
                .order("captured_at", { ascending: false })
                .limit(10);

            if (data && data.length > 0) {
                setShowcasePrompts(data);
            }
        }
        fetchShowcase();
    }, []);

    // Slider effect
    useEffect(() => {
        if (showcasePrompts.length === 0) return;
        const interval = setInterval(() => {
            setActivePromptIndex((current) => (current + 1) % showcasePrompts.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, [showcasePrompts.length]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError("E-mail ou senha incorretos. Verifique suas credenciais.");
            setLoading(false);
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background-dark font-sans overflow-x-hidden">
            {/* ─── LEFT SIDE: Branding & Features (Visible on Mobile now) ─── */}
            <div className="flex w-full lg:w-[50%] xl:w-[55%] relative flex-col justify-center lg:justify-between py-12 px-6 sm:p-12 lg:border-r border-b lg:border-b-0 border-white/5 bg-[#0f0c1b]/80 backdrop-blur-3xl overflow-hidden min-h-[max-content] lg:min-h-screen">
                {/* Background effects for the left side */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[700px] bg-purple-600/10 rounded-full blur-[150px]" />
                    {/* Subtle grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    ></div>
                </div>

                {/* Top Branding */}
                <div className="relative z-10 lg:pl-4 xl:pl-12 pt-4">
                    <div className="hidden lg:flex items-center gap-3 mb-16">
                        <div className="size-10 bg-gradient-to-tr from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(123,97,255,0.4)] border border-white/20">
                            <span className="text-white text-sm font-black font-display tracking-wider">BP</span>
                        </div>
                        <span className="text-xl font-black font-display tracking-tight text-white">
                            Banco de Prompts
                        </span>
                    </div>

                    <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
                        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black font-display tracking-tight text-white leading-[1.05] mb-4 sm:mb-6">
                            Sua biblioteca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">prompts premium</span>.
                        </h1>
                        <p className="text-slate-400 text-base sm:text-lg xl:text-xl leading-relaxed mb-8 sm:mb-10 max-w-md mx-auto lg:mx-0">
                            Acesse centenas de prompts de alta conversão, testados e validados para gerar imagens incríveis.
                        </p>
                    </div>
                </div>

                {/* Realistic Animated Prompt Card Mockup - Huge & Dynamic */}
                <div className="relative z-10 w-full max-w-[480px] xl:max-w-[560px] self-center mt-auto opacity-95 hover:opacity-100 transition-opacity duration-300">
                    {/* Glow behind the card */}
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-[2rem] transform scale-95 translate-y-6"></div>

                    <div className="relative glass-card rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)] group">

                        {/* Mockup Image Carousel */}
                        <div className="h-64 sm:h-80 xl:h-96 w-full relative overflow-hidden bg-[#05040a]">
                            {showcasePrompts.length > 0 ? (
                                showcasePrompts.map((prompt, index) => (
                                    <div
                                        key={prompt.id}
                                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activePromptIndex ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img
                                            src={prompt.image_url || "https://picsum.photos/seed/ai/800/600"}
                                            alt={prompt.title}
                                            className={`object-cover w-full h-full transform transition-transform duration-[6000ms] ${index === activePromptIndex ? 'scale-110' : 'scale-100'}`}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                /* Loading/Skeleton State */
                                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0812]">
                                    <span className="material-symbols-outlined text-primary/30 text-5xl animate-pulse">image</span>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0812] via-[#0a0812]/20 to-transparent opacity-90 z-10"></div>

                            {/* Top Badges */}
                            <div className="absolute top-5 left-5 flex gap-2 z-20">
                                {showcasePrompts[activePromptIndex]?.model_name && (
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-white/10 uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all duration-300">
                                        <span className="size-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        {showcasePrompts[activePromptIndex].model_name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Card Content Carousel */}
                        <div className="p-6 sm:p-8 xl:p-10 flex flex-col gap-6 bg-[#0a0812] relative overflow-hidden min-h-[180px]">
                            {showcasePrompts.length > 0 ? (
                                showcasePrompts.map((prompt, index) => (
                                    <div
                                        key={prompt.id}
                                        className={`absolute inset-x-6 sm:inset-x-8 xl:inset-x-10 top-6 sm:top-8 xl:top-10 flex flex-col gap-5 transition-all duration-700 ease-in-out ${index === activePromptIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                                    >
                                        <p className="text-white text-base xl:text-lg font-medium leading-relaxed line-clamp-3">
                                            <span className="text-primary/90 mr-1.5 font-bold">/imagine prompt:</span>
                                            {prompt.full_prompt}
                                        </p>

                                        <div className="flex items-center justify-between pt-3">
                                            <div className="flex gap-2 flex-wrap">
                                                {prompt.tags?.slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="text-[10px] xl:text-[11px] uppercase tracking-wider font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="size-10 xl:size-12 rounded-xl flex items-center justify-center bg-white/5 text-slate-400 border border-white/5 transition-colors cursor-default">
                                                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Loading state for text */
                                <div className="flex flex-col gap-4 animate-pulse">
                                    <div className="h-4 bg-white/5 rounded w-full"></div>
                                    <div className="h-4 bg-white/5 rounded w-5/6"></div>
                                    <div className="h-4 bg-white/5 rounded w-4/6"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── RIGHT SIDE: Login Form ─── */}
            <div className="w-full lg:w-[55%] xl:w-[50%] flex items-center justify-center p-6 sm:p-12 relative">
                {/* Subtle light leak for the right side */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="w-full max-w-[420px] relative z-10">
                    {/* Form Header */}
                    <div className="mb-10 lg:mt-0 mt-4">
                        <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mb-2">
                            Acesse sua conta
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Insira suas credenciais para visualizar os prompts.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4">
                                <span className="material-symbols-outlined text-red-400 text-[20px] mt-0.5">
                                    error
                                </span>
                                <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
                            </div>
                        )}

                        {/* Form Inputs Container */}
                        <div className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2.5 ml-1"
                                >
                                    E-mail de acesso
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
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

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2.5 ml-1"
                                >
                                    Senha
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
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
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-magnetic relative w-full group overflow-hidden rounded-2xl border border-white/10 bg-primary/90 text-white font-bold tracking-widest text-[12px] uppercase transition-all duration-300 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(123,97,255,0.2)] hover:shadow-[0_0_40px_rgba(123,97,255,0.5)]"
                                style={{ minHeight: '56px' }}
                            >
                                {/* Button background glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]"></div>

                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            ENTRANDO...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">login</span>
                                            ACESSAR BIBLIOTECA
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>

                    {/* Support / Help */}
                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-xs">
                            Ainda não tem acesso? Adquira na{" "}
                            <a href="https://hotmart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light font-semibold transition-colors underline-offset-4 hover:underline">
                                Hotmart
                            </a>.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
