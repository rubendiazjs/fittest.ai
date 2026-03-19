import type { Session, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

export type UserRole = Database['public']['Enums']['user_role']

export interface AuthState {
  user: User | null
  session: Session | null
  role: UserRole | null
  isLoading: boolean
  error: Error | null
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<{ confirmEmail: boolean }>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
  selectRole: (role: UserRole) => Promise<void>
  refreshRole: () => Promise<void>
}
