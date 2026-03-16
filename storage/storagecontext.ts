
import { supabase } from '@/utils/supbase';
import { useCallback, useEffect, useState } from 'react';

export interface Note {
  id: number;
  title: string;
  content: string;
}

async function fetchLatestNotes(limit = 100) {
  const { data, error } = await supabase
    .from('notes')
    .select('id, title, content')
    .limit(limit);

  if (error) throw error;
  console.log('error:', error)
  console.log('Data:', data)
  return data as Note[];
}


// A custom hook to get and set cat facts in storage (AsyncStorage + Supabase sync)
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const notesFromDb = await fetchLatestNotes();
        if (mounted) setNotes(notesFromDb);
      } catch (e) {
        // ignore errors - we have no local cache
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      try {
        const ch = (globalThis as any).__notes_channel;
        if (ch && typeof ch.unsubscribe === 'function') ch.unsubscribe();
      } catch {}
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const notesFromDb = await fetchLatestNotes();
      setNotes(notesFromDb);
    } catch (e) {
      console.error('Failed to refresh Notes', e);
    } finally {
      setLoading(false);
    }
  }, []);


  const addNote = useCallback(async (title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({ title, content });
      
      if (!error) {
        await refresh();
      }

      return { data, error };
    } catch (e) {
      console.error('addFact error', e);
      return { data: null, error: e };
    }
  }, [refresh]);

  return { notes, setNotes, refresh, loading, addNote } as const;
}
