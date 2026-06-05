"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import AddToCartButton from "./AddToCartButton";

export default function AddToCartWrapper({ product }: { product: Product }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full rounded-full bg-zinc-100 py-5 text-center text-sm font-black text-zinc-400 uppercase tracking-widest border border-zinc-200">
        Tambah ke Keranjang
      </div>
    );
  }

  return <AddToCartButton product={product} />;
}
