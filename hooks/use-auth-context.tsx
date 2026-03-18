import { Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export type Profile = {
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
}

export type AuthData = {
  session: Session | null
  isLoading: boolean
  isLoggedIn: boolean
  profile: Profile | null
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthData>({
  session: null,
  isLoading: true,
  isLoggedIn: false,
  profile: null,
  refreshProfile: async () => {},
})

export const useAuthContext = () => useContext(AuthContext)