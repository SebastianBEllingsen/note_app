import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  try {
    const payload = await req.json();

    // Supabase webhook sends { type, table, record, old_record }
    const note = payload.record;
    if (!note) {
      return new Response("No record in payload", { status: 400 });
    }

    const noteTitle: string = note.title ?? "Ukjent tittel";
    const creatorId: string = note.user_id;

    // Fetch all push tokens except the note creator's
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("push_token")
      .not("push_token", "is", null)
      .neq("id", creatorId);

    if (error) throw error;

    const tokens = (profiles ?? [])
      .map((p: { push_token: string | null }) => p.push_token)
      .filter(Boolean) as string[];

    if (tokens.length === 0) {
      return new Response("No recipients", { status: 200 });
    }

    // Send via Expo Push API
    const messages = tokens.map((token) => ({
      to: token,
      title: `Nytt notat: ${noteTitle}`,
      body: "En kollega har opprettet et nytt notat",
      sound: "default",
    }));

    const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });

    const result = await expoResponse.json();
    

    return new Response(JSON.stringify({ sent: tokens.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-new-note error:", e);
    return new Response(String(e), { status: 500 });
  }
});
