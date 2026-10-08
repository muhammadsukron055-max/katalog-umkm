import { createClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase untuk server menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (katalog dan detail produk) di sisi server
 * tanpa melewati batasan RLS publik.
 */
export function buatKoneksiServer() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = buatKoneksiServer;
export const buatClientServer = buatKoneksiServer;
export default buatKoneksiServer;

