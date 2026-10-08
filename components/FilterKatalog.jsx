"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function FilterKatalog({ daftarKategori }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cariAktif = searchParams.get("cari") || "";
  const kategoriAktif = searchParams.get("kategori") || "";

  const buatUrl = useCallback(
    (params) => {
      const sp = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          sp.set(key, value);
        } else {
          sp.delete(key);
        }
      }
      const qs = sp.toString();
      return qs ? `/?${qs}` : "/";
    },
    [searchParams]
  );

  function handleCari(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nilai = formData.get("cari")?.toString().trim() || "";
    router.push(buatUrl({ cari: nilai }));
  }

  function handleKategori(kategori) {
    router.push(buatUrl({ kategori: kategori === kategoriAktif ? "" : kategori }));
  }

  function handleReset() {
    router.push("/");
  }

  const adaFilter = cariAktif || kategoriAktif;

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleCari} className="flex gap-2">
        <input
          type="search"
          name="cari"
          defaultValue={cariAktif}
          placeholder="Cari produk..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
        >
          Cari
        </button>
      </form>

      {daftarKategori.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {daftarKategori.map((kategori) => (
            <button
              key={kategori}
              type="button"
              onClick={() => handleKategori(kategori)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold transition-colors ${
                kategori === kategoriAktif
                  ? "border-utama bg-utama text-white"
                  : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
              }`}
            >
              {kategori}
            </button>
          ))}
          {adaFilter && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-garis bg-latar px-3 py-1 text-sm text-teks-lembut hover:border-bahaya hover:text-bahaya"
            >
              Hapus filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

