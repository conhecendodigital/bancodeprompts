import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Prompt {
  id: string;
  original_id: string;
  title: string;
  full_prompt: string;
  image_url: string | null;
  author_name: string | null;
  tags: string[];
  source_url: string | null;
  captured_at: string;
}
