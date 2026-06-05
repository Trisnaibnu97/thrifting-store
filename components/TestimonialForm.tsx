"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquareHeart, Loader2 } from "lucide-react";

export default function TestimonialForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("testimonials").insert({
        user_id: user.id,
        customer_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Pelanggan",
        content: content.trim(),
        rating,
        is_approved: false // Harus disetujui admin dulu
      });

      if (error) throw error;
      
      setSuccess(true);
      setContent("");
      setRating(5);
    } catch (error) {
      console.error("Gagal mengirim testimoni:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-3xl p-6 text-center">
        <MessageSquareHeart size={32} className="mx-auto text-green-500 mb-3" />
        <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-1">Terima Kasih!</h3>
        <p className="text-sm text-green-600 dark:text-green-500">Testimoni Anda telah berhasil dikirim dan akan segera ditinjau oleh Admin.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs font-bold bg-white text-green-700 px-4 py-2 rounded-full border border-green-200 hover:bg-green-50 transition"
        >
          Tulis Testimoni Lain
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquareHeart className="text-zinc-900 dark:text-white" size={24} />
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Tulis Testimoni</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Bagikan pengalaman belanja Anda di toko kami.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Penilaian</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Pesan Testimoni</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bagaimana kualitas barangnya? Bagaimana pelayanannya?"
            className="w-full min-h-[100px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-full transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Mengirim..." : "Kirim Testimoni"}
        </button>
      </form>
    </div>
  );
}
