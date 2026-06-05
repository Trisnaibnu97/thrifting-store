"use client";

import { useState, useEffect } from "react";
import { Save, Store, Lock, CreditCard, AtSign, Phone, FileText } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [aboutUs, setAboutUs] = useState("");
  const [contactUs, setContactUs] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setAboutUs(data.aboutUs || "");
        setContactUs(data.contactUs || "");
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutUs, contactUs })
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");
      
      setSuccessMsg("Pengaturan Halaman berhasil disimpan!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Error: Gagal menyimpan pengaturan.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded border border-[#e3e6f0] px-4 py-2 text-sm text-[#6e707e] focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df] transition-colors";
  const labelClass = "block text-xs font-bold text-[#858796] mb-1.5";

  return (
    <div className="container-fluid font-sans text-[#858796] pb-10">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-[1.75rem] font-normal text-[#5a5c69] mb-1">Pengaturan Sistem</h1>
          <p className="text-sm">Kelola profil toko, kontak, dan keamanan akun Anda di sini.</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded bg-[#1cc88a]/10 border border-[#1cc88a]/20 text-[#1cc88a] font-bold text-sm flex items-center gap-2">
          <Save size={16} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI (Profil & Kontak) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Konten Halaman */}
          <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
            <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center gap-2">
              <FileText size={18} className="text-[#4e73df]" />
              <h6 className="m-0 font-bold text-[#4e73df]">Konten Halaman Utama</h6>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelClass}>Teks "About Us"</label>
                <textarea 
                  rows={6} 
                  value={aboutUs}
                  onChange={(e) => setAboutUs(e.target.value)}
                  placeholder="Tulis sejarah atau deskripsi tokomu di sini..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Teks "Contact Us"</label>
                <textarea 
                  rows={6} 
                  value={contactUs}
                  onChange={(e) => setContactUs(e.target.value)}
                  placeholder="Informasi kontak, jam buka, dll..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Card: Kontak & Sosial Media */}
          <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
            <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center gap-2">
              <AtSign size={18} className="text-[#4e73df]" />
              <h6 className="m-0 font-bold text-[#4e73df]">Sosial Media & CS</h6>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}><Phone size={12} className="inline mr-1"/> Nomor WhatsApp (CS)</label>
                <input type="text" defaultValue="081234567890" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><AtSign size={12} className="inline mr-1"/> Username Instagram</label>
                <input type="text" defaultValue="@rainsecond_thrift" className={inputClass} />
              </div>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN (Sistem & Keamanan) */}
        <div className="space-y-6">
          
          {/* Card: Midtrans / Pembayaran */}
          <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
            <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center gap-2">
              <CreditCard size={18} className="text-[#4e73df]" />
              <h6 className="m-0 font-bold text-[#4e73df]">Gateway Pembayaran</h6>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelClass}>Environment Midtrans</label>
                <select className={inputClass}>
                  <option value="sandbox">Sandbox (Uji Coba)</option>
                  <option value="production">Production (Live)</option>
                </select>
                <p className="text-[10px] text-[#858796] mt-1">
                  Ubah ke Production jika toko sudah siap menerima pembayaran asli.
                </p>
              </div>
            </div>
          </div>

          {/* Card: Keamanan Admin */}
          <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
            <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center gap-2">
              <Lock size={18} className="text-[#f6c23e]" />
              <h6 className="m-0 font-bold text-[#f6c23e]">Ubah Password Admin</h6>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelClass}>Password Baru</label>
                <input type="password" placeholder="Biarkan kosong jika tidak diubah" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Konfirmasi Password Baru</label>
                <input type="password" placeholder="Ulangi password baru" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="sticky bottom-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded text-white font-bold flex items-center justify-center gap-2 transition ${
                loading ? "bg-[#858796] cursor-not-allowed" : "bg-[#4e73df] hover:bg-[#2e59d9] shadow-lg"
              }`}
            >
              <Save size={18} />
              {loading ? "Menyimpan..." : "Simpan Semua Pengaturan"}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
