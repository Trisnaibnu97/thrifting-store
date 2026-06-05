"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // KODE RAHASIA untuk mendaftar sebagai Admin
  const ADMIN_SECRET_KEY = "RAINSECOND_ADMIN"; 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi kode rahasia sebelum lanjut ke database
    if (secretCode !== ADMIN_SECRET_KEY) {
      setError("Akses Ditolak: Kode Pendaftaran Admin Tidak Valid!");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "admin", // Otomatis menjadi ADMIN
          },
        },
      });

      if (error) throw error;
      
      // Jika berhasil, arahkan langsung ke dashboard admin
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-none border-2 border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-4 text-sm font-bold text-zinc-950 dark:text-white placeholder:text-zinc-500 outline-none focus:border-zinc-950 dark:focus:border-white transition-colors uppercase tracking-widest";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors p-4">
      <div className="w-full max-w-lg p-10 bg-white dark:bg-zinc-900 border-t-8 border-red-600 shadow-2xl shadow-zinc-200 dark:shadow-none relative">
        
        {/* Tombol Kembali (Tersembunyi tapi ada) */}
        <Link href="/login" className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          Batal
        </Link>

        <div className="flex flex-col mb-10">
          <div className="h-12 w-12 bg-zinc-950 dark:bg-white rounded flex items-center justify-center mb-6">
            <ShieldCheck className="text-white dark:text-zinc-950" size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter leading-none">
            Registrasi <br/> <span className="text-red-600">Administrator</span>
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-4 border-l-2 border-red-600 pl-3">
            Portal ini hanya untuk internal toko.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">Nama Lengkap</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="ADMIN NAME" className={inputClass} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">Email Resmi</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ADMIN@RAINSECOND.ID" className={inputClass} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} minLength={6} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
              Secret Registration Code
            </label>
            <input 
              type="password" 
              required 
              value={secretCode} 
              onChange={(e) => setSecretCode(e.target.value)} 
              placeholder="MASUKKAN KODE RAHASIA" 
              className="w-full rounded-none border-2 border-red-600 bg-red-50 dark:bg-red-950/10 px-4 py-4 text-sm font-black text-red-600 outline-none focus:bg-red-100 transition-colors uppercase tracking-widest" 
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-5 text-xs font-black uppercase tracking-[0.2em] transition mt-8 ${
              loading ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400" : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200"
            }`}
          >
            {loading ? "Otentikasi..." : "Otorisasi & Daftar"} <ArrowRight size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
