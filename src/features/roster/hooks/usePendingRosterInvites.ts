import { useQuery } from '@tanstack/react-query'
import { fetchPendingRosterInvites, rosterKeys } from '../api'

export function usePendingRosterInvites(athleteId: string) {
  return useQuery({
    queryKey: rosterKeys.pendingInvites(athleteId),
    queryFn: () => fetchPendingRosterInvites(athleteId),
    enabled: !!athleteId,
    staleTime: 60 * 1000,
  })
}
