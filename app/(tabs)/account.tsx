import Account from '@/components/Account'
import { useAuthContext } from '@/hooks/use-auth-context'
import { ScrollView } from 'react-native'

export default function AccountScreen() {
  const { session } = useAuthContext()

  if (!session) return null

  return (
    <ScrollView>
      <Account userId={session.user.id} email={session.user.email} />
    </ScrollView>
  )
}
