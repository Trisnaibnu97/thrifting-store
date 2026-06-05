import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data: products } = await query;

  const title = q
    ? `Hasil Cari: "${q}"`
    : category
    ? `Koleksi ${category}`
    : "Semua Koleksi";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      {/* HEADER */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft size={14} className="mr-2" /> Kembali ke Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{products?.length ?? 0}</span> barang tersedia
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-7xl">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-900">
            <div className="mb-6 rounded-full bg-white dark:bg-zinc-800 p-6 text-zinc-400 dark:text-zinc-500 shadow-sm">
              <SearchX size={48} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Barang Tidak Ditemukan
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 font-medium max-w-sm mx-auto">
              Maaf, kata kunci atau kategori yang Anda cari tidak tersedia saat ini.
            </p>
            <Link href="/shop">
              <button className="mt-8 rounded-full bg-zinc-900 dark:bg-zinc-100 px-8 py-3.5 text-sm font-bold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                Lihat Semua Koleksi
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
