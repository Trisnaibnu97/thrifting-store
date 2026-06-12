import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AddToCartWrapper from "@/components/product/AddToCartWrapper";
import LiveCounter from "@/components/product/LiveCounter";
import { getFinalPrice, hasDiscount } from "@/types/product";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Use standard client without cookies to avoid opting into dynamic rendering
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return notFound();

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const discounted = hasDiscount(product);
  const finalPrice = getFinalPrice(product);

  const nomorWA = "6287713726230";
  const pesan = `Halo RAINSECOND! Saya mau order barang ini:
Barang: ${product.name}
Size: ${product.size}
Harga: ${formatRupiah(finalPrice)}`;

  const waLink = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:gap-20 lg:grid-cols-2">
          
          {/* Sisi Kiri: Gambar Produk */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Image
              src={product.image_urls?.[0] || "https://placehold.co/600x800?text=No+Image"}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${product.status === 'sold' ? 'grayscale opacity-60' : ''}`}
              priority
            />
            {product.status === 'sold' && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <span className="rounded-full bg-zinc-900 dark:bg-white px-8 py-3 text-lg font-bold text-white dark:text-zinc-900 uppercase tracking-widest shadow-2xl">
                  Terjual
                </span>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Info Detail */}
          <div className="flex flex-col py-4 md:py-8">
            <div>
              <span className="inline-block rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                {product.category}
              </span>
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="mt-8">
              {discounted ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xl text-zinc-500 dark:text-zinc-400 line-through font-medium">
                    {formatRupiah(product.price)}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-500 tracking-tight">
                      {formatRupiah(finalPrice)}
                    </span>
                    {product.discount_percent && (
                      <span className="inline-block rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-sm font-bold text-red-600 dark:text-red-400">
                        -{product.discount_percent}%
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {formatRupiah(product.price)}
                </p>
              )}

              {/* LIVE COUNTER (FOMO) */}
              {product.status === 'available' && <LiveCounter productId={product.id} />}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-y border-zinc-200 dark:border-zinc-800 py-8 mt-10">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Ukuran</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase">{product.size}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Kondisi</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase">{product.condition}</p>
              </div>
              {product.weight && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Berat</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {product.weight >= 1000
                      ? `${(product.weight / 1000).toFixed(1)} kg`
                      : `${product.weight} gr`}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Deskripsi</p>
              <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <p>{product.description || "Tidak ada deskripsi tambahan untuk produk ini."}</p>
              </div>
            </div>

            {/* AREA TOMBOL AKSI */}
            <div className="mt-12 space-y-4">
              <AddToCartWrapper product={product} />

              {product.status === 'available' ? (
                <a 
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1ebd57] text-white py-4 text-sm font-bold transition-colors uppercase tracking-widest shadow-sm"
                >
                  Tanya via WhatsApp
                </a>
              ) : (
                <div className="w-full rounded-full bg-zinc-100 dark:bg-zinc-800 py-4 text-center text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest cursor-not-allowed border border-zinc-200 dark:border-zinc-700">
                  Stok Habis
                </div>
              )}
              
              <p className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-4">
                *Hanya tersedia 1 stok (1-of-1)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}