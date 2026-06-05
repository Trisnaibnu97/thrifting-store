"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Gagal login: ${error.message}`);
      setLoading(false);
    } else {
      const role = data.user?.user_metadata?.role || "admin";
      if (role === "customer") {
        router.push("/cart"); // Arahkan pelanggan kembali ke keranjang
      } else {
        router.push("/admin"); // Arahkan admin ke dashboard
      }
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      
      {/* Kolom Kiri: Form Login (Minimalis & Brutalist) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative py-12">
        {/* Tombol Kembali */}
        <Link href="/" className="absolute top-8 left-8 sm:left-16 md:left-24 xl:left-32 flex items-center gap-2 text-xs font-black text-zinc-900 dark:text-zinc-100 hover:opacity-60 transition-opacity uppercase tracking-widest">
          <ArrowLeft size={16} strokeWidth={3} /> Kembali
        </Link>

        <div className="max-w-md w-full mx-auto space-y-12">
          <div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-zinc-950 dark:text-white uppercase leading-[0.9]">
              Portal <br /> Akses
            </h1>
            <p className="mt-6 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] border-l-4 border-red-500 pl-3">
              Autentikasi diperlukan untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ADMIN@STORE.COM"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-zinc-900 dark:focus:border-white px-5 py-4 text-zinc-900 dark:text-white font-bold outline-none transition-all placeholder:text-zinc-400 uppercase tracking-wider text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-zinc-900 dark:focus:border-white px-5 py-4 text-zinc-900 dark:text-white font-bold outline-none transition-all placeholder:text-zinc-400 text-sm tracking-widest"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-5 font-black text-sm uppercase tracking-[0.2em] transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-2xl shadow-zinc-950/20"
            >
              {loading ? "Memverifikasi..." : "Masuk Sekarang"}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Atau</span>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
          </div>

          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="w-full flex items-center justify-center gap-3 border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-4 font-black text-sm text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-white transition-all uppercase tracking-widest"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google OAuth
          </button>
        </div>
      </div>

      {/* Kolom Kanan: Gambar Editorial Premium */}
      <div className="hidden lg:block w-1/2 relative bg-zinc-100 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
        <Image 
          src="https://images.unsplash.com/photo-1528731708534-816fe59f90cb?q=80&w=1000&auto=format&fit=crop"
          alt="Editorial Fashion"
          fill
          className="object-cover grayscale contrast-125 brightness-75"
          unoptimized
          priority
        />
        {/* Overlay untuk mempertegas mood */}
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
        
        {/* Label Watermark */}
        <div className="absolute bottom-12 right-12 text-right">
          <p className="text-white text-sm font-black uppercase tracking-[0.4em] drop-shadow-lg">
            Authorized Personnel
          </p>
          <div className="w-12 h-1 bg-red-600 ml-auto mt-3"></div>
        </div>
      </div>

    </div>
  );
}