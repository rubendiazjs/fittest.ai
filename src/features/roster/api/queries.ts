import { supabase } from '@/lib/supabase'

export interface AthleteDirectoryItem {
  fullName: string | null
  id: string
}

export interface CoachRosterItem {
  athleteId: string
  athleteName: string
  createdAt: string
  id: string
  status: 'pending' | 'active' | 'terminated'
}

export interface CoachRosterResult {
  activeCount: number
  items: CoachRosterItem[]
  pendingCount: number
  schemaReady: boolean
}

export interface PendingInviteItem {
  coachId: string
  coachName: string
  createdAt: string
  id: string
  organizationName: string | null
}

export interface PendingInvitesResult {
  invites: PendingInviteItem[]
  schemaReady: boolean
}

type ProfileLookupRow = {
  full_name: string | null
  id: string
}

type CoachProfileLookupRow = {
  id: string
  organization_name: string | null
}

function fallbackLabel(id: string, prefix: string) {
  return `${prefix} ${id.slice(0, 8)}`
}

export async function fetchAthleteDirectory(search: string): Promise<AthleteDirectoryItem[]> {
  let query = supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'athlete')
    .limit(12)

  const trimmedSearch = search.trim()

  if (trimmedSearch) {
    query = query.ilike('full_name', `%${trimmedSearch}%`)
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
  }))
}

export async function fetchCoachRoster(coachId: string): Promise<CoachRosterResult> {
  const { data: links, error } = await supabase
    .from('roster_links')
    .select('id, athlete_id, status, created_at')
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false })

  if (error) {
    if (error.code === 'PGRST205') {
      return {
        activeCount: 0,
        items: [],
        pendingCount: 0,
        schemaReady: false,
      }
    }

    throw error
  }

  const activeCount = (links ?? []).filter((link) => link.status === 'active').length
  const pendingCount = (links ?? []).filter((link) => link.status === 'pending').length

  if (!links?.length) {
    return {
      activeCount,
      items: [],
      pendingCount,
      schemaReady: true,
    }
  }

  const athleteIds = Array.from(new Set(links.map((link) => link.athlete_id)))
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', athleteIds)

  if (profilesError) {
    throw profilesError
  }

  const profileMap = new Map(
    ((profiles ?? []) as ProfileLookupRow[]).map((profile) => [profile.id, profile.full_name])
  )

  return {
    activeCount,
    items: links.map((link) => ({
      id: link.id,
      athleteId: link.athlete_id,
      athleteName: profileMap.get(link.athlete_id) ?? fallbackLabel(link.athlete_id, 'Atleta'),
      createdAt: link.created_at,
      status: link.status,
    })),
    pendingCount,
    schemaReady: true,
  }
}

export async function fetchPendingRosterInvites(
  athleteId: string
): Promise<PendingInvitesResult> {
  const { data: links, error } = await supabase
    .from('roster_links')
    .select('id, coach_id, created_at')
    .eq('athlete_id', athleteId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    if (error.code === 'PGRST205') {
      return {
        invites: [],
        schemaReady: false,
      }
    }

    throw error
  }

  if (!links?.length) {
    return {
      invites: [],
      schemaReady: true,
    }
  }

  const coachIds = Array.from(new Set(links.map((link) => link.coach_id)))

  const [{ data: coachProfiles, error: coachProfilesError }, { data: profiles, error: profilesError }] = await Promise.all([
    supabase
      .from('coach_profiles')
      .select('id, organization_name')
      .in('id', coachIds),
    supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', coachIds),
  ])

  if (coachProfilesError) {
    throw coachProfilesError
  }

  if (profilesError) {
    throw profilesError
  }

  const coachProfileMap = new Map(
    ((coachProfiles ?? []) as CoachProfileLookupRow[]).map((profile) => [
      profile.id,
      profile.organization_name,
    ])
  )
  const profileMap = new Map(
    ((profiles ?? []) as ProfileLookupRow[]).map((profile) => [profile.id, profile.full_name])
  )

  return {
    invites: links.map((link) => ({
      id: link.id,
      coachId: link.coach_id,
      coachName: profileMap.get(link.coach_id) ?? fallbackLabel(link.coach_id, 'Coach'),
      createdAt: link.created_at,
      organizationName: coachProfileMap.get(link.coach_id) ?? null,
    })),
    schemaReady: true,
  }
}
