import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { coachKeys, fetchCoachProfile } from '../api'

export function useCoachProfile() {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  return useQuery({
    queryKey: coachKeys.profile(userId),
    queryFn: () => fetchCoachProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}
