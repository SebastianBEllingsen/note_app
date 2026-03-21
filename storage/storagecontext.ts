import { supabase } from "@/utils/supbase";
import { useCallback, useEffect, useState } from "react";

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  username: string | null;
  imageUrl: string | null;
}

const PAGE_SIZE = 5;

async function fetchNotesPage(start: number, end: number) {
  const { data, error } = await supabase
    .from("notes")
    .select(
      "id, title, content, created_at, updated_at, imageUrl, profiles(username)",
    )
    .range(start, end);

  if (error) throw error;
  const notes = (data ?? []).map((n: any) => ({
    ...n,
    username: n.profiles?.username ?? null,
  }));
  return notes as Note[];
}

// A custom hook to get and set notes with pagination support
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const initial = await fetchNotesPage(0, PAGE_SIZE - 1);
        if (mounted) {
          setNotes(initial);
          setOffset(PAGE_SIZE);
          setHasMore(initial.length === PAGE_SIZE);
        }
      } catch (e) {
        console.error("Failed to fetch notes:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const initial = await fetchNotesPage(0, PAGE_SIZE - 1);
      setNotes(initial);
      setOffset(PAGE_SIZE);
      setHasMore(initial.length === PAGE_SIZE);
    } catch (e) {
      console.error("Failed to refresh Notes", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const more = await fetchNotesPage(offset, offset + PAGE_SIZE - 1);
      setNotes((prev) => [...prev, ...more]);
      setOffset((prev) => prev + PAGE_SIZE);
      setHasMore(more.length === PAGE_SIZE);
    } catch (e) {
      console.error("Failed to load more notes:", e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  const addNote = useCallback(
    async (title: string, content: string, imageUrl: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("notes")
          .insert({ title, content, imageUrl, user_id: user?.id });

        if (!error) {
          await refresh();
        }

        return { data, error };
      } catch (e) {
        console.error("addNote error", e);
        return { data: null, error: e };
      }
    },
    [refresh],
  );

  const editNote = useCallback(
    async (id: number, title: string, content: string, imageUrl: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        const { data, error } = await supabase
          .from("notes")
          .update({ title, content, imageUrl })
          .eq("id", id)
          .eq("user_id", user.id)
          .select();

        if (!error) {
          await refresh();
        }

        return { data, error };
      } catch (e) {
        console.error("editNote error", e);
        return { data: null, error: e };
      }
    },
    [refresh],
  );

  const deleteNote = useCallback(
    async (id: number) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase
          .from("notes")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id)
          .select();

        if (!error) {
          await refresh();
        }

        return { error };
      } catch (e) {
        console.error("deleteNote error", e);
        return { error: e };
      }
    },
    [refresh],
  );

  return {
    notes,
    setNotes,
    deleteNote,
    refresh,
    loading,
    loadMore,
    hasMore,
    addNote,
    editNote,
  } as const;
}
