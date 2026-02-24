"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, type Prompt } from "@/lib/supabase";
import SearchFilters from "@/components/SearchFilters";
import PromptGrid from "@/components/PromptGrid";

export default function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Fetch prompts from Supabase
  useEffect(() => {
    async function fetchPrompts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("prompts_vault")
        .select("*")
        .order("captured_at", { ascending: false })
        .limit(200);

      if (error) {
        console.error("Erro ao buscar prompts:", error);
        setLoading(false);
        return;
      }

      setPrompts(data || []);
      setFilteredPrompts(data || []);
      setLoading(false);
    }

    fetchPrompts();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = prompts;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.full_prompt.toLowerCase().includes(q) ||
          (p.author_name && p.author_name.toLowerCase().includes(q))
      );
    }

    // Tag filtering
    if (activeTags.length > 0) {
      result = result.filter((p) => {
        const promptText = `${p.title} ${p.full_prompt} ${(p.tags || []).join(" ")}`.toLowerCase();
        return activeTags.some((tag) => promptText.includes(tag.toLowerCase()));
      });
    }

    setFilteredPrompts(result);
  }, [searchQuery, activeTags, prompts]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  // Extract unique tags and model names from prompts
  const dynamicTags = useMemo(() => {
    const tagSet = new Set<string>();
    prompts.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet).sort();
  }, [prompts]);

  const modelNames = useMemo(() => {
    const modelSet = new Set<string>();
    prompts.forEach((p) => {
      if (p.model_name) modelSet.add(p.model_name);
    });
    return Array.from(modelSet).sort();
  }, [prompts]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <span className="inline-block bg-[var(--accent-light)] text-[var(--accent)] text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md mb-4">
          BIBLIOTECA COMUNITÁRIA
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] leading-tight mb-3 max-w-2xl">
          Explore os prompts que a comunidade está compartilhando.
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
          activeTags={activeTags}
          searchQuery={searchQuery}
          dynamicTags={dynamicTags}
          modelNames={modelNames}
        />
      </section>

      {/* Results counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        {!loading && (
          <p className="text-sm text-[var(--text-muted)]">
            {filteredPrompts.length === prompts.length
              ? `${prompts.length} prompts disponíveis`
              : `${filteredPrompts.length} de ${prompts.length} prompts`}
          </p>
        )}
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <PromptGrid prompts={filteredPrompts} loading={loading} />
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
