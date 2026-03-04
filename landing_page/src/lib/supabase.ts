import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// ── Data client ──
function getSupabase() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export { getSupabase as supabase };

export interface Prompt {
    id: string;
    original_id: string;
    title: string;
    full_prompt: string;
    image_url: string | null;
    author_name: string | null;
    tags: string[];
    source_url: string | null;
    model_name: string | null;
    captured_at: string;
}
