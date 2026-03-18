import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

import Auth from '@/components/Auth'
import { ThemedView } from '@/components/themed-view'

export default function LoginScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <ThemedView style={styles.container}>
        <Auth />
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
})