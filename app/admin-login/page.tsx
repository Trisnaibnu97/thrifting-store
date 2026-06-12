"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
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
        alert("Akses ditolak. Ini adalah portal khusus Admin.");
        await supabase.auth.signOut();
        setLoading(false);
      } else {
        router.push("/admin"); // Arahkan admin ke dashboard
        router.refresh();
      }
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
              Autentikasi admin diperlukan.
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
              {loading ? "Memverifikasi..." : "Masuk Sebagai Admin"}
            </button>
          </form>
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
            Authorized Personnel Only
          </p>
          <div className="w-12 h-1 bg-red-600 ml-auto mt-3"></div>
        </div>
      </div>

    </div>
  );
}
