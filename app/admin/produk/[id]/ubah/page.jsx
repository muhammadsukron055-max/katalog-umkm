import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { buatKoneksiServer } from "@/lib/supabase";
import { ubahProdukAdmin } from "@/app/admin/actions";

export const revalidate = 0;

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      produk = data;
    }
  } catch {
    // Abaikan jika error format id invalid
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk
        action={ubahProdukAdmin}
        produk={produk}
        labelTombol="Simpan perubahan"
      />
    </div>
  );
}
