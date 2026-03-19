import { useQuery } from '@tanstack/react-query'
import { fetchCoachRoster, rosterKeys } from '../api'

export function useCoachRoster(coachId: string) {
  return useQuery({
    queryKey: rosterKeys.coachRoster(coachId),
    queryFn: () => fetchCoachRoster(coachId),
    enabled: !!coachId,
    staleTime: 60 * 1000,
  })
}
