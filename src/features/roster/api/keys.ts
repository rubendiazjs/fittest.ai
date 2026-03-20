export const rosterKeys = {
  all: ['roster'] as const,
  coachRoster: (coachId: string) => [...rosterKeys.all, 'coach-roster', coachId] as const,
  pendingInvites: (athleteId: string) => [...rosterKeys.all, 'pending-invites', athleteId] as const,
  athleteDirectory: (search: string) => [...rosterKeys.all, 'athlete-directory', search] as const,
}
