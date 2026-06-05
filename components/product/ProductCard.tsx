import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product, getFinalPrice, hasDiscount } from "@/types/product";

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export default function ProductCard({ product }: { product: Product }) {
  const discounted = hasDiscount(product);
  const finalPrice = getFinalPrice(product);

  const mainImage = product.image_urls?.[0] || "https://placehold.co/500x500?text=No+Image";
  const hoverImage = product.image_urls?.length > 1 ? product.image_urls[1] : mainImage;

  return (
    <div className="group flex flex-col w-full bg-white dark:bg-zinc-950">
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-3 isolate">
        {/* SOLD OUT overlay */}
        {product.status === "sold" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-900/40 dark:bg-black/60 backdrop-blur-[2px]">
            <span className="bg-zinc-900 dark:bg-white px-5 py-2 text-sm font-black text-white dark:text-zinc-900 uppercase tracking-widest shadow-2xl rotate-[-5deg]">
              SOLD
            </span>
          </div>
        )}

        {/* Gambar Utama */}
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${
            hoverImage !== mainImage ? "group-hover:opacity-0" : ""
          } ${product.status === 'sold' ? 'opacity-80 grayscale-[50%]' : ''}`}
        />

        {/* Gambar Kedua (Muncul saat hover) */}
        {hoverImage !== mainImage && (
          <Image
            src={hoverImage}
            alt={`${product.name} - hover`}
            fill
            className={`object-cover transition-all duration-700 ease-in-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-110 ${
              product.status === 'sold' ? 'grayscale-[50%]' : ''
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <span className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-sm">
            {product.condition}
          </span>
          {discounted && product.status !== "sold" && (
            <span className="bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
              {product.discount_percent ? `-${product.discount_percent}%` : "SALE"}
            </span>
          )}
        </div>

        {/* Like Button (Social Commerce style) */}
        <button className="absolute top-2 right-2 z-10 p-1.5 text-zinc-900 bg-white/70 backdrop-blur-md rounded-full hover:bg-white hover:text-red-500 hover:scale-110 transition-all dark:bg-zinc-900/70 dark:text-white dark:hover:bg-zinc-900 dark:hover:text-red-500">
          <Heart size={18} strokeWidth={2.5} />
        </button>
      </Link>

      {/* Detail Text */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {product.category}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">
            SZ {product.size}
          </span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 font-black text-zinc-900 dark:text-zinc-100 hover:underline decoration-2 transition-all text-base md:text-lg leading-tight mt-1">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1">
          {discounted ? (
            <div className="flex items-end gap-2">
              <span className="text-xl font-black text-red-600 dark:text-red-500 tracking-tight">
                {formatRupiah(finalPrice)}
              </span>
              <span className="text-xs font-bold text-zinc-400 line-through mb-1">
                {formatRupiah(product.price)}
              </span>
            </div>
          ) : (
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {formatRupiah(product.price)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
