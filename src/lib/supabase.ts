import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

/**
 * Typed Supabase client singleton.
 *
 * This client is configured with:
 * - Full TypeScript types from database.types.ts
 * - Automatic auth session persistence
 * - RLS-aware queries (auth.uid() matches current user)
 *
 * Usage:
 * ```ts
 * const { data, error } = await supabase
 *   .from('player_profiles')
 *   .select('*')
 * ```
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
