"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, type Prompt } from "@/lib/supabase";
import SearchFilters from "@/components/SearchFilters";
import PromptGrid from "@/components/PromptGrid";

const PAGE_SIZE = 30;

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializar estado a partir da URL
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [activeTags, setActiveTags] = useState<string[]>(() => {
    const tags = searchParams.get("tags");
    return tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  });
  const [activeModel, setActiveModel] = useState(
    searchParams.get("modelo") || ""
  );

  // Tags e modelos disponíveis (carregados uma vez separadamente)
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allModels, setAllModels] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [modelCounts, setModelCounts] = useState<Record<string, number>>({});

  // Ref para evitar fetch duplo no mount
  const hasFetched = useRef(false);
  const currentPage = useRef(0);

  // Sincronizar URL com filtros
  const updateUrl = useCallback(
    (q: string, tags: string[], modelo: string) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (tags.length > 0) params.set("tags", tags.join(","));
      if (modelo) params.set("modelo", modelo);

      const queryString = params.toString();
      router.replace(queryString ? `?${queryString}` : "/", {
        scroll: false,
      });
    },
    [router]
  );

  // Buscar todos os tags, modelos e contagens (uma vez no mount)
  useEffect(() => {
    async function fetchFilterOptions() {
      const { data } = await supabase()
        .from("published_prompts_view")
        .select("tags, model_name");

      if (!data) return;

      const tagSet = new Set<string>();
      const modelSet = new Set<string>();
      const tCounts: Record<string, number> = {};
      const mCounts: Record<string, number> = {};

      data.forEach((row) => {
        if (row.tags && Array.isArray(row.tags)) {
          row.tags.forEach((t: string) => {
            if (t && t.trim()) {
              const tag = t.trim();
              tagSet.add(tag);
              const key = tag.toLowerCase();
              tCounts[key] = (tCounts[key] || 0) + 1;
            }
          });
        }
        if (row.model_name && row.model_name.trim()) {
          const model = row.model_name.trim();
          modelSet.add(model);
          const key = model.toLowerCase();
          mCounts[key] = (mCounts[key] || 0) + 1;
        }
      });

      setAllTags(Array.from(tagSet).sort());
      setAllModels(Array.from(modelSet).sort());
      setTagCounts(tCounts);
      setModelCounts(mCounts);
    }

    fetchFilterOptions();
  }, []);

  // Construir query base com filtros
  const buildQuery = useCallback(
    (modelo: string, tags: string[]) => {
      let query = supabase()
        .from("published_prompts_view")
        .select("*")
        .order("captured_at", { ascending: false });

      // Filtro server-side: modelo (case-insensitive via ilike)
      if (modelo) {
        query = query.ilike("model_name", modelo);
      }

      // Filtro server-side: tags (overlaps = qualquer uma das tags selecionadas)
      if (tags.length > 0) {
        query = query.overlaps("tags", tags);
      }

      return query;
    },
    []
  );

  // Fetch primeira página de prompts
  const fetchPrompts = useCallback(
    async (modelo: string, tags: string[]) => {
      setLoading(true);
      setPrompts([]);
      setFilteredPrompts([]);
      currentPage.current = 0;
      setHasMore(true);

      const from = 0;
      const to = PAGE_SIZE - 1;

      const { data, error } = await buildQuery(modelo, tags).range(from, to);

      if (error) {
        console.error("Erro ao buscar prompts:", error);
        setLoading(false);
        return;
      }

      const results = data || [];
      setPrompts(results);
      setFilteredPrompts(results);
      setHasMore(results.length === PAGE_SIZE);
      setLoading(false);
    },
    [buildQuery]
  );

  // Fetch próxima página (chamado pelo IntersectionObserver)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = currentPage.current + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await buildQuery(activeModel, activeTags).range(
      from,
      to
    );

    if (error) {
      console.error("Erro ao carregar mais prompts:", error);
      setLoadingMore(false);
      return;
    }

    const results = data || [];

    setPrompts((prev) => [...prev, ...results]);
    setFilteredPrompts((prev) => {
      const newItems = searchQuery.trim()
        ? results.filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            p.full_prompt.toLowerCase().includes(q)
          );
        })
        : results;
      return [...prev, ...newItems];
    });

    currentPage.current = nextPage;
    setHasMore(results.length === PAGE_SIZE);
    setLoadingMore(false);
  }, [loadingMore, hasMore, activeModel, activeTags, searchQuery, buildQuery]);

  // Fetch inicial + refetch quando modelo ou tags mudam
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchPrompts(activeModel, activeTags);
      return;
    }
    fetchPrompts(activeModel, activeTags);
  }, [activeModel, activeTags, fetchPrompts]);

  // Filtro client-side: busca por texto (opera sobre dados já carregados)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPrompts(prompts);
      return;
    }

    const q = searchQuery.toLowerCase();
    const result = prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.full_prompt.toLowerCase().includes(q)
    );

    setFilteredPrompts(result);
  }, [searchQuery, prompts]);

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      updateUrl(query, activeTags, activeModel);
    },
    [activeTags, activeModel, updateUrl]
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      setActiveTags((prev) => {
        const next = prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
        updateUrl(searchQuery, next, activeModel);
        return next;
      });
    },
    [searchQuery, activeModel, updateUrl]
  );

  const handleModelToggle = useCallback(
    (model: string) => {
      setActiveModel((prev) => {
        const next =
          prev.trim().toLowerCase() === model.trim().toLowerCase()
            ? ""
            : model;
        updateUrl(searchQuery, activeTags, next);
        return next;
      });
    },
    [searchQuery, activeTags, updateUrl]
  );

  // Contador total (inclui "mais" se há paginação)
  const totalLabel = useMemo(() => {
    if (loading) return "";
    const showing = filteredPrompts.length;
    if (hasMore) {
      return `${showing}+ prompts disponíveis`;
    }
    return `${showing} prompts disponíveis`;
  }, [filteredPrompts.length, hasMore, loading]);

  return (
    <div className="min-h-screen bg-background-dark font-sans text-slate-100 relative">
      <div className="noise-overlay hidden md:block"></div> {/* Overlay applied in layout, but double-belt check */}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center relative z-10">
        <span className="inline-block bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-6 shadow-[0_0_15px_rgba(255,107,0,0.15)]">
          BIBLIOTECA COMUNITÁRIA
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sora tracking-tight leading-tight text-white mb-6 max-w-4xl mx-auto">
          Explore os prompts que a comunidade está <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Compartilhando.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Navegue por imagens geradas com IA e os prompts por trás delas. Copie,
          adapte e crie suas próprias obras de arte.
        </p>
      </section>

      {/* Filters (Assuming SearchFilters component will be updated later) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
        <SearchFilters
          onSearchChange={handleSearchChange}
          onTagToggle={handleTagToggle}
          onModelToggle={handleModelToggle}
          activeTags={activeTags}
          activeModel={activeModel}
          searchQuery={searchQuery}
          dynamicTags={allTags}
          modelNames={allModels}
          tagCounts={tagCounts}
          modelCounts={modelCounts}
        />
      </section>

      {/* Results counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 relative z-10">
        {!loading && (
          <p className="text-sm font-semibold text-slate-400">{totalLabel}</p>
        )}
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <PromptGrid
          prompts={filteredPrompts}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </section>

      {/* About / Footer */}
      <footer
        id="sobre"
        className="border-t border-white/5 bg-white/[0.02] backdrop-blur-md relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold font-sora text-white mb-4">
              Sobre o BANCO DE PROMPTS
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              O Banco de Prompts é uma biblioteca comunitária de prompts de IA
              para geração de imagens. Nosso objetivo é democratizar o acesso a
              prompts de alta qualidade, permitindo que qualquer pessoa explore e
              utilize prompts criativos para suas produções artísticas com
              inteligência artificial.
            </p>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-sm text-slate-500 font-medium">
              © 2026 BANCO DE PROMPTS. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-pulse text-primary text-lg font-semibold">Carregando...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
