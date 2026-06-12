import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import HeroCarousel from "@/components/ui/HeroCarousel";
import PromoTicker from "@/components/ui/PromoTicker";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

export default async function HomePage() {
  // Use standard client without cookies to allow Next.js to cache the page
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const [{ data: products }, { data: banners }, { data: testimonials }] = await Promise.all([
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
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const activeBanners = banners ?? [];
  const allProducts = products ?? [];
  const approvedTestimonials = testimonials ?? [];

  // Get dynamic settings from Supabase
  let settings = {
    aboutUs: "Kami adalah toko thrifting pilihan.",
    contactUs: "Hubungi kami di IG."
  };
  try {
    const { data: settingsData } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (settingsData) {
      settings.aboutUs = settingsData.about_us;
      settings.contactUs = settingsData.contact_us;
    }
  } catch (e) {
    console.error("Failed to load settings from Supabase", e);
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

      {/* TESTIMONIALS SECTION */}
      {approvedTestimonials.length > 0 && (
        <section className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-2">
              Apa kata Mereka?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-12 font-medium">Apa kata pelanggan tentang koleksi thrift kami.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {approvedTestimonials.map((t) => (
                <div key={t.id} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-3xl text-left shadow-sm">
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                  </div>
                  <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 font-medium mb-6 italic leading-relaxed">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 dark:text-zinc-400">
                      {t.customer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{t.customer_name}</h4>
                      <p className="text-xs text-zinc-500 font-medium">Pelanggan Terverifikasi</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
