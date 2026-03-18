import { AuthContext, Profile } from '@/hooks/use-auth-context'
import { supabase } from '@/utils/supbase'
import { Session } from '@supabase/supabase-js'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const refreshProfile = async () => {
    if (!session?.user.id) return
    const { data } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url, website')
      .eq('id', session.user.id)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    if (session?.user.id) {
      refreshProfile()
    } else {
      setProfile(null)
    }
  }, [session?.user.id])

  const value = {
    session,
    isLoading,
    isLoggedIn: !!session,
    profile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}