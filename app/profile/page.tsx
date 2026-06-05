"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut, Loader2, CheckCircle2, ShoppingBag, Package, Clock } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }
      
      const userData = session.user;
      setUser(userData);
      setName(userData.user_metadata?.full_name || "");
      setPhone(userData.user_metadata?.phone || "");
      setAddress(userData.user_metadata?.address || "");
      setLoading(false);

      // Fetch user's orders
      if (userData.email) {
        const { data: userOrders } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_email", userData.email)
          .order("created_at", { ascending: false });
          
        setOrders(userOrders || []);
      }
      setOrdersLoading(false);
    };
    
    fetchProfile();
  }, [router, supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          phone: phone,
          address: address,
        }
      });

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={32} />
      </div>
    );
  }

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const inputClass = "w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-950 dark:text-white placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Akun Saya</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Kelola informasi profil dan alamat pengiriman Anda.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 rounded-full transition-colors"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
            <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user?.user_metadata?.full_name || "Pengguna"}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{user?.email}</p>
              {user?.user_metadata?.role === "admin" && (
                <Link href="/admin" className="inline-block mt-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                  Buka Dashboard Admin &rarr;
                </Link>
              )}
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 flex items-center gap-3 text-sm font-medium text-green-700 dark:text-green-400">
              <CheckCircle2 size={18} className="text-green-500" />
              Profil berhasil diperbarui!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Nama Anda" />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Nomor HP</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="08xxxxxxxxxx" />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Alamat Lengkap</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className={`${inputClass} min-h-[100px] resize-y`} 
                placeholder="Alamat lengkap untuk pengiriman barang..."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-full transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>

        {/* Section Riwayat Pesanan */}
        <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="text-zinc-900 dark:text-white" size={24} />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Riwayat Pesanan</h2>
          </div>

          {ordersLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-zinc-400" size={24} />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800">
              <Package size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Belum Ada Pesanan</h3>
              <p className="text-xs text-zinc-500">Anda belum pernah melakukan pemesanan.</p>
              <Link href="/shop" className="inline-block mt-4 text-xs font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-6 py-2.5 rounded-full hover:scale-105 transition-transform">
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.order_id} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors bg-zinc-50/50 dark:bg-zinc-950/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Order ID</span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white bg-zinc-200/50 dark:bg-zinc-800 px-2 py-0.5 rounded">{order.order_id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Clock size={12} />
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-zinc-900 dark:text-white">
                        {formatRupiah(order.total_amount)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        order.status === "settlement" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        order.status === "dikemas" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        order.status === "dikirim" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                        order.status === "selesai" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        order.status === "cancel" || order.status === "deny" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {order.status === "settlement" ? "Dibayar" : order.status}
                      </span>
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div className="mb-4 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl flex items-center justify-between border border-zinc-200 dark:border-zinc-700">
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Nomor Resi Pengiriman</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">{order.tracking_number}</p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(order.tracking_number);
                          alert("Nomor resi disalin!");
                        }}
                        className="text-[10px] font-bold text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-full hover:bg-zinc-50 transition-colors dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-800 shadow-sm"
                      >
                        Salin Resi
                      </button>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.name} className="object-cover w-full h-full" />
                          ) : (
                            <Package className="w-full h-full p-2 text-zinc-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-xs font-medium text-zinc-500">{item.brand || "Barang"} • Qty: 1</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
