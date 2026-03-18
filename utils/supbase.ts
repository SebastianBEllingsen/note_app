import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import 'react-native-url-polyfill/auto'


const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabasePublishKey = process.env.EXPO_PUBLIC_SUPABASE_KEY
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

const supabaseKey = supabaseAnonKey ?? supabasePublishKey ?? process.env.EXPO_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Set EXPO_PUBLIC_SUPABASE_URL and an EXPO_PUBLIC_SUPABASE_* key.')
}

// safe web storage: use localStorage when available, otherwise in-memory fallback (for SSR / Node)
const memoryStore = new Map<string, string | null>()

const webStorageAdapter = {
  getItem: (key: string) => {
    try {
      if (typeof localStorage !== 'undefined') return Promise.resolve(localStorage.getItem(key))
    } catch {}
    return Promise.resolve(memoryStore.get(key) ?? null)
  },
  setItem: (key: string, value: string) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value)
        return Promise.resolve()
      }
    } catch {}
    memoryStore.set(key, value)
    return Promise.resolve()
  },
  removeItem: (key: string) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key)
        return Promise.resolve()
      }
    } catch {}
    memoryStore.delete(key)
    return Promise.resolve()
  },
}

const nativeStorageAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => {
    if (value.length > 2048) {
      console.warn('Value > 2048 bytes may not be stored successfully.')
    }
    return SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

const storageAdapter = Platform.OS === 'web' ? webStorageAdapter : nativeStorageAdapter

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: storageAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})