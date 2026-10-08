import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKoneksiServer } from "@/lib/supabase";

export const revalidate = 0;

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal terhubung ke database.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanError ? (
        <div className="rounded-xl border border-garis bg-permukaan p-6 text-bahaya">
          <p className="font-semibold">Gagal memuat produk</p>
          <p className="mt-1 text-sm text-teks-lembut">{pesanError}</p>
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="rounded-xl border border-dashed border-garis bg-permukaan p-8 text-center text-teks-lembut">
          Belum ada produk
        </p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
