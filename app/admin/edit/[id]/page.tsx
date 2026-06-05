"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();
  
  // Use React.use() to unwrap params
  const { id } = use(params);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) {
        alert("Gagal memuat data produk: " + error.message);
        router.push("/admin");
      } else {
        setProduct(data);
        if (data.image_urls && data.image_urls.length > 0) {
          setPreviewImage(data.image_urls[0]);
        }
      }
      setFetching(false);
    }
    fetchProduct();
  }, [id, router, supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("image") as File;
      let finalImageUrl = product.image_urls?.[0]; // Default keep existing image

      // Kalo upload gambar baru
      if (file && file.size > 0) {
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
          
        finalImageUrl = publicUrl;
      }

      // 4. Update Data ke Tabel Products
      const discountPercent = formData.get("discount_percent") as string;
      const discountPrice = formData.get("discount_price") as string;
      const weight = formData.get("weight") as string;

      const { error: dbError } = await supabase
        .from("products")
        .update({
          name: formData.get("name"),
          price: parseInt(formData.get("price") as string),
          size: formData.get("size"),
          condition: formData.get("condition"),
          category: formData.get("category"),
          description: formData.get("description"),
          image_urls: finalImageUrl ? [finalImageUrl] : [],
          discount_percent: discountPercent ? parseInt(discountPercent) : null,
          discount_price: discountPrice ? parseInt(discountPrice) : null,
          weight: weight ? parseInt(weight) : null,
        })
        .eq("id", id);

      if (dbError) throw new Error(`Gagal update data: ${dbError.message}`);

      alert("Produk berhasil diperbarui! 🔥");
      router.push("/admin"); // Arahkan ke Dashboard Admin
      router.refresh();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full p-4 border border-zinc-200 rounded-xl text-zinc-900 font-medium placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all";

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto p-10 border border-zinc-100 rounded-3xl bg-white shadow-xl shadow-zinc-50">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tighter">Edit Koleksi RAINSECOND</h1>
          <p className="text-base text-zinc-600 mt-2 font-medium">Ubah detail produk atau perbarui fotonya</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FOTO BARANG */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-950">Foto Barang (Biarkan kosong jika tidak ingin ganti foto)</label>
            <div className="border-4 border-dashed border-zinc-200 p-8 rounded-2xl text-center hover:border-orange-400 transition cursor-pointer relative bg-zinc-50 overflow-hidden">
              <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
              {previewImage ? (
                <div className="relative h-48 w-full z-10 flex items-center justify-center pointer-events-none">
                  <Image src={previewImage} alt="Preview" fill className="object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition text-white">
                    <ImageIcon size={32} />
                    <p className="text-sm font-bold mt-2">Klik untuk ganti foto</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-600 z-10">
                  <ImageIcon size={32} className="text-zinc-400" />
                  <p className="text-sm font-semibold">Klik atau seret foto baru ke sini</p>
                  <p className="text-xs text-zinc-500">Maksimal 1 file, format JPG/PNG</p>
                </div>
              )}
            </div>
          </div>

          {/* NAMA PRODUK */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-950">Nama Produk</label>
            <input name="name" defaultValue={product.name} placeholder="ex: Jaket Vintage Levi's 70505" className={inputClassName} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HARGA */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Harga (IDR)</label>
              <input name="price" defaultValue={product.price} type="number" placeholder="150000" className={inputClassName} required />
            </div>
            {/* SIZE */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Ukuran / Size</label>
              <input name="size" defaultValue={product.size} placeholder="ex: L / 32 / 44" className={inputClassName} required />
            </div>
            {/* BERAT */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Berat (gram)</label>
              <input name="weight" defaultValue={product.weight || ""} type="number" min="1" placeholder="ex: 500" className={inputClassName} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KONDISI */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Kondisi</label>
              <input name="condition" defaultValue={product.condition} placeholder="ex: 9/10 pekat" className={inputClassName} required />
            </div>
            {/* KATEGORI */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-950">Kategori</label>
              <input name="category" defaultValue={product.category} placeholder="ex: Jaket / Flanel / Cargo" className={inputClassName} required />
            </div>
          </div>
          {/* DESKRIPSI */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-950">Deskripsi Detail & Minus</label>
            <textarea name="description" defaultValue={product.description || ""} placeholder="Jelaskan detail minus (kalau ada), pudar warna, dll..." className={`${inputClassName} h-32 resize-none`} />
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
                  defaultValue={product.discount_percent || ""}
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
                  defaultValue={product.discount_price || ""}
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
              <><Loader2 className="animate-spin" size={20} /> Sedang menyimpan...</>
            ) : (
              <><Save size={20} /> SIMPAN PERUBAHAN</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
