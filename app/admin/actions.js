"use server";

import { redirect } from "next/navigation";
import { buatKoneksiAdmin } from "@/lib/supabase/admin";

/**
 * Server Action untuk login admin menggunakan Supabase Auth.
 */
export async function masukAdmin(prevState, formData) {
  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const email = form?.get("email")?.toString().trim();
  const password = form?.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKoneksiAdmin();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email atau password salah. Silakan coba lagi."
          : error.message || "Gagal masuk. Silakan periksa kembali akun Anda.",
    };
  }

  redirect("/admin");
}

/**
 * Server Action untuk logout admin dan mengakhiri sesi.
 */
export async function keluarAdmin() {
  const supabase = await buatKoneksiAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

