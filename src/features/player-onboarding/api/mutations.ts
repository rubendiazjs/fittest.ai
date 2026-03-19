import { supabase } from '@/lib/supabase'
import type { TablesInsert, Tables } from '@/lib/database.types'

type PlayerProfileInsert = TablesInsert<'player_profiles'>
type PlayerProfile = Tables<'player_profiles'>

/**
 * Creates a new player profile in Supabase.
 *
 * Key concepts demonstrated:
 * - Typed insert using TablesInsert<'player_profiles'>
 * - Error handling with specific error codes
 * - .select().single() to return the created row
 *
 * RLS Note: The user_id must match auth.uid() or RLS will reject.
 */
export const createPlayerProfile = async (
  profile: PlayerProfileInsert
): Promise<PlayerProfile> => {
  const { data, error } = await supabase
    .from('player_profiles')
    .insert(profile)
    .select()
    .single()

  if (error) {
    // Handle specific Postgres errors with user-friendly messages
    if (error.code === '23505') {
      throw new Error('Ya tienes un perfil creado')
    }
    if (error.code === '42501' || error.code === 'PGRST301') {
      throw new Error('No tienes permiso para crear este perfil')
    }
    throw error
  }

  return data
}

/**
 * Fetches a player profile by user ID.
 *
 * Returns null if no profile exists (not an error condition).
 */
export const fetchPlayerProfile = async (
  userId: string
): Promise<PlayerProfile | null> => {
  const { data, error } = await supabase
    .from('player_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    // PGRST116 = no rows found - this is expected for new users
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}
