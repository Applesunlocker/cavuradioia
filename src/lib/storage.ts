import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const MEDIA_BUCKET = "media";

/** Sube un archivo a la carpeta privada del usuario y devuelve su ruta interna. */
export async function uploadMedia(file: File, folder: "avatars" | "thumbnails" | "clips") {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) throw new Error("No autenticado");

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${uid}/${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

export async function getMediaUrl(path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteMedia(path: string) {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw error;
}

/** Convierte una ruta del almacén privado en una URL firmada temporal. */
export function useMediaUrl(path: string | null | undefined) {
  const isStoragePath = !!path && !/^https?:|^data:|^linear-gradient/.test(path);
  return useQuery({
    queryKey: ["media-url", path],
    enabled: isStoragePath,
    staleTime: 50 * 60 * 1000,
    queryFn: () => getMediaUrl(path as string),
  });
}

export function isImageFile(file: File) {
  return file.type.startsWith("image/");
}
