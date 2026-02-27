"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, type Prompt } from "@/lib/supabase";
import SearchFilters from "@/components/SearchFilters";
import PromptGrid from "@/components/PromptGrid";

const PAGE_SIZE = 30;

export default function HomePage() {
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

  // Buscar todos os tags e modelos disponíveis (uma vez no mount)
  useEffect(() => {
    async function fetchFilterOptions() {
      const { data } = await supabase
        .from("published_prompts_view")
        .select("tags, model_name");

      if (!data) return;

      const tagSet = new Set<string>();
      const modelSet = new Set<string>();

      data.forEach((row) => {
        if (row.tags && Array.isArray(row.tags)) {
          row.tags.forEach((t: string) => {
            if (t && t.trim()) tagSet.add(t.trim());
          });
        }
        if (row.model_name && row.model_name.trim()) {
          modelSet.add(row.model_name.trim());
        }
      });

      setAllTags(Array.from(tagSet).sort());
      setAllModels(Array.from(modelSet).sort());
    }

    fetchFilterOptions();
  }, []);

  // Construir query base com filtros
  const buildQuery = useCallback(
    (modelo: string, tags: string[]) => {
      let query = supabase
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
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <span className="inline-block bg-[var(--accent-light)] text-[var(--accent)] text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md mb-4">
          BIBLIOTECA COMUNITÁRIA
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] leading-tight mb-3 max-w-2xl">
          Explore os prompts que a comunidade está Compartilhando.
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mb-8">
          Navegue por imagens geradas com IA e os prompts por trás delas. Copie,
          adapte e crie suas próprias obras de arte.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SearchFilters
          onSearchChange={handleSearchChange}
          onTagToggle={handleTagToggle}
          onModelToggle={handleModelToggle}
          activeTags={activeTags}
          activeModel={activeModel}
          searchQuery={searchQuery}
          dynamicTags={allTags}
          modelNames={allModels}
        />
      </section>

      {/* Results counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        {!loading && (
          <p className="text-sm text-[var(--text-muted)]">{totalLabel}</p>
        )}
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
        className="border-t border-[var(--border)] bg-[var(--bg-subtle)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-[var(--text)] mb-2">
              Sobre o BANCO DE PROMPTS
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              O Banco de Prompts é uma biblioteca comunitária de prompts de IA
              para geração de imagens. Nosso objetivo é democratizar o acesso a
              prompts de alta qualidade, permitindo que qualquer pessoa explore e
              utilize prompts criativos para suas produções artísticas com
              inteligência artificial.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">
              © 2026 BANCO DE PROMPTS. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
