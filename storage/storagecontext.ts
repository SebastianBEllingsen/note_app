import { supabase } from "@/utils/supbase";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  username: string | null;
  imageUrl: string | null;
}

async function fetchLatestNotes(limit = 100) {
  const { data, error } = await supabase
    .from("notes")
    .select(
      "id, title, content, created_at, updated_at, imageUrl, profiles(username)",
    )
    .limit(limit);

  if (error) throw error;
  const notes = (data ?? []).map((n: any) => ({
    ...n,
    username: n.profiles?.username ?? null,
  }));
  console.log(notes);
  return notes as Note[];
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
        console.error("Failed to fetch notes:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      try {
        const ch = (globalThis as any).__notes_channel;
        if (ch && typeof ch.unsubscribe === "function") ch.unsubscribe();
      } catch {}
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const notesFromDb = await fetchLatestNotes();
      setNotes(notesFromDb);
    } catch (e) {
      console.error("Failed to refresh Notes", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(
    async (title: string, content: string, imageUrl: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log("Inserting note as user:", user?.id);
        const { data, error } = await supabase
          .from("notes")
          .insert({ title, content, imageUrl, user_id: user?.id });

        if (!error) {
          await refresh();
        }

        return { data, error };
      } catch (e) {
        console.error("addFact error", e);
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

        console.log(
          "editNote id:",
          id,
          "user:",
          user.id,
          "imageurl: ",
          imageUrl,
          "data:",
          data,
          "error:",
          error,
        );

        if (!error) {
          await refresh();
        }

        return { data, error };
      } catch (e) {
        console.error("addFact error", e);
        return { data: null, error: e };
      }
    },
    [refresh],
  );

  const deleteNote = useCallback(
    async (id: number) => {
      Alert.alert("Before you proceed", "Are you sure you want to delete?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (!user) throw new Error("Not authenticated");

              const { data, error } = await supabase
                .from("notes")
                .delete()
                .eq("id", id)
                .eq("user_id", user.id)
                .select();

              console.log(
                "deleteNote id:",
                id,
                "user:",
                user.id,
                "data:",
                data,
                "error:",
                error,
              );

              if (!error) {
                await refresh();
              }
            } catch (e) {
              console.error("deleteNote error", e);
            }
          },
        },
      ]);
    },
    [refresh],
  );

  return {
    notes,
    setNotes,
    deleteNote,
    refresh,
    loading,
    addNote,
    editNote,
  } as const;
}
