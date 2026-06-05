// app/shop/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  // 1. Tangkap parameter dari URL (q untuk search, category untuk filter)
  const { q, category } = await searchParams;
  const supabase = await createClient();

  // 2. Mulai Query Dasar (Hanya barang yang masih Available)
  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  // 3. Logika Pencarian (Jika ada ?q=...)
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  // 4. Logika Kategori (Jika ada ?category=...)
  if (category) {
    query = query.eq("category", category);
  }

  const { data: products, error } = await query;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HEADER KATALOG */}
      <div className="border-b bg-zinc-50/50 py-12">
        <div className="container mx-auto px-4">
          <Link 
            href="/" 
            className="mb-6 flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-orange-600 transition"
          >
            <ArrowLeft size={14} className="mr-2" /> Kembali ke Home
          </Link>
          
          <h1 className="text-4xl font-black tracking-tighter text-zinc-950 md:text-5xl">
            {q ? `Hasil Cari: "${q}"` : category ? `Koleksi ${category}` : "Semua Katalog"}
          </h1>
          <p className="mt-3 text-lg font-medium text-zinc-500">
            Ditemukan <span className="text-zinc-950 font-bold">{products?.length || 0}</span> barang pilihan untukmu.
          </p>
        </div>
      </div>

      {/* GRID PRODUK */}
      <div className="container mx-auto px-4 py-12">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* TAMPILAN JIKA TIDAK ADA BARANG */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 rounded-full bg-zinc-100 p-6 text-zinc-400">
              <SearchX size={48} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Waduh, Barangnya Gak Ketemu!
            </h2>
            <p className="mt-2 max-w-xs text-zinc-500 font-medium">
              Mungkin kata kuncinya kurang pas atau kategorinya lagi kosong, Sob.
            </p>
            <Link href="/shop">
              <button className="mt-8 rounded-full bg-zinc-950 px-8 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition">
                Lihat Semua Koleksi
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}