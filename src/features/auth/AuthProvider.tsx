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
    let mounted = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        // Unblock the UI immediately — we know if user is logged in or not
        setState({
          session,
          user: session?.user ?? null,
          role: null,
          isLoading: false,
          error: null,
        })

        // Fetch role OUTSIDE the onAuthStateChange lock.
        //
        // Supabase JS v2 holds an internal lock while calling onAuthStateChange
        // callbacks (via _acquirelock → _notifyAllSubscribers). Any Supabase API
        // call inside the callback (e.g. supabase.from(...).select()) internally
        // calls getSession(), which tries to re-acquire the same lock → deadlock.
        // All subsequent Supabase queries also wait for the lock, causing a
        // permanent loading spinner.
        //
        // By scheduling fetchUserRole with setTimeout(0), the callback returns
        // immediately, Supabase releases the lock, and then fetchUserRole runs
        // freely in the next event loop tick.
        if (session?.user) {
          const userId = session.user.id
          setTimeout(async () => {
            if (!mounted) return
            const role = await fetchUserRole(userId)
            if (mounted) setState((prev) => ({ ...prev, role }))
          }, 0)
        }
      }
    )

    // Safety net: if onAuthStateChange's INITIAL_SESSION is delayed (e.g. Supabase
    // is refreshing an expired token), unblock the UI after 10 s.
    //
    // NOTE: We deliberately do NOT call getSession() here. In React 19 Strict Mode,
    // effects run twice, which would trigger two concurrent getSession() calls.
    // Supabase JS v2 uses an internal lock for token operations — two concurrent
    // calls deadlock it, causing all subsequent authenticated queries to hang forever.
    // onAuthStateChange fires reliably (SIGNED_IN / SIGNED_OUT / INITIAL_SESSION),
    // so the fallback is just this timeout.
    const safetyTimeout = setTimeout(() => {
      if (mounted) setState((prev) => prev.isLoading ? { ...prev, isLoading: false } : prev)
    }, 10_000)

    return () => {
      mounted = false
      clearTimeout(safetyTimeout)
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
