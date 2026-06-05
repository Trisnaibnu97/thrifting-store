"use client";

import { useCart } from "@/store/useCart";
import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const items = useCart((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="py-4 text-center bg-zinc-50 rounded-full text-[10px] font-bold text-zinc-400">MEMUAT...</div>;

  const alreadyInCart = items?.some((item) => item.id === product.id);

  return (
    <button
      onClick={() => {
        addItem(product);
        alert("Berhasil masuk keranjang!");
      }}
      disabled={alreadyInCart || product.status === 'sold'}
      className={`w-full flex items-center justify-center gap-3 rounded-full py-4 text-sm font-black uppercase tracking-widest transition ${
        alreadyInCart ? "bg-zinc-100 text-zinc-400" : "bg-zinc-950 text-white hover:bg-zinc-800"
      }`}
    >
      <ShoppingCart size={18} />
      {alreadyInCart ? "Sudah di Keranjang" : "Tambah ke Keranjang"}
    </button>
  );
}