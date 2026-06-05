"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            role: "customer", // Tandai sebagai customer, bukan admin
          },
        },
      });

      if (error) throw error;
      
      // Jika berhasil, arahkan kembali ke keranjang untuk lanjut checkout
      router.push("/cart");
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-4 py-3 text-sm font-medium text-zinc-950 dark:text-white placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-orange-500 transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 transition-colors">
      <div className="w-full max-w-md p-8 rounded-3xl border border-transparent dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Daftar Akun</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Buat akun untuk melanjutkan checkout</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-sm font-medium text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Lengkap <span className="text-red-500">*</span></label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Email <span className="text-red-500">*</span></label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kamu.com" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">No. HP (Opsional)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Password <span className="text-red-500">*</span></label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className={inputClass} minLength={6} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 rounded-full py-4 text-sm font-black uppercase tracking-widest transition mt-6 ${
              loading ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500" : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {loading ? "Memproses..." : "Daftar Sekarang"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">Atau daftar dengan cepat via</span>
          </div>
        </div>

        <button
          onClick={async () => {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            supabase.auth.signInWithOAuth({ provider: 'google' });
          }}
          className="w-full mt-6 flex items-center justify-center gap-3 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-3.5 font-bold text-zinc-950 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <p className="mt-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-zinc-950 dark:text-white font-bold hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
