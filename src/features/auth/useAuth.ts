import { useContext } from 'react'
import { AuthContext } from './AuthContext'

/**
 * Hook to access the current auth context.
 *
 * @throws Error if used outside of an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
