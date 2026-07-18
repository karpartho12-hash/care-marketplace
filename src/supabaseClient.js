import { createClient } from '@supabase/supabase-js';

// Retrieve env variables
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clean up any stray quotes, spaces, or formatting artifacts
const supabaseUrl = rawUrl.replace(/['"]+/g, '').trim();
const supabaseAnonKey = rawKey.replace(/['"]+/g, '').trim();

// Ensure a fallback to prevent the strict crash if undefined
if (!supabaseUrl.startsWith('http')) {
  console.error('Supabase URL formatting validation failed: ', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);