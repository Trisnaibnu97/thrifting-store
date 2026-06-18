"use client";

import { useCart } from "@/store/useCart";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ShippingForm, { SelectedShipping } from "@/components/cart/ShippingForm";
import { getFinalPrice } from "@/types/product";
import Script from "next/script";

const PAYMENT_METHODS = [
  { code: "BC", name: "BCA Virtual Account", type: "bank" },
  { code: "M2", name: "Mandiri Virtual Account", type: "bank" },
  { code: "I1", name: "BNI Virtual Account", type: "bank" },
  { code: "BR", name: "BRI Virtual Account", type: "bank" },
  { code: "B1", name: "CIMB Niaga Virtual Account", type: "bank" },
  { code: "BT", name: "Permata Virtual Account", type: "bank" },
  { code: "DA", name: "DANA", type: "ewallet" },
  { code: "OV", name: "OVO", type: "ewallet" },
  { code: "SA", name: "ShopeePay", type: "ewallet" },
  { code: "LF", name: "LinkAja", type: "ewallet" },
];



const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("BC");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [shipping, setShipping] = useState<SelectedShipping | null>(null);
  const router = useRouter();

  const [userLoading, setUserLoading] = useState(true);
  
  // Subtotal pakai harga final (sudah diskon)
  const subtotal = items.reduce((acc, item) => acc + getFinalPrice(item), 0);
  const shippingCost = shipping?.cost || 0;
  const grandTotal = subtotal + shippingCost;

  useEffect(() => {
    setIsMounted(true);
    
    // Auth check
    const checkUser = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/register");
        return;
      }
      
      // Pre-fill data
      if (session.user) {
        setCustomerEmail(session.user.email || "");
        setCustomerName(session.user.user_metadata?.full_name || "");
        setCustomerPhone(session.user.user_metadata?.phone || "");
        setCustomerAddress(session.user.user_metadata?.address || "");
      }
      
      setUserLoading(false);
    };
    
    checkUser();
  }, [router]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!shipping) {
      alert("Harap pilih layanan pengiriman terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          shipping: {
            courier: shipping.courier,
            service: shipping.service,
            cost: shipping.cost,
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat transaksi");
      
      // Menggunakan pop-up Snap Midtrans
      if (data.token) {
        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: function(result: any){
            router.push("/profile");
          },
          onPending: function(result: any){
            router.push("/profile");
          },
          onError: function(result: any){
            alert("Pembayaran gagal!");
            setLoading(false);
          },
          onClose: async function(){
            // --- MODE SIMULASI (PENGGANTI PRODUCTION) ---
            // Saat user klik 'tutup' pop-up Midtrans, kita anggap pembayaran SUKSES.
            
            // 1. Kirim Notif Fonnte ke WA Admin
            try {
              const rincianBarang = items.map(item => `- ${item.name} (Size: ${item.size})`).join('\n');
              const pesanAdmin = `🚨 *PESANAN BARU MASUK* 🚨\n\n✅ *Status: PEMBAYARAN BERHASIL (LUNAS)*\n*(Simulasi Midtrans)*\n\n*Detail Pelanggan:*\n👤 Nama: ${customerName}\n📍 Alamat: ${customerAddress}\n\n*Rincian Pesanan:*\n${rincianBarang}\n\n*Total Tagihan:* Rp ${grandTotal.toLocaleString('id-ID')}\n\nSilakan cek Dashboard Admin untuk memproses pesanan.`;
              
              await fetch("/api/whatsapp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: pesanAdmin })
              });
            } catch (err) {
              console.error("Gagal kirim notif WA", err);
            }

            // 2. Kosongkan keranjang belanja
            clearCart();

            // 3. Arahkan ke halaman Sukses Pembayaran
            router.push("/payment/return?resultCode=00&merchantOrderId=" + new Date().getTime());
            
            setLoading(false);
          }
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  if (!isMounted || userLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const inputClass = "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors";

  return (
    <div className="min-h-screen bg-white pb-20">
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"} 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-950 mb-10 uppercase">
          Keranjang Kamu
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-zinc-50 border border-zinc-100">
            <p className="text-zinc-500 font-medium">Kosong nih, Sob. Yuk thrifting dulu!</p>
          </div>
        ) : (
          <form onSubmit={handlePay}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

              {/* KIRI */}
              <div className="lg:col-span-2 space-y-6">

                {/* List barang */}
                <div className="flex items-center justify-between">
                  <h2 className="font-black text-zinc-950 uppercase tracking-widest text-xs">Daftar Belanjaan</h2>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Yakin mau hapus semua barang dari keranjang?")) {
                        clearCart();
                      }
                    }}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Hapus Semua
                  </button>
                </div>
                <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                  {items.map((item) => {
                    const finalPrice = getFinalPrice(item);
                    const discounted = finalPrice < item.price;
                    return (
                      <div key={item.id} className="flex items-center gap-4 px-6 py-5 border-b border-zinc-100 last:border-0">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                          <Image src={item.image_urls[0]} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-zinc-900 truncate">{item.name}</h3>
                          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">
                            Size {item.size} · {item.category}
                          </p>
                          <div className="mt-1">
                            {discounted ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400 line-through">{formatRupiah(item.price)}</span>
                                <span className="font-black text-red-500">{formatRupiah(finalPrice)}</span>
                              </div>
                            ) : (
                              <span className="font-black text-zinc-950">{formatRupiah(item.price)}</span>
                            )}
                          </div>
                        </div>
                        <button type="button" onClick={() => removeItem(item.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Data pemesan */}
                <div className="rounded-2xl border border-zinc-100 p-6 space-y-4">
                  <h2 className="font-black text-zinc-950 uppercase tracking-widest text-xs">Data Pemesan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700">Nama Lengkap <span className="text-red-500">*</span></label>
                      <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700">Email <span className="text-red-500">*</span></label>
                      <input type="email" required value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="email@kamu.com" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700">No. HP <span className="text-zinc-400 font-normal">(opsional)</span></label>
                      <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="08xxxxxxxxxx" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700">Alamat Lengkap <span className="text-red-500">*</span></label>
                      <input type="text" required value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Jl. Contoh No. 1, RT/RW, Kelurahan" className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Pengiriman */}
                <ShippingForm onShippingChange={setShipping} />

                {/* Metode Pembayaran akan ditangani oleh Midtrans di halaman selanjutnya */}
              </div>

              {/* KANAN: Ringkasan */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 space-y-5">
                  <h2 className="font-black text-zinc-950 uppercase tracking-widest text-xs">Ringkasan Belanja</h2>

                  <div className="space-y-3 border-b border-zinc-200 pb-5">
                    <div className="flex justify-between text-sm text-zinc-500">
                      <span>Subtotal ({items.length} barang)</span>
                      <span className="font-semibold text-zinc-800">{formatRupiah(subtotal)}</span>
                    </div>
                    {shipping && (
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Ongkir ({shipping.courierName.toUpperCase()})</span>
                        <span className="font-semibold text-zinc-800">{formatRupiah(shipping.cost)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-zinc-900">Total</span>
                    <span className="text-2xl font-black text-orange-500 tracking-tighter">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded-full py-4 text-sm font-black uppercase tracking-widest transition ${loading
                        ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                        : "bg-zinc-950 text-white hover:bg-zinc-800"
                      }`}
                  >
                    {loading ? "Menyiapkan..." : "Bayar Sekarang"}
                  </button>

                  <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Pembayaran aman via Midtrans
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
