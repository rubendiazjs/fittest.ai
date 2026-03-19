import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/AuthProvider'
import { fetchPlayerProfile } from '../api/mutations'
import { profileKeys } from '../api/keys'

/**
 * Query hook for fetching the current user's player profile.
 *
 * Returns null if no profile exists (new user).
 *
 * @example
 * const { data: profile, isLoading } = usePlayerProfile()
 *
 * if (isLoading) return <Spinner />
 * if (!profile) return <OnboardingWizard />
 * return <Dashboard profile={profile} />
 */
export function usePlayerProfile() {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => fetchPlayerProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
