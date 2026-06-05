"use client";

import { useCart } from "@/store/useCart";

export default function CartSummary() {
  const items = useCart((state) => state.items);
  const total = items.reduce((acc, item) => acc + item.price, 0);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="rounded-3xl border border-zinc-100 bg-zinc-50/50 p-8 shadow-sm">
      <h2 className="text-lg font-black tracking-tighter text-zinc-900 uppercase mb-6">Ringkasan Belanja</h2>
      
      <div className="space-y-4 border-b border-zinc-200 pb-6">
        <div className="flex justify-between text-sm text-zinc-500 font-medium">
          <span>Subtotal ({items.length} Barang)</span>
          <span>{formatRupiah(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-500 font-medium">
          <span>Biaya Layanan</span>
          <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-1 rounded-full">Gratis</span>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-baseline mb-8">
        <span className="text-zinc-900 font-bold">Total Tagihan</span>
        <span className="text-2xl font-black text-orange-600 tracking-tighter">
          {formatRupiah(total)}
        </span>
      </div>

      <button className="w-full rounded-full bg-zinc-950 py-4 text-sm font-black text-white transition hover:bg-zinc-800 shadow-xl shadow-zinc-200 uppercase tracking-widest">
        Lanjut Pembayaran
      </button>
      
      <p className="mt-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        *Pembayaran aman via Midtrans
      </p>
    </div>
  );
}