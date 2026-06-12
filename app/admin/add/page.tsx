// app/admin/add/page.tsx
"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("image") as File;

      if (!file || file.size === 0) {
        throw new Error("Pilih foto dulu, Sob!");
      }

      // 1. Sanitize Nama File
      const fileExt = file.name.split('.').pop();
      const cleanFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      // 2. Upload Gambar ke Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(cleanFileName, file);

      if (uploadError) throw new Error(`Gagal upload Storage: ${uploadError.message}`);

      // 3. Ambil Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(cleanFileName);

      // 4. Simpan Data ke Tabel Products
      const discountPercent = formData.get("discount_percent") as string;
      const discountPrice = formData.get("discount_price") as string;
      const weight = formData.get("weight") as string;

      const { error: dbError } = await supabase.from("products").insert({
        name: formData.get("name"),
        price: parseInt(formData.get("price") as string),
        size: formData.get("size"),
        condition: formData.get("condition"),
        category: formData.get("category"),
        description: formData.get("description"),
        image_urls: [publicUrl],
        status: 'available',
        discount_percent: discountPercent ? parseInt(discountPercent) : null,
        discount_price: discountPrice ? parseInt(discountPrice) : null,
        weight: weight ? parseInt(weight) : null,
      });

      if (dbError) throw new Error(`Gagal simpan data: ${dbError.message}`);

      alert("Barang RAINSECOND berhasil nambah! 🔥");
      router.push("/admin"); // Arahkan ke Dashboard Admin
      router.refresh();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = () => {
    setAiLoading(true);
    // Simulate AI delay
    setTimeout(() => {
      if (descRef.current) {
        descRef.current.value = "🔥 MUST HAVE ITEM! 🔥\n\nJaket vintage dengan looks super keren ini sangat cocok untuk kamu yang suka gaya streetwear/casual. Warnanya masih pekat (9/10), bahan tebal namun adem, dan potongannya pas banget di badan (boxxy fit).\n\nMinus: Nyaris tidak ada, hanya butuh cuci setrika siap nongkrong!\n\nGrab it fast sebelum ditikung teman!";
      }
      setAiLoading(false);
    }, 1500);
  };

  // Reusable styling class buat Input biar rapi dan kontras
  const inputClassName = "w-full p-4 border border-zinc-200 rounded-xl text-zinc-900 font-medium placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all";

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto p-10 border border-zinc-100 rounded-3xl bg-white shadow-xl shadow-zinc-50">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tighter">Tambah Koleksi RAINSECOND</h1>
          <p className="text-base text-zinc-600 mt-2 font-medium">Isi detail 'harta karun' terbaru kamu dengan teliti ya!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FOTO BARANG */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-950">Foto Barang Paling Ganteng</label>
            <div className="border-4 border-dashed border-zinc-200 p-8 rounded-2xl text-center hover:border-orange-400 transition cursor-pointer relative bg-zinc-50">
              <input name="image" type="file" accept="image/*" required className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="flex flex-col items-center gap-2 text-zinc-600">
                <ImageIcon size={32} className="text-zinc-400" />
                <p className="text-sm font-semibold">Klik atau seret foto ke sini</p>
                <p className="text-xs text-zinc-500">Maksimal 1 file, format JPG/PNG</p>
              </div>
            </div>
          </div>

          {/* NAMA PRODUK */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-950">Nama Produk</label>
            <input name="name" placeholder="ex: Jaket Vintage Levi's 70505" className={inputClassName} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HARGA */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Harga (IDR)</label>
              <input name="price" type="number" placeholder="150000" className={inputClassName} required />
            </div>
            {/* SIZE */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Ukuran / Size</label>
              <input name="size" placeholder="ex: L / 32 / 44" className={inputClassName} required />
            </div>
            {/* BERAT */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Berat (gram)</label>
              <input name="weight" type="number" min="1" placeholder="ex: 500" className={inputClassName} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KONDISI */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Kondisi</label>
              <input name="condition" placeholder="ex: 9/10 pekat" className={inputClassName} required />
            </div>
            {/* KATEGORI */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Kategori</label>
              <input name="category" placeholder="ex: Jaket / Flanel / Cargo" className={inputClassName} required />
            </div>
          </div>
          {/* DESKRIPSI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-zinc-950">Deskripsi Detail & Minus</label>
              <button
                type="button"
                onClick={generateWithAI}
                disabled={aiLoading}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 px-3 py-1.5 rounded-full transition-colors"
              >
                {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {aiLoading ? "MENGHASILKAN..." : "AUTO-GENERATE AI"}
              </button>
            </div>
            <textarea
              name="description"
              ref={descRef}
              placeholder="Jelaskan detail minus (kalau ada), pudar warna, dll..."
              className={`${inputClassName} h-32 resize-none`}
            />
          </div>

          {/* DISKON (OPSIONAL) */}
          <div className="space-y-3 rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white uppercase">SALE</span>
              <label className="text-sm font-bold text-zinc-950">Diskon <span className="text-zinc-400 font-normal">(opsional)</span></label>
            </div>
            <p className="text-xs text-zinc-500">Isi salah satu atau keduanya. Jika keduanya diisi, nominal akan dipakai.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Diskon Persen (%)</label>
                <input
                  name="discount_percent"
                  type="number"
                  min="1"
                  max="99"
                  placeholder="ex: 30"
                  className={inputClassName}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Harga Diskon (IDR)</label>
                <input
                  name="discount_price"
                  type="number"
                  min="0"
                  placeholder="ex: 100000"
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* TOMBOL */}
          <button
            disabled={loading}
            className={`w-full py-4 flex items-center justify-center gap-3 rounded-full font-extrabold text-white transition shadow-lg shadow-orange-100 ${loading ? 'bg-zinc-400' : 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-0.5'}`}
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> Sedang diproses...</>
            ) : (
              <><Plus size={20} /> POSTING KE KATALOG SEKARANG!</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}