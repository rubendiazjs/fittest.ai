import { supabase } from '@/lib/supabase'
import type { GenerateWarmUpResponse } from '../types'

/**
 * Calls the generate-warmup Edge Function to create a personalized warm-up.
 *
 * The Edge Function:
 * 1. Authenticates the user via JWT
 * 2. Fetches their player profile
 * 3. Calls Claude API to generate warm-up
 * 4. Saves to database
 * 5. Returns the warm-up data
 */
export async function generateWarmUp(
  playerProfileId: string
): Promise<GenerateWarmUpResponse> {
  const { data, error } = await supabase.functions.invoke('generate-warmup', {
    body: { player_profile_id: playerProfileId },
  })

  if (error) {
    throw new Error(error.message || 'Failed to generate warm-up')
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to generate warm-up')
  }

  return data as GenerateWarmUpResponse
}
