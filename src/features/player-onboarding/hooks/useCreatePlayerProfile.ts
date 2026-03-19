import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlayerProfile } from '../api/mutations'
import { profileKeys } from '../api/keys'
import type { TablesInsert } from '@/lib/database.types'

type PlayerProfileInsert = TablesInsert<'player_profiles'>

/**
 * Mutation hook for creating a player profile.
 *
 * Key TanStack Query patterns demonstrated:
 * - useMutation for side effects (POST/PUT/DELETE)
 * - onSuccess: invalidate cache to refetch fresh data
 * - onError: always log + surface to user (currently console, add toast later)
 * - Returns mutation object with { mutate, isPending, error, etc. }
 *
 * @example
 * const { mutate, isPending } = useCreatePlayerProfile()
 *
 * // In submit handler:
 * mutate(profileData, {
 *   onSuccess: () => navigate('/dashboard')
 * })
 */
export function useCreatePlayerProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profile: PlayerProfileInsert) => createPlayerProfile(profile),

    onSuccess: (_data) => {
      // Invalidate profile queries so any cached data is refreshed
      queryClient.invalidateQueries({
        queryKey: profileKeys.all,
      })

      // Note: We could add toast here when we add the component:
      // toast({ title: 'Perfil creado', description: '¡Bienvenido!' })
    },

    onError: (error) => {
      // CRITICAL: Always surface errors to users
      // For now we log, later we'll add toast notification
      console.error('createPlayerProfile failed:', error)

      // Note: Add toast when available:
      // toast({
      //   variant: 'destructive',
      //   title: 'Error',
      //   description: error.message || 'No se pudo guardar el perfil',
      // })
    },
  })
}
