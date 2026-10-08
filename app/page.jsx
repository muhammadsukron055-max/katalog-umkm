import { Suspense } from "react";
import KartuProduk from "@/components/KartuProduk";
import FilterKatalog from "@/components/FilterKatalog";
import { toko } from "@/lib/toko";
import { buatKoneksiServer } from "@/lib/supabase";

export const revalidate = 0;

export default async function HalamanKatalog({ searchParams }) {
  const { cari, kategori } = (await searchParams) || {};
  let semuaProduk = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();
    let query = supabase.from("produk").select("*");

    if (cari) {
      query = query.ilike("nama", `%${cari}%`);
    }

    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error) {
      pesanError = error.message;
    } else {
      semuaProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal terhubung ke database.";
  }

  // Ambil daftar kategori unik untuk filter (selalu dari semua produk)
  let daftarKategori = [];
  if (!pesanError) {
    try {
      const supabase = buatKoneksiServer();
      const { data: semuaData } = await supabase
        .from("produk")
        .select("kategori");

      if (semuaData) {
        const set = new Set();
        semuaData.forEach((p) => {
          if (p.kategori) set.add(p.kategori);
        });
        daftarKategori = Array.from(set).sort();
      }
    } catch {
      // Abaikan error, filter kategori saja yang tidak tampil
    }
  }

  const adaFilter = cari || kategori;

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        <Suspense fallback={null}>
          <FilterKatalog daftarKategori={daftarKategori} />
        </Suspense>

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-6 text-bahaya">
            <p className="font-semibold">Gagal memuat produk</p>
            <p className="mt-1 text-sm text-teks-lembut">{pesanError}</p>
          </div>
        ) : semuaProduk.length === 0 ? (
          <p className="rounded-xl border border-dashed border-garis bg-permukaan p-8 text-center text-teks-lembut">
            {adaFilter
              ? "Tidak ada produk yang cocok dengan pencarian atau filter."
              : "Belum ada produk"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {semuaProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
