/**
 * Query key factory for player profiles.
 *
 * Following TanStack Query best practices:
 * - Hierarchical keys enable targeted cache invalidation
 * - Type-safe keys with 'as const' assertion
 *
 * @example
 * // Invalidate all profile data
 * queryClient.invalidateQueries({ queryKey: profileKeys.all })
 *
 * // Invalidate specific user's profile
 * queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) })
 */
export const profileKeys = {
  all: ['player-profiles'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (userId: string) => [...profileKeys.details(), userId] as const,
}
