import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 rounded-full bg-zinc-50 p-10 text-zinc-200">
        <ShoppingBag size={64} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Keranjang Kosong, Sob!</h2>
      <p className="mt-2 max-w-xs text-zinc-500 font-medium">
        Sepertinya belum ada harta karun yang kamu pilih hari ini.
      </p>
      <Link href="/shop">
        <button className="mt-8 rounded-full bg-orange-600 px-10 py-4 text-sm font-black text-white hover:bg-orange-700 transition shadow-lg shadow-orange-100 uppercase tracking-widest">
          Mulai Thrifting
        </button>
      </Link>
    </div>
  );
}