import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/database.types'

type CoachProfile = Tables<'coach_profiles'>

export interface CoachProfileResult {
  profile: CoachProfile | null
  schemaReady: boolean
}

export const fetchCoachProfile = async (
  userId: string
): Promise<CoachProfileResult> => {
  const { data, error } = await supabase
    .from('coach_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return {
        profile: null,
        schemaReady: true,
      }
    }

    if (error.code === 'PGRST205') {
      return {
        profile: null,
        schemaReady: false,
      }
    }

    throw error
  }

  return {
    profile: data,
    schemaReady: true,
  }
}
