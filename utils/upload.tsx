import { supabase } from "@/utils/supbase";

const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function uploadImage(
  localUri: string,
  bucket: string,
  path: string,
): Promise<string> {
  // Format validation (before fetching)
  const ext = localUri.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error("Ugyldig format. Kun JPG, PNG eller WebP er tillatt.");
  }

  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();

  // Size validation
  if (arrayBuffer.byteLength > MAX_SIZE) {
    throw new Error("Bildet er for stort. Maks 15MB er tillatt.");
  }

  const mimeType = MIME_MAP[ext] ?? "image/jpeg";

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw new Error(`Opplasting feilet: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
}
