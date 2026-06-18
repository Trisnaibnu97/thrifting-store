"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Lock } from "lucide-react";

export default function CustomerLoginPage() {
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
      alert(`Gagal login: Email atau password salah.`);
      setLoading(false);
    } else {
      const role = data.user?.user_metadata?.role || "customer";
      const userEmail = data.user?.email || "";
      const isAdmin = role === "admin" || userEmail === "admin@admin.com" || userEmail === "admin@gmail.com";

      if (isAdmin) {
        router.push("/admin"); // Langsung ke dashboard admin
      } else {
        router.push("/profile"); // Arahkan pelanggan ke profil
      }
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 relative overflow-hidden">
        
        {/* Dekorasi Latar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>

        {/* Tombol Kembali */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Kembali ke Toko
        </Link>

        <div className="mb-8">
          <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-zinc-900 font-black text-2xl mb-5 shadow-lg">
            R
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Selamat Datang!
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Masuk ke akun Anda untuk melacak pesanan dan melanjutkan belanja.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 pl-11 pr-4 py-3 text-zinc-900 dark:text-white rounded-xl outline-none transition-all placeholder:text-zinc-400 text-sm font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 pl-11 pr-4 py-3 text-zinc-900 dark:text-white rounded-xl outline-none transition-all placeholder:text-zinc-400 text-sm font-medium"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Memproses..." : "Masuk ke Akun"}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
          <span className="text-xs font-bold text-zinc-400 uppercase">Atau</span>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
        </div>

        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="w-full mt-6 flex items-center justify-center gap-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-3.5 rounded-xl font-bold text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Lanjutkan dengan Google
        </button>

        <p className="text-center text-sm font-medium text-zinc-500 mt-8">
          Belum punya akun? <Link href="/register" className="text-orange-600 hover:text-orange-700 dark:text-orange-500 font-bold underline underline-offset-2">Daftar sekarang</Link>
        </p>

      </div>
    </div>
  );
}