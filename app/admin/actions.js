"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

/**
 * Server Action untuk mengganti password admin yang sedang login.
 */
export async function gantiPasswordAdmin(prevState, formData) {
  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const supabase = await buatKoneksiAdmin();

  // Wajib periksa di server bahwa admin sudah login
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir. Silakan login kembali." };
  }

  const passwordBaru = form?.get("password_baru")?.toString() || "";
  const konfirmasiPassword = form?.get("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return {
      error: error.message || "Gagal mengganti password. Silakan coba lagi.",
    };
  }

  return { success: "Password berhasil diganti." };
}

/**
 * Server Action untuk menambah produk baru ke database Supabase.
 * Wajib memeriksa autentikasi admin di server sebelum melakukan insert.
 */
export async function tambahProdukAdmin(prevState, formData) {
  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const supabase = await buatKoneksiAdmin();

  // Wajib periksa di server bahwa admin sudah login
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir. Silakan login kembali." };
  }

  const nama = form?.get("nama")?.toString().trim();
  const hargaStr = form?.get("harga")?.toString().trim();
  const kategori = form?.get("kategori")?.toString().trim() || null;
  const foto_url = form?.get("foto_url")?.toString().trim() || null;
  const deskripsi = form?.get("deskripsi")?.toString().trim() || null;

  // Validasi input dasar
  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (!hargaStr || isNaN(Number(hargaStr)) || Number(hargaStr) < 0) {
    return { error: "Harga produk harus berupa angka dan tidak boleh negatif." };
  }

  const harga = Math.round(Number(hargaStr));

  const { error: insertError } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (insertError) {
    return {
      error: insertError.message || "Gagal menyimpan produk ke database.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");

  redirect("/admin?sukses=tambah");
}

/**
 * Server Action untuk memperbarui produk di database Supabase.
 * Wajib memeriksa autentikasi admin di server sebelum melakukan update.
 */
export async function ubahProdukAdmin(prevState, formData) {
  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const supabase = await buatKoneksiAdmin();

  // Wajib periksa di server bahwa admin sudah login
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir. Silakan login kembali." };
  }

  const id = form?.get("id")?.toString();
  const nama = form?.get("nama")?.toString().trim();
  const hargaStr = form?.get("harga")?.toString().trim();
  const kategori = form?.get("kategori")?.toString().trim() || null;
  const foto_url = form?.get("foto_url")?.toString().trim() || null;
  const deskripsi = form?.get("deskripsi")?.toString().trim() || null;

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  // Validasi input dasar
  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (!hargaStr || isNaN(Number(hargaStr)) || Number(hargaStr) < 0) {
    return { error: "Harga produk harus berupa angka dan tidak boleh negatif." };
  }

  const harga = Math.round(Number(hargaStr));

  const { error: updateError } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (updateError) {
    return {
      error: updateError.message || "Gagal memperbarui produk di database.",
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");

  redirect("/admin?sukses=ubah");
}
