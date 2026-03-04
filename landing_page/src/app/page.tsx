"use client";

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Brain, Clock, TrendingUp, PenTool, Target, ChevronDown, ArrowRight, Star, CheckCircle2, Sparkles, Layers, BookOpen, Shield, Play, Award } from 'lucide-react';
import Image from 'next/image';
import { supabase, type Prompt } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

/* ==========================================
   NAVBAR — "A Ilha Flutuante"
   ========================================== */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full transition-all duration-700 ease-out flex items-center gap-6 ${scrolled
      ? 'bg-primary/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-accent/5'
      : 'bg-transparent'
      }`}>
      <div className="flex items-center gap-3">
        <Image src="/images/logo.png" alt="Banco de Prompts" width={40} height={40} className="rounded-md" />
        <span className="font-heading font-bold text-base md:text-lg tracking-tight whitespace-nowrap">
          banco<span className="text-accent">deprompts</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-5 text-sm font-medium text-white/70">
        <button onClick={() => scrollTo('problem')} className="hover-lift hover:text-white transition-colors">A Oportunidade</button>
        <button onClick={() => scrollTo('modules')} className="hover-lift hover:text-white transition-colors">Módulos</button>
        <button onClick={() => scrollTo('faq')} className="hover-lift hover:text-white transition-colors">FAQ</button>
      </div>
      <button onClick={() => scrollTo('pricing')} className="btn-magnetic bg-accent text-white text-sm font-semibold px-5 py-2 rounded-full ml-auto md:ml-2 whitespace-nowrap">
        <span className="btn-bg bg-white/20"></span>
        <span className="relative z-10">Acessar</span>
      </button>
    </nav>
  );
}

/* ==========================================
   HERO — "A Cena de Abertura"
   ========================================== */
function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-anim', {
        y: 50, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'power3.out', delay: 0.3,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] flex items-center overflow-hidden pt-12 pb-16 md:pt-24 md:pb-28">
      {/* O background agora precisa testar se public/images/hero-bg.png existe, se não deixamos fallback pro gradiente */}
      <div className="absolute inset-0 bg-cover bg-center md:bg-top" style={{ backgroundImage: `url('/images/hero-bg.png')` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-primary) 0%, rgba(10, 10, 20, 0.85) 50%, rgba(10, 10, 20, 0.6) 100%)' }} />

      <div className="relative z-10 section-container w-full h-full flex items-center pt-8 md:pt-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 w-full">
          <div className="max-w-2xl w-full text-center lg:text-left pt-10 md:pt-0">
            <div className="hero-anim flex items-center justify-center lg:justify-start gap-2 mb-6">
              <div className="accent-pulse"></div>
              <span className="font-mono text-[10px] md:text-xs text-accent tracking-widest uppercase">Mais que uma ferramenta, um método</span>
            </div>

            <h1 className="hero-anim hero-title-sans font-heading font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight mb-2">
              O atalho para imagens <span className="text-white/40">perfeitas.</span>
            </h1>
            <h1 className="hero-anim font-mono italic tracking-[-0.05em] text-[4rem] md:text-[6rem] lg:text-[7.5rem] leading-[0.9] text-accent mb-6 md:mb-8 font-medium">
              Copie e Cole.
            </h1>

            <p className="hero-anim text-white/60 text-base md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6 md:mb-4">
              Não sabe o que escrever para a IA? Nós já escrevemos para você. Escolha o estilo, copie o texto exato e veja a mágica acontecer em segundos.
            </p>

            <p className="hero-anim text-white/40 text-xs md:text-sm mb-8 md:mb-10 font-mono">
              Acesso Imediato · Pagamento Único · Garantia de 7 Dias
            </p>

            <div className="hero-anim flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="btn-magnetic w-full sm:w-auto bg-accent text-white font-heading font-semibold px-8 py-4 rounded-full text-base md:text-lg inline-flex items-center justify-center gap-2">
                <span className="btn-bg bg-white/20"></span>
                <span className="relative z-10 flex items-center gap-2">
                  Quero a Fábrica de Imagens
                  <ArrowRight size={20} />
                </span>
              </button>
            </div>
          </div>

          {/* VSL Space 1080x1920 (9:16) */}
          <div className="w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] shrink-0 mt-8 lg:mt-0 xl:mr-10 hero-anim">
            <div className="relative aspect-[9/16] w-full rounded-[2rem] overflow-hidden glass-card border-[3px] border-white/10 shadow-[0_0_80px_rgba(123,97,255,0.2)] bg-black/60 flex flex-col justify-center items-center group hover:border-accent/40 transition-colors duration-500 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 z-10 pointer-events-none" />

              <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center mb-4 z-20 shadow-[0_0_30px_rgba(123,97,255,0.6)] group-hover:scale-110 transition-transform duration-500">
                <Play className="ml-2" size={32} fill="currentColor" />
              </div>
              <p className="text-white font-medium z-20 text-base md:text-lg tracking-wide uppercase font-heading">Assistir ao Vídeo</p>
              <p className="text-white/50 text-xs md:text-sm mt-2 z-20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Ligue o som
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   TRUST BADGES — Marquee Infinito
   ========================================== */
function TrustBadges() {
  const badges = [
    '✨ Midjourney', '🤖 ChatGPT / DALL-E 3.5', '🚀 Gemini / Flux / Leonardo IA', '🛡️ Garantia de 7 Dias', '⚡ Acesso Imediato à Plataforma',
    '📱 Experiência Mobile First', '🎯 Prompts Testados', '🏆 Design Premium',
    '🔒 Check-out Seguro'
  ];

  return (
    <section className="mt-12 md:mt-20 py-4 md:py-6 bg-accent/5 border-y border-white/5 overflow-hidden">
      <div className="trust-scroll flex items-center gap-8 md:gap-12 whitespace-nowrap w-max">
        {[...badges, ...badges].map((badge, i) => (
          <span key={i} className="text-white/50 text-xs md:text-sm font-medium tracking-wide">{badge}</span>
        ))}
      </div>
    </section>
  );
}

/* ==========================================
   SHOWCASE CAROUSEL — Imagens Geradas
   ========================================== */
function ShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<{ src: string, prompt: string }[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const { data, error } = await supabase()
          .from('published_prompts_view')
          .select('image_url, full_prompt')
          .not('image_url', 'is', null)
          .or('full_prompt.ilike.%portrait%,full_prompt.ilike.%man%,full_prompt.ilike.%woman%,full_prompt.ilike.%person%,full_prompt.ilike.%photo%') // Prioritizing real people
          .limit(10);

        if (data && data.length > 0) {
          // Shuffle results to get different people each time
          const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 6);
          setImages(shuffled.map(p => ({
            src: p.image_url,
            prompt: p.full_prompt
          })));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000); // 10 segundos
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="relative w-full h-full bg-[#121018] flex items-center justify-center">
        <div className="accent-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#121018] group">
      {images.map((img, index) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt="Arte Gerada por IA"
            className="w-full h-full object-cover object-[center_15%]"
          />
        </div>
      ))}

      {/* Overlay Escuro Inferior para Leitura */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />

      {/* Box de Texto do Prompt Usado (Aparece no Hover do Desktop) */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-3 transform transition-transform duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block z-30">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="text-accent" size={12} />
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Engenharia do Prompt</span>
        </div>
        <p className="text-white/80 text-xs font-mono truncate">
          {images[currentIndex].prompt}
        </p>
      </div>

      {/* Navegação Dots */}
      <div className="absolute top-4 right-4 flex gap-1.5 z-30">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-accent' : 'w-1.5 bg-white/30'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   PROBLEM — Validação da Dor
   ========================================== */
function Problem() {
  const ref = useRef<HTMLElement>(null);
  const problems = [
    'Passa horas tentando achar as palavras certas para a imagem que você imaginou.',
    'Sente que os resultados das IAs de imagens parecem sempre "de mentira" ou com defeitos.',
    'Vê outras pessoas gerando imagens incríveis, mas não sabe como elas conseguem.',
    'Testou vários tutoriais no YouTube, mas na sua vez nunca dá certo.',
    'Precisa da imagem pronta logo e não quer perder tempo "aprendendo" sobre IA.',
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.problem-item', {
        y: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" ref={ref} className="py-24 md:py-40 mt-12 md:mt-24 section-light rounded-t-[3rem] md:rounded-t-[5rem]">
      <div className="section-container">
        <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4 problem-item text-center md:text-left">Diagnóstico</p>
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-white tracking-tight mb-4 problem-item max-w-3xl text-center md:text-left">
          Se você acha que gerar imágens na IA é loteria...
        </h2>
        <p className="text-white/40 mb-12 problem-item text-base md:text-lg text-center md:text-left">Você só precisa das palavras certas. Já fizemos o trabalho pesado por você.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {problems.map((p, i) => (
            <div key={i} className="problem-item glass-card p-6 md:p-8 flex gap-4 items-start">
              <span className="text-red-400/80 mt-1 shrink-0 font-mono text-sm">✗</span>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   SOLUTION — Apresentação do Produto
   ========================================== */
function Solution() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sol-anim', {
        y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const stats = [
    { value: 'Milhares', label: 'Possibilidades Criativas', icon: Brain },
    { value: '3s', label: 'Copiar, Colar e Gerar', icon: Clock },
    { value: 'X10', label: 'Escala em Qualidade', icon: TrendingUp },
  ];

  return (
    <section ref={ref} className="py-24 md:py-40 mt-12 md:mt-24 bg-primary relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="section-container">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4 sol-anim">A Solução Definitiva</p>
          <h2 className="sol-anim font-heading font-bold text-3xl md:text-5xl tracking-tight text-white mb-6 leading-tight">
            Transforme horas de testes frustrantes em <span className="text-accent underline decoration-white/20 underline-offset-8">1 único clique</span>.
          </h2>
          <p className="sol-anim text-white/50 text-base md:text-xl leading-relaxed">
            Bem-vindo ao <strong>Banco de Prompts</strong>. Um catálogo profissional onde você encontra imagens de cair o queixo, clica para copiar o texto que a gerou, e cola na sua IA favorita.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 md:mb-20 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className="sol-anim glass-card py-8 px-4 md:p-6 text-center">
              <s.icon className="mx-auto text-accent mb-4" size={32} />
              <p className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">{s.value}</p>
              <p className="font-mono text-xs md:text-sm text-white/40">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="sol-anim relative max-w-5xl mx-auto">
          {/* Mockup Desktop Platform */}
          <div className="absolute inset-0 bg-accent/20 blur-[60px] md:blur-[120px] rounded-[100px]" />
          <div className="relative glass-card overflow-hidden border border-white/10 shadow-2xl p-2 md:p-4 bg-black/40">
            <div className="flex items-center gap-2 px-4 pb-4 pt-2 border-b border-white/5 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <div className="ml-4 font-mono text-[10px] md:text-xs text-white/30 text-center flex-1 pr-12">bancodeprompts.com</div>
            </div>
            {/* Carousel dinâmico de imagens em vez da tela vazia */}
            <div className="aspect-video relative w-full rounded-xl overflow-hidden flex items-center justify-center p-1 md:p-2">
              <div className="w-full h-full rounded-lg overflow-hidden relative">
                <ShowcaseCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   FEATURE CARDS — O Que Você Recebe
   ========================================== */
function FeatureLibraries() {
  const [libraries, setLibraries] = useState([
    { label: 'Cinematic Photography', color: 'from-blue-500/20 to-blue-600/10' },
    { label: '3D Render & Pixar Style', color: 'from-orange-500/20 to-orange-600/10' },
    { label: 'Hyper-realistic Portraits', color: 'from-emerald-500/20 to-emerald-600/10' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLibraries(prev => { const n = [...prev]; n.unshift(n.pop()!); return n })
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="text-accent" size={16} />
        <span className="font-mono text-xs text-accent uppercase tracking-widest">Bibliotecas</span>
      </div>
      <h3 className="font-heading font-semibold text-lg text-white mb-1">Múltiplos Estilos Visuais</h3>
      <p className="text-white/40 text-sm mb-6">De desenho 3D a fotografia profissional, tudo formatado e pronto.</p>
      <div className="relative h-40">
        {libraries.map((lib, i) => (
          <div key={lib.label}
            className={`absolute left-0 right-0 bg-gradient-to-r ${lib.color} border border-white/10 rounded-2xl p-4 transition-all duration-700`}
            style={{
              top: `${i * 16}px`, zIndex: libraries.length - i,
              transform: `scale(${1 - i * 0.04})`, opacity: 1 - i * 0.2,
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">{lib.label}</span>
              <Sparkles size={14} className="text-white/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureLive() {
  const [text, setText] = useState('');
  const [completedLines, setCompletedLines] = useState<{ text: string, isPrompt: boolean }[]>([]);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [currentAction, setCurrentAction] = useState<'type' | 'paste' | 'done' | null>(null);
  const [showImage, setShowImage] = useState(false);

  // Armazena a lista de prompts retornada do BD
  const [promptsList, setPromptsList] = useState<Prompt[]>([]);
  const [promptIndex, setPromptIndex] = useState(0);

  // Busca inicial dos prompts
  useEffect(() => {
    async function fetchPrompts() {
      try {
        const { data, error } = await supabase()
          .from('published_prompts_view')
          .select('*')
          .not('image_url', 'is', null)
          .limit(15);

        if (data && data.length > 0) {
          // Embaralhar para vir diferente
          const shuffled = data.sort(() => 0.5 - Math.random());
          setPromptsList(shuffled);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchPrompts();
  }, []);

  // Controla o loop de digitação e exibição para cada prompt
  useEffect(() => {
    if (promptsList.length === 0) return;

    let isActive = true;
    const currentPrompt = promptsList[promptIndex];
    setPrompt(currentPrompt);

    // Reseta estado para a nova rodada
    setText('');
    setCompletedLines([]);
    setShowImage(false);
    setCurrentAction(null);

    const linesQueue: { action: 'type' | 'paste', text: string }[] = [
      { action: 'type', text: '> Procurando a imagem ideal no catálogo...' },
      { action: 'type', text: '> Encontramos! Copiando as palavras mágicas...' },
      { action: 'paste', text: currentPrompt.full_prompt || currentPrompt.title || 'Arte Inteligente' },
      { action: 'type', text: '> A IA está desenhando...' },
      { action: 'type', text: '> Pronto! Imagem perfeita em segundos.' }
    ];

    async function typeSequence() {
      let index = 0;

      while (isActive && index < linesQueue.length) {
        const item = linesQueue[index];
        setCurrentAction(item.action);

        if (item.action === 'type') {
          for (let i = 0; i <= item.text.length; i++) {
            if (!isActive) return;
            setText(item.text.slice(0, i));
            await new Promise(r => setTimeout(r, 25)); // Digitação um pouco mais rápida
          }
          if (!isActive) return;
          await new Promise(r => setTimeout(r, 300));
          setCompletedLines(prev => [...prev, { text: item.text, isPrompt: false }]);
          setText('');
        } else if (item.action === 'paste') {
          await new Promise(r => setTimeout(r, 400));
          if (!isActive) return;
          setText(item.text);
          await new Promise(r => setTimeout(r, 600));
          if (!isActive) return;
          setCompletedLines(prev => [...prev, { text: item.text, isPrompt: true }]);
          setText('');
        }
        index++;
      }

      if (!isActive) return;

      // Sequência terminou, exibe imagem
      setCurrentAction('done');
      await new Promise(r => setTimeout(r, 300));
      if (!isActive) return;
      setShowImage(true);

      // Espera exibir a imagem por um tempo (ex: 6 segundos totais da rodada - tempo da digitação)
      // Vamos assumir que a imagem fica visível por uns 5 segundos até o próximo loop
      await new Promise(r => setTimeout(r, 5000));

      if (!isActive) return;

      // Passa para o próximo prompt, rodando em loop
      setPromptIndex((prev) => (prev + 1) % promptsList.length);
    }

    typeSequence();

    return () => { isActive = false; };
  }, [promptsList, promptIndex]);

  return (
    <div className="glass-card p-6 h-full relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <div className="accent-pulse"></div>
        <span className="font-mono text-xs text-accent uppercase tracking-widest">A Mágica</span>
      </div>
      <h3 className="font-heading font-semibold text-lg text-white mb-1 relative z-10">Copiou, Colou</h3>
      <p className="text-white/40 text-sm mb-6 relative z-10">Veja como é fácil ter a imagem que você deseja.</p>

      <div className="relative h-[220px] bg-primary/60 rounded-xl border border-white/5 overflow-hidden font-mono text-sm group-hover:border-accent/30 transition-colors">

        {/* Camada de Texto (Terminal) */}
        <div className={`absolute inset-0 p-4 flex flex-col justify-end transition-all duration-700 ease-in-out ${showImage ? 'opacity-0 scale-95 blur-sm pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="space-y-2 w-full">
            {completedLines.map((line, i) => (
              <div key={i} className={line.isPrompt
                ? "bg-accent/20 border border-accent/40 text-accent/90 p-2 text-xs font-sans rounded-md italic shadow-[0_0_15px_rgba(123,97,255,0.15)] line-clamp-3"
                : "text-white/30 truncate"}>
                {line.text}
              </div>
            ))}
            {currentAction !== 'done' && (
              <div className={currentAction === 'paste'
                ? "bg-accent/20 border border-accent/40 text-accent/90 p-2 text-xs font-sans rounded-md italic shadow-[0_0_15px_rgba(123,97,255,0.15)] line-clamp-3"
                : "text-accent truncate"}>
                {text}<span className="typing-cursor"></span>
              </div>
            )}
          </div>
        </div>

        {/* Camada da Imagem Final */}
        <div className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${showImage ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
          {prompt?.image_url ? (
            <img src={prompt.image_url} alt={prompt.title || 'Imagem Gerada'} className="w-full h-full object-contain bg-black/60" />
          ) : null}
          <div className="absolute inset-x-2 bottom-2 bg-black/70 backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <p className="text-[10px] text-white/90 line-clamp-2 leading-relaxed">{prompt?.full_prompt}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureUpdates() {
  const [promptCount, setPromptCount] = useState(247);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptCount(prev => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Target className="text-accent" size={16} />
          <span className="font-mono text-xs text-accent uppercase tracking-widest">Acesso Vitalício</span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-white mb-1">Atualizações Constantes</h3>
        <p className="text-white/40 text-sm mb-6">Sempre que a IA evoluir (Nano Banana, ChatGPT, Leonardo, Flux...), o banco acompanha.</p>
      </div>
      <div className="relative bg-primary/60 rounded-xl p-4 border border-white/5 flex items-center justify-center py-8">
        <div className="text-center">
          <BookOpen className="mx-auto text-accent mb-2 transition-transform scale-110" size={24} />
          <span className="text-white/80 font-mono text-sm">+{promptCount} Prompts Ativos e crescendo...</span>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feat-card', {
        y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={ref} className="py-24 md:py-40 mt-12 md:mt-24 section-light rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden">
      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">O Banco</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-white">
            Como funciona a <span className="font-drama italic text-accent">Fábrica</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="feat-card"><FeatureLibraries /></div>
          <div className="feat-card"><FeatureLive /></div>
          <div className="feat-card"><FeatureUpdates /></div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   MODULES — Categorias de Imagens
   ========================================== */
function Modules() {
  const ref = useRef<HTMLElement>(null);

  const modules = [
    {
      num: '01', title: 'Estilos Fotográficos', subtitle: 'Para campanhas e posts de cair o queixo',
      details: ['Rostos reais e expressivos', 'Fotos de estúdio profissionais', 'Luz cinematográfica', 'Retratos de alta qualidade', 'Comida e Life Style'],
      result: 'Nunca mais dependa de bancos de imagens pagos, crie a foto exata.', icon: Clock
    },
    {
      num: '02', title: 'Ilustração Artística', subtitle: 'Para marcas e projetos criativos',
      details: ['Desenhos 2D lindos', 'Pinturas digitais', 'Estilo Studio Ghibli e Anime', 'Ícones bonitos', 'Artes para camisetas'],
      result: 'Ativos visuais originais para sites, apresentações e redes sociais.', icon: PenTool
    },
    {
      num: '03', title: 'Vitrine de Produtos', subtitle: 'Apresente conceitos como grandes marcas',
      details: ['Embalagens Premium', 'Telas de smartphones e notebooks', 'Design de interiores', 'Arquitetura chique'],
      result: 'Venda mais mostrando seus produtos de forma impossível na vida real.', icon: TrendingUp
    },
    {
      num: '04', title: 'Animações 3D', subtitle: 'O Famoso Estilo Pixar',
      details: ['Mascotes fofinhos', 'Cenários mágicos', 'Personagens estilosos', 'Texturas e materiais reais'],
      result: 'Qualidade de grandes estúdios de cinema em poucos segundos.', icon: Brain
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = ref.current?.querySelectorAll('.module-card');
      if (cards) {
        cards.forEach((card, i) => {
          gsap.from(card, {
            y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' }
          });
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="modules" ref={ref} className="py-24 md:py-32 bg-primary">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Bibliotecas Inclusas</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-white mb-4">
            O que você <span className="font-drama italic text-accent">recebe</span> hoje
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">Tudo separado e categorizado. Você só precisa escolher qual estilo de imagem você quer, copiar e usar.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((mod, i) => (
            <div key={i} className="module-card glass-card p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="font-mono text-accent text-sm">{mod.num}</span>
                    <h3 className="font-heading font-bold text-2xl text-white mt-1">{mod.title}</h3>
                    <p className="text-accent/70 text-sm mt-1">{mod.subtitle}</p>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-xl shrink-0">
                    <mod.icon className="text-accent" size={24} />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {mod.details.map((detail, j) => (
                    <div key={j} className="flex items-center gap-2 text-white/50 text-sm font-mono">
                      <Zap size={12} className="text-accent shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-accent/5 border border-accent/10 rounded-xl p-3">
                <p className="text-white/60 text-sm"><span className="text-accent font-semibold">Ganhos:</span> {mod.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   TESTIMONIALS
   ========================================== */
function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const testimonials = [
    { quote: 'Sempre achei Midjourney difícil, as imagens pareciam genéricas. Copiei um prompt de fotografia do banco e não acreditei no resultado, cliente aprovou de primeira.', name: 'Lucas T.', role: 'Designer Gráfico', photo: 'https://i.pravatar.cc/80?img=11' },
    { quote: 'Faltava imagens impactantes para os meus anúncios. Agora eu crio os criativos em minutos e meu CTR dobrou. O investimento se pagou no primeiro dia.', name: 'Rafaela C.', role: 'Gestora de Tráfego', photo: 'https://i.pravatar.cc/80?img=43' },
    { quote: 'Ter uma biblioteca organizada com os modificadores exatos mudou meu fluxo. Parei de assinar banco de imagem caro.', name: 'André L.', role: 'Diretor de Arte', photo: 'https://i.pravatar.cc/80?img=53' },
    { quote: 'Não sou designer, mas a plataforma web facilita a vida. É literal "copiar, colar". Incrível.', name: 'Mariana P.', role: 'Criadora de Conteúdo', photo: 'https://i.pravatar.cc/80?img=20' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.test-card', {
        y: 50, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-40 mt-12 md:mt-24 section-light relative rounded-t-[3rem] md:rounded-t-[5rem]">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Depoimentos</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-white">
            O que nossos alunos <span className="font-drama italic text-accent">estão dizendo</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="test-card glass-card p-6 flex gap-4">
              <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/20 shrink-0" />
              <div>
                <p className="text-white/70 text-sm leading-relaxed mb-3">"{t.quote}"</p>
                <p className="font-heading font-semibold text-white text-sm">{t.name}</p>
                <p className="font-mono text-xs text-white/30">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   PHILOSOPHY — "O Manifesto"
   ========================================== */
function Philosophy() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = ref.current?.querySelectorAll('.manifest-word');
      if (words) {
        gsap.from(words, {
          y: 20, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 70%' }
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  const splitWords = (text: string, className = '') =>
    text.split(' ').map((word, i) => (
      <span key={i} className={`manifest-word inline-block mr-[0.3em] ${className}`}>{word}</span>
    ));

  return (
    <section ref={ref} className="py-32 md:py-40 relative overflow-hidden bg-primary">
      <div className="relative z-10 section-container text-center max-w-4xl mx-auto">
        <p className="text-white/30 text-lg md:text-2xl mb-8 leading-relaxed">
          {splitWords('A maioria dos tutoriais te ensina a adivinhar as palavras certas e esperar a IA resolver por sorte.', 'text-white/30')}
        </p>
        <div className="text-4xl md:text-6xl lg:text-7xl leading-tight">
          {splitWords('Nós focamos no:', 'font-heading font-bold text-white')}
          <br />
          {splitWords('copia e cola', 'font-drama italic text-white/70')}
          <span className="manifest-word inline-block mr-[0.3em] font-drama italic text-accent"> sem complicação.</span>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   AUTHOR
   ========================================== */
function Author() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.auth-anim', {
        y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-32 mt-12 md:mt-24 bg-[#0A0A14] border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="auth-anim relative aspect-[4/5] md:aspect-square max-w-md mx-auto w-full">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
            <div className="relative h-full w-full rounded-3xl overflow-hidden glass-card p-2 md:p-3 rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
              <div className="relative w-full h-full rounded-[1.2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <Image src="/images/matheus-profile.jpg" alt="Matheus Soares" fill className="object-cover" />
              </div>
            </div>
          </div>
          <div className="max-w-xl">
            <div className="auth-anim flex items-center gap-2 mb-6">
              <Award className="text-accent" size={16} />
              <span className="font-mono text-xs text-accent uppercase tracking-widest">Quem é</span>
            </div>
            <h2 className="auth-anim font-heading font-bold text-3xl md:text-5xl tracking-tight text-white mb-6">
              Matheus <span className="font-drama italic text-accent">Soares</span>
            </h2>
            <div className="space-y-4 text-white/60 text-sm md:text-base leading-relaxed">
              <p className="auth-anim">Hoje, Matheus Soares é um dos criadores brasileiros que mais crescem ao falar sobre Inteligência Artificial aplicada à vida real, comunicação e negócios digitais.</p>
              <p className="auth-anim">É fundador de projetos educacionais e de soluções com IA que ajudam pessoas e empresas a ganharem tempo, produtividade e resultados no dia a dia.</p>
              <p className="auth-anim">Também é criador de conteúdos que conectam tecnologia à rotina, ao trabalho e às decisões reais, mostrando como usar IA de forma simples, prática e acessível — mesmo para quem nunca foi "da área tech".</p>
              <p className="auth-anim">Nos últimos anos, dedicou-se ao desenvolvimento de métodos e frameworks para ensinar pessoas comuns a usarem inteligência artificial para organizar a vida, melhorar a comunicação, vender mais e tomar decisões melhores, sem complicação e sem "tecnês".</p>
              <p className="auth-anim">Com uma audiência em crescimento nas redes sociais, Matheus já impactou milhares de pessoas com seus conteúdos, treinamentos e mentorias, ajudando quem se sentia perdido com a tecnologia a dar os primeiros passos e transformar a forma como trabalha, cria e se posiciona no digital.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   FAQ — com Accordion
   ========================================== */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  const faqs = [
    { q: 'Em quais IAs os prompts funcionam?', a: 'Os prompts foram testados e otimizados especificamente para Midjourney, ChatGPT/DALL-E 3.5, Gemini, Flux e Leonardo IA, garantindo máxima fidelidade e qualidade.' },
    { q: 'Preciso saber escrever em inglês?', a: 'Não necessariamente para usar, pois você copiará a estrutura. A maioria das IAs de imagem entende melhor inglês, então os comandos base estão na linguagem ideal, mas com instruções de como modificar se precisar.' },
    { q: 'Como terei acesso?', a: 'Você receberá o acesso imediato à plataforma web exclusiva por e-mail logo após a confirmação do pagamento.' },
    { q: 'Tem garantia?', a: 'Sim, você tem 7 dias incondicionais. Se não gostar da qualidade dos geradores dentro do banco, basta mandar um e-mail que devolvemos seu dinheiro.' },
    { q: 'Terá atualizações?', a: 'Sim. O mercado de IA muda rápido. Nossa plataforma continuará sendo alimentada com novos estilos e prompts de altíssimo padrão.' },
    { q: 'E se eu for iniciante total?', a: 'Melhor ainda. Você economizará meses de frustração tentando descobrir os parâmetros das IAs. Basta entrar, escolher o estilo, copiar e colar.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={ref} className="py-24 md:py-40 mt-12 md:mt-24 section-light rounded-t-[3rem] md:rounded-t-[5rem]">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Perguntas</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-white">
            Perguntas <span className="font-drama italic text-accent">frequentes</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item glass-card overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-heading font-medium text-white text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`text-accent shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} size={18} />
              </button>
              <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
                <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   PRICING — Oferta com Vagas
   ========================================== */
function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 45 * 60);

  const includes = [
    '+250 Prompts Prontos Premium',
    'Acesso Vitalício ao Catálogo Web',
    'Atualizações Frequentes (Novas Imagens)',
    'Guia Rápido: Como usar a IA passo a passo',
    '7 agentes de IA para gerar videos e imagens',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.price-card', {
        y: 60, opacity: 0, stagger: 0.2, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={ref} className="py-24 md:py-40 mt-12 md:mt-24 bg-primary relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="section-container">
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Acesso Exclusivo</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-white mb-4">
            Libere seu <span className="font-drama italic text-accent">Acesso</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base font-mono mb-6 max-w-xl mx-auto">Acesso antecipado com desconto especial por tempo limitado ao Banco de Prompts.</p>
        </div>

        {/* Scarcity & Countdown Tracker */}
        <div className="text-center mb-10 max-w-xl mx-auto price-card">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-xl">
            <Clock className="text-red-400 shrink-0" size={20} />
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-red-300 font-medium text-sm">O preço aumentará em: <strong className="font-mono text-base ml-1">{formatTime(timeLeft)}</strong></span>
              <span className="hidden sm:inline-block text-red-400/50">•</span>
              <span className="text-red-300/80 text-sm font-semibold animate-pulse">92% das vagas preenchidas</span>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="price-card relative glass-card p-8 md:p-10 ring-2 ring-accent/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] md:text-xs font-bold px-4 md:px-6 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-[0_0_20px_rgba(123,97,255,0.4)]">Desconto de Lançamento</div>

            <div className="flex flex-col items-center justify-center text-center mb-8 pt-4">
              <span className="text-white/30 line-through text-base md:text-lg mb-2">De R$ 197 por apenas</span>

              <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center mb-3 text-white">
                <span className="text-white/60 text-lg md:text-xl font-medium md:mr-2">6x de</span>
                <span className="font-heading font-bold text-6xl md:text-7xl">R$ 8,82</span>
              </div>
              <span className="text-white/70 font-medium text-lg bg-white/5 px-4 py-1 rounded-full text-center">ou R$ 47 à vista</span>
            </div>

            <div className="space-y-4 mb-10 w-full max-w-sm mx-auto bg-black/20 p-6 rounded-2xl border border-white/5">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70 text-sm md:text-base">
                  <CheckCircle2 size={18} className="text-accent shrink-0" />{item}
                </div>
              ))}
            </div>

            <button className="btn-magnetic block w-full text-center bg-accent text-white font-heading font-semibold py-5 rounded-full text-base md:text-lg shadow-[0_0_40px_-10px_rgba(123,97,255,0.5)] transform hover:scale-[1.02] transition-transform">
              <span className="btn-bg bg-white/20"></span>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Desbloquear Acesso Agora <ArrowRight size={20} />
              </span>
            </button>
            <p className="text-accent/80 font-mono text-center text-xs mt-6">Pagamento único. Acesso Imediato.</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/30 text-xs font-mono">Ambiente Seguro Hotmart · Garantia Incondicional de 7 Dias</p>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   GUARANTEE
   ========================================== */
function Guarantee() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.guar-anim', {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-20 section-light border-y border-white/5">
      <div className="section-container max-w-4xl mx-auto text-center">
        <div className="guar-anim p-6 relative">
          <div className="relative z-10">
            <Shield className="text-accent mx-auto mb-6" size={48} />
            <h3 className="guar-anim font-heading font-bold text-2xl md:text-3xl text-white mb-4">
              Garantia Incondicional de <span className="text-accent">7 Dias</span>
            </h3>
            <p className="guar-anim text-white/50 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Compre agora e use os prompts por uma semana inteira. Se você não gerar imagens profissionais com a nossa engenharia, envie um e-mail. Nós devolvemos o seu valor na hora, sem dor de cabeça.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   FOOTER
   ========================================== */
function Footer() {
  return (
    <footer className="bg-[#08080F] border-t border-white/10 pt-16 pb-10">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="Banco de Prompts" width={32} height={32} className="rounded-md" />
              <span className="font-heading font-bold text-xl text-white whitespace-nowrap">
                banco<span className="text-accent">deprompts</span>
              </span>
            </div>
            <p className="text-white/30 text-sm mt-3 leading-relaxed">
              O padrão ouro para geração de imagens na Inteligência Artificial.
            </p>
          </div>
          <div>
            <p className="font-heading font-semibold text-white text-sm mb-4">Plataforma</p>
            <div className="space-y-2">
              {['A Missão', 'Categorias', 'Oferta', 'Dúvidas'].map((link) => (
                <a key={link} href="#" className="block text-white/30 text-sm hover-lift hover:text-white/60 transition-colors">{link}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-heading font-semibold text-white text-sm mb-4">Suporte & Legal</p>
            <div className="space-y-2">
              {['Termos de Uso', 'Privacidade', 'Acesso Alunos'].map((link) => (
                <a key={link} href="#" className="block text-white/30 text-sm hover-lift hover:text-white/60 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs text-center md:text-left">© 2024 Banco de Prompts. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-2">
            <div className="pulse-dot"></div>
            <span className="font-mono text-xs text-white/30">Ambiente 100% Seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================
   APP — Orquestrador
   ========================================== */
export default function LandingPage() {
  return (
    <div className="noise-overlay pb-20 md:pb-0">
      {/* <Navbar /> */}
      <Hero />
      <TrustBadges />
      <Problem />
      <Solution />
      <Features />
      <Modules />
      <Testimonials />
      <Pricing />
      <Author />
      <FAQ />
      <Philosophy />
      <Guarantee />
      <Footer />
    </div>
  );
}
