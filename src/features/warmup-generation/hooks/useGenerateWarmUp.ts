import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generateWarmUp } from '../api/mutations'
import { warmupKeys } from '../api/keys'
import type { GenerateWarmUpResponse } from '../types'

/**
 * Mutation hook for generating a warm-up session.
 *
 * This calls the Edge Function which:
 * 1. Fetches player profile
 * 2. Calls Claude API
 * 3. Saves to database
 * 4. Returns warm-up data
 *
 * @example
 * const { mutate, isPending, data } = useGenerateWarmUp()
 *
 * // After profile is saved:
 * mutate(profileId, {
 *   onSuccess: (response) => {
 *     setWarmUp(response.warmup)
 *   }
 * })
 */
export function useGenerateWarmUp() {
  const queryClient = useQueryClient()

  return useMutation<GenerateWarmUpResponse, Error, string>({
    mutationFn: (playerProfileId: string) => generateWarmUp(playerProfileId),

    onSuccess: () => {
      // Invalidate warm-up queries so list is fresh
      queryClient.invalidateQueries({
        queryKey: warmupKeys.all,
      })
    },

    onError: (error) => {
      console.error('generateWarmUp failed:', error)
      // Note: Add toast notification when available
    },
  })
}
