import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthState, AuthContextValue, UserRole } from './types'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * AuthProvider manages the Supabase auth lifecycle and role detection.
 *
 * Design notes:
 * - onAuthStateChange is the primary source of truth (not getSession)
 * - Role is fetched from the 'profiles' table after each auth event
 * - refreshRole() is exposed so RoleSelectionPage can update after writing to profiles
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    isLoading: true,
    error: null,
  })

  // Ref to avoid stale closure in refreshRole
  const userIdRef = useRef<string | null>(null)
  userIdRef.current = state.user?.id ?? null

  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile row yet — trigger hasn't fired or is still running
        return null
      }
      console.error('Error fetching user role:', error)
      return null
    }

    return data.role
  }, [])

  const refreshRole = useCallback(async () => {
    const userId = userIdRef.current
    if (!userId) return
    const role = await fetchUserRole(userId)
    setState((prev) => ({ ...prev, role }))
  }, [fetchUserRole])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    // When email confirmation is enabled, Supabase returns a user but no session
    return { confirmEmail: !data.session }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const deleteAccount = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('delete-account')
    if (error) throw error
    if (data && !data.success) throw new Error(data.error || 'Failed to delete account')
    // Sign out locally after server-side deletion
    await supabase.auth.signOut()
  }, [])

  useEffect(() => {
    // Set up the listener FIRST to avoid race conditions with getSession.
    // onAuthStateChange fires INITIAL_SESSION on setup, which gives us the
    // current session without needing a separate getSession() call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        let role: UserRole | null = null

        if (session?.user) {
          role = await fetchUserRole(session.user.id)
        }

        setState({
          session,
          user: session?.user ?? null,
          role,
          isLoading: false,
          error: null,
        })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUserRole])

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    deleteAccount,
    refreshRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

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
