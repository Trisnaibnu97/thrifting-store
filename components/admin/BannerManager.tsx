"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Banner } from "@/types/banner";
import { Plus, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon, Link as LinkIcon, X } from "lucide-react";
import Image from "next/image";

interface BannerManagerProps {
  banners: Banner[];
}

type ImageMode = "url" | "upload";

export default function BannerManager({ banners: initialBanners }: BannerManagerProps) {
  const [banners, setBanners] = useState(initialBanners);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageMode, setImageMode] = useState<ImageMode>("url");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({ title: "", subtitle: "", link_url: "" });
  const router = useRouter();
  const supabase = createClient();

  const handleImageUpload = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const res = await fetch("/api/banners/upload", {
      method: "POST",
      body: uploadFormData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload gagal");
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl && imageMode === "url") return alert("Masukkan URL gambar dulu!");
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;

      if (imageMode === "upload") {
        const fileInput = (e.currentTarget.elements.namedItem("imageFile") as HTMLInputElement);
        const file = fileInput?.files?.[0];
        if (!file) throw new Error("Pilih file gambar dulu!");
        finalImageUrl = await handleImageUpload(file);
      }

      const { data, error } = await supabase.from("banners").insert({
        title: form.title,
        subtitle: form.subtitle || null,
        image_url: finalImageUrl,
        link_url: form.link_url || null,
        is_active: true,
        sort_order: banners.length,
      }).select().single();

      if (error) throw new Error(error.message);
      setBanners((prev) => [...prev, data]);
      setShowForm(false);
      setForm({ title: "", subtitle: "", link_url: "" });
      setImageUrl("");
      setImagePreview("");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (banner: Banner) => {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !banner.is_active })
      .eq("id", banner.id);
    if (!error) {
      setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, is_active: !b.is_active } : b));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus banner ini?")) return;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (!error) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-[#4e73df]" size={18} />
          <span className="font-bold text-[#5a5c69] text-sm">Banner List</span>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 bg-[#4e73df] hover:bg-[#2e59d9] text-white px-3 py-1.5 rounded shadow-sm text-xs font-bold transition-colors"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Batal" : "Tambah"}
        </button>
      </div>

      {/* FORM TAMBAH BANNER */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-[#f8f9fc] p-4 rounded border border-[#e3e6f0]">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#858796] uppercase">Judul Banner</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Promo Akhir Tahun"
              className="w-full bg-white border border-[#d1d3e2] rounded px-3 py-2 text-sm text-[#6e707e] placeholder:text-[#d1d3e2] outline-none focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#858796] uppercase">Subjudul (opsional)</label>
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Diskon hingga 50%"
              className="w-full bg-white border border-[#d1d3e2] rounded px-3 py-2 text-sm text-[#6e707e] placeholder:text-[#d1d3e2] outline-none focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] transition"
            />
          </div>

          {/* Toggle URL / Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#858796] uppercase">Gambar Banner</label>
            <div className="flex gap-2">
              {(["url", "upload"] as ImageMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => { setImageMode(mode); setImageUrl(""); setImagePreview(""); }}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    imageMode === mode ? "bg-[#4e73df] text-white" : "bg-[#eaecf4] text-[#858796] hover:bg-[#d1d3e2]"
                  }`}
                >
                  {mode === "url" ? "URL Gambar" : "Upload File"}
                </button>
              ))}
            </div>

            {imageMode === "url" ? (
              <div className="flex gap-2">
                <input
                  value={imageUrl}
                  onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                  placeholder="https://example.com/banner.jpg"
                  className="flex-1 bg-white border border-[#d1d3e2] rounded px-3 py-2 text-sm text-[#6e707e] placeholder:text-[#d1d3e2] outline-none focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] transition"
                />
              </div>
            ) : (
              <input
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImagePreview(URL.createObjectURL(file));
                }}
                className="w-full bg-white border border-[#d1d3e2] rounded px-3 py-2 text-sm text-[#858796] outline-none file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#eaecf4] file:text-[#5a5c69]"
              />
            )}

            {imagePreview && (
              <div className="relative h-32 w-full overflow-hidden rounded border border-[#e3e6f0]">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#858796] uppercase flex items-center gap-1">
              <LinkIcon size={12} /> Link Tujuan (opsional)
            </label>
            <input
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              placeholder="/shop atau https://..."
              className="w-full bg-white border border-[#d1d3e2] rounded px-3 py-2 text-sm text-[#6e707e] placeholder:text-[#d1d3e2] outline-none focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-[#1cc88a] hover:bg-[#17a673] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : "Simpan Banner"}
          </button>
        </form>
      )}

      {/* LIST BANNER */}
      <div className="space-y-3">
        {banners.length === 0 && (
          <p className="text-center text-[#858796] text-xs font-bold py-6">
            Belum ada banner
          </p>
        )}
        {banners.map((banner) => (
          <div key={banner.id} className="flex items-center gap-3 bg-white p-3 rounded border border-[#e3e6f0] hover:shadow-sm transition-shadow">
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-[#eaecf4] border border-[#e3e6f0]">
              <Image src={banner.image_url} alt={banner.title} fill className="object-cover" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#5a5c69] truncate m-0">{banner.title}</p>
              {banner.subtitle && (
                <p className="text-xs text-[#858796] truncate m-0">{banner.subtitle}</p>
              )}
              <span className={`text-[10px] font-bold mt-1 inline-block ${banner.is_active ? "text-[#1cc88a]" : "text-[#e74a3b]"}`}>
                {banner.is_active ? "● Aktif" : "○ Nonaktif"}
              </span>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => toggleActive(banner)}
                title={banner.is_active ? "Nonaktifkan" : "Aktifkan"}
                className="p-1.5 rounded text-[#858796] hover:text-[#5a5c69] hover:bg-[#eaecf4] transition-colors"
              >
                {banner.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                title="Hapus"
                className="p-1.5 rounded text-[#858796] hover:text-[#e74a3b] hover:bg-[#fce4e4] transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
