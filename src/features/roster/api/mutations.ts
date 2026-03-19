import { supabase } from '@/lib/supabase'

interface CreateRosterInviteInput {
  athleteId: string
  coachId: string
}

export async function createRosterInvite({
  athleteId,
  coachId,
}: CreateRosterInviteInput) {
  const { data, error } = await supabase
    .from('roster_links')
    .insert({
      athlete_id: athleteId,
      coach_id: coachId,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya existe una invitación o vínculo para este atleta')
    }

    if (error.code === 'PGRST205') {
      throw new Error('La tabla roster_links no está disponible todavía en este entorno')
    }

    if (error.code === '42501' || error.code === 'PGRST301') {
      throw new Error('No tienes permiso para crear invitaciones de roster')
    }

    throw error
  }

  return data
}

export async function acceptRosterInvite(inviteId: string) {
  const { data, error } = await supabase
    .from('roster_links')
    .update({
      shared_data_access: true,
      status: 'active',
    })
    .eq('id', inviteId)
    .select('id')
    .single()

  if (error) {
    if (error.code === 'PGRST205') {
      throw new Error('La tabla roster_links no está disponible todavía en este entorno')
    }

    if (error.code === '42501' || error.code === 'PGRST301') {
      throw new Error('No tienes permiso para aceptar esta invitación')
    }

    throw error
  }

  return data
}
