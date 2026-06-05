"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@/store/useCart";
import { Product } from "@/types/product";

export default function CartItem({ product }: { product: Product }) {
  const removeItem = useCart((state) => state.removeItem);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="flex items-center gap-4 border-b border-zinc-100 py-6 last:border-0">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={product.image_urls[0]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-zinc-900 leading-tight">{product.name}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-wider">
              Size {product.size} • {product.category}
            </p>
          </div>
          <button 
            onClick={() => removeItem(product.id)}
            className="text-zinc-300 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className="mt-auto">
          <p className="font-black text-zinc-950">{formatRupiah(product.price)}</p>
        </div>
      </div>
    </div>
  );
}