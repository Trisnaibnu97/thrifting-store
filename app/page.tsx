import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import HeroCarousel from "@/components/ui/HeroCarousel";
import PromoTicker from "@/components/ui/PromoTicker";
import { createClient } from "@/lib/supabase/server";
import fs from "fs/promises";
import path from "path";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: products }, { data: banners }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const activeBanners = banners ?? [];
  const allProducts = products ?? [];

  // Get dynamic settings
  let settings = {
    aboutUs: "Kami adalah toko thrifting pilihan.",
    contactUs: "Hubungi kami di IG."
  };
  try {
    const settingsPath = path.join(process.cwd(), "data", "settings.json");
    const fileData = await fs.readFile(settingsPath, "utf8");
    settings = JSON.parse(fileData);
  } catch (e) {
    console.error("Failed to load settings", e);
  }

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      {/* BANNER SLIDESHOW */}
      {activeBanners.length > 0 ? (
        <HeroCarousel banners={activeBanners} />
      ) : (
        /* HERO SECTION (Fallback) */
        <section className="bg-zinc-50 dark:bg-zinc-900 py-24 md:py-32 border-b border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
              Curated Thrift, <br/> Elevated Style.
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 font-medium">
              Temukan koleksi pakaian thrift berkualitas premium yang dipilih dengan saksama.
            </p>
            <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-full transition-colors">
              Belanja Sekarang
            </Link>
          </div>
        </section>
      )}

      {/* PROMO TICKER MOVED HERE */}
      <PromoTicker />

      {/* ABOUT US & CONTACT US */}
      <section className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div id="about" className="scroll-mt-24">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-orange-500 rounded-full inline-block"></span>
              Tentang Kami
            </h2>
            <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap font-medium">
              {settings.aboutUs}
            </div>
          </div>
          
          <div id="contact" className="scroll-mt-24">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-zinc-900 dark:bg-white rounded-full inline-block"></span>
              Hubungi Kami
            </h2>
            <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap font-medium">
              {settings.contactUs}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 mt-12 md:mt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Koleksi Terbaru
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base">Pilihan terbaik minggu ini untuk Anda.</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors border-b-2 border-zinc-900 dark:border-zinc-100 pb-0.5 hidden sm:block">
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-8">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {allProducts.length === 0 && (
          <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 mt-8">
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              Koleksi sedang kosong. Coba kembali lagi nanti!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
