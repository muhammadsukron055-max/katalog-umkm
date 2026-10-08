import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk, jumlah = 1, varian }) {
  // Build message with optional variant and quantity
  let pesan = `Halo, saya mau pesan ${produk.nama}`;
  if (varian) {
    pesan += `, varian ${varian}`;
  }
  pesan += `, jumlah ${jumlah}.`;
  // Encode the message for WhatsApp URL
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <a
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}
