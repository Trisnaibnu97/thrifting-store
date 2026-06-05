"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import Link from "next/link";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCart((state) => state.clearCart);

  const resultCode = searchParams.get("resultCode");
  const orderId = searchParams.get("merchantOrderId");

  // resultCode: "00" = sukses, "01" = pending, "02" = dibatalkan
  const isSuccess = resultCode === "00";
  const isPending = resultCode === "01";

  useEffect(() => {
    if (isSuccess) {
      clearCart();
    }
  }, [isSuccess, clearCart]);

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-50 p-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-zinc-950">
              Pembayaran Berhasil!
            </h1>
            <p className="mt-2 text-zinc-500 font-medium">
              Makasih udah belanja di RAINSECOND 🔥
            </p>
            {orderId && (
              <p className="mt-1 text-xs text-zinc-400 font-mono">
                Order ID: {orderId}
              </p>
            )}
          </div>
          <Link href="/">
            <button className="w-full rounded-full bg-zinc-950 py-4 font-black text-white hover:bg-zinc-800 transition uppercase tracking-widest text-sm">
              Kembali ke Toko
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-orange-50 p-6">
              <Clock size={48} className="text-orange-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-zinc-950">
              Menunggu Pembayaran
            </h1>
            <p className="mt-2 text-zinc-500 font-medium">
              Selesaikan pembayaranmu sebelum expired ya, Sob.
            </p>
            {orderId && (
              <p className="mt-1 text-xs text-zinc-400 font-mono">
                Order ID: {orderId}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/cart">
              <button className="w-full rounded-full bg-orange-500 py-4 font-black text-white hover:bg-orange-600 transition uppercase tracking-widest text-sm">
                Lihat Keranjang
              </button>
            </Link>
            <Link href="/">
              <button className="w-full rounded-full border border-zinc-200 py-4 font-black text-zinc-600 hover:bg-zinc-50 transition uppercase tracking-widest text-sm">
                Kembali ke Toko
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dibatalkan / gagal
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-50 p-6">
            <XCircle size={48} className="text-red-400" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-zinc-950">
            Pembayaran Dibatalkan
          </h1>
          <p className="mt-2 text-zinc-500 font-medium">
            Gak jadi beli? Barangnya masih nunggu kok di keranjang.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/cart">
            <button className="w-full rounded-full bg-zinc-950 py-4 font-black text-white hover:bg-zinc-800 transition uppercase tracking-widest text-sm">
              Kembali ke Keranjang
            </button>
          </Link>
          <Link href="/shop">
            <button className="w-full rounded-full border border-zinc-200 py-4 font-black text-zinc-600 hover:bg-zinc-50 transition uppercase tracking-widest text-sm">
              Lanjut Belanja
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
