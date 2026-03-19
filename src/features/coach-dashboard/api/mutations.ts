import { supabase } from '@/lib/supabase'
import type { TablesInsert, Tables } from '@/lib/database.types'

type CoachProfile = Tables<'coach_profiles'>
type CoachProfileInsert = TablesInsert<'coach_profiles'>

export const createCoachProfile = async (
  profile: CoachProfileInsert
): Promise<CoachProfile> => {
  const { data, error } = await supabase
    .from('coach_profiles')
    .insert(profile)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya existe un perfil profesional para este usuario')
    }

    if (error.code === 'PGRST205') {
      throw new Error('La tabla coach_profiles no está disponible todavía en este entorno')
    }

    if (error.code === '42501' || error.code === 'PGRST301') {
      throw new Error('No tienes permiso para crear el perfil profesional')
    }

    throw error
  }

  return data
}
