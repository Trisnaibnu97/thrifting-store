"use client";

import { useState, useEffect } from "react";
import { Eye, ShoppingCart } from "lucide-react";

export default function LiveCounter({ productId }: { productId: string }) {
  const [viewers, setViewers] = useState(0);
  const [inCart, setInCart] = useState(0);

  useEffect(() => {
    // Generate initial random values based on product ID so it stays somewhat consistent per product
    const hash = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Base viewers: 2-8 people
    const initialViewers = (hash % 7) + 2;
    // Base in cart: 0-3 people
    const initialInCart = (hash % 4);

    setViewers(initialViewers);
    setInCart(initialInCart);

    // Randomly fluctuate viewers every 5-15 seconds to simulate real activity
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        // Keep it between 1 and 12
        const next = prev + change;
        if (next < 1) return 1;
        if (next > 12) return 12;
        return next;
      });
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="flex flex-col gap-2 mt-6 p-4 border-2 border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 rounded-xl">
      <div className="flex items-center gap-2">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <p className="text-sm font-bold text-red-600 dark:text-red-400">
          Lagi dilihat oleh <span className="font-black text-lg">{viewers}</span> orang
        </p>
      </div>

      {inCart > 0 && (
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <ShoppingCart size={14} className="text-zinc-400" />
          <p className="text-xs font-semibold">
            Sudah ada di keranjang <span className="font-bold text-zinc-700 dark:text-zinc-200">{inCart}</span> orang. Jangan sampai kehabisan!
          </p>
        </div>
      )}
    </div>
  );
}
