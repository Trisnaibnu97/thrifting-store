import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users, ShoppingBag, DollarSign, Package,
  Plus
} from "lucide-react";
import AdminActions from "@/components/admin/AdminActions";
import SalesChart from "@/components/admin/SalesChart";
import BannerManager from "@/components/admin/BannerManager";
import WelcomeOverlay from "@/components/admin/WelcomeOverlay";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = user.user_metadata?.role || "customer";
  const userEmail = user.email || "";
  const isAdmin = role === "admin" || userEmail === "admin@admin.com" || userEmail === "admin@gmail.com";

  if (!isAdmin) {
    redirect("/profile"); // Tolak akses jika bukan admin
  }

  // Fetch semua data paralel
  const [
    { data: products },
    { data: orders },
    { data: banners },
  ] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("banners").select("*").order("sort_order", { ascending: true }),
  ]);

  const allProducts = products ?? [];
  const allOrders = orders ?? [];
  const allBanners = banners ?? [];

  // --- STATS ---
  const totalRevenue = allOrders
    .filter((o) => o.status === "settlement")
    .reduce((acc, o) => acc + (o.total_amount ?? 0), 0);
  const totalSold = allProducts.filter((p) => p.status === "sold").length;
  const totalActive = allProducts.filter((p) => p.status === "available").length;
  const totalOrders = allOrders.filter((o) => o.status === "settlement").length;

  // --- GRAFIK: Penjualan per bulan ---
  const monthlyMap: Record<string, { total: number; count: number }> = {};
  const dailyMap: Record<string, Record<string, { total: number; count: number }>> = {};

  allOrders
    .filter((o) => o.status === "settlement" && o.created_at)
    .forEach((o) => {
      const date = new Date(o.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { total: 0, count: 0 };
      monthlyMap[monthKey].total += o.total_amount ?? 0;
      monthlyMap[monthKey].count += 1;

      if (!dailyMap[monthKey]) dailyMap[monthKey] = {};
      if (!dailyMap[monthKey][dayKey]) dailyMap[monthKey][dayKey] = { total: 0, count: 0 };
      dailyMap[monthKey][dayKey].total += o.total_amount ?? 0;
      dailyMap[monthKey][dayKey].count += 1;
    });

  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  let finalMonthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, val]) => {
      const [year, m] = month.split("-");
      return {
        month,
        monthLabel: `${MONTH_NAMES[parseInt(m) - 1]} ${year.slice(2)}`,
        ...val,
      };
    });

  let finalDailyDataByMonth: Record<string, { day: string; dayLabel: string; total: number; count: number }[]> = {};
  Object.entries(dailyMap).forEach(([month, days]) => {
    finalDailyDataByMonth[month] = Object.entries(days)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, val]) => {
        const d = new Date(day);
        return {
          day,
          dayLabel: `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`,
          ...val,
        };
      });
  });

  // Jika belum ada data penjualan asli, buat data simulasi (Dummy) agar grafik tidak kosong
  const isMockData = finalMonthlyData.length === 0;
  if (isMockData) {
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      
      // Random penjualan antara 1jt s/d 8jt
      const mockTotal = Math.floor(Math.random() * 7000000) + 1000000;
      const mockCount = Math.floor(Math.random() * 20) + 5;
      
      finalMonthlyData.push({
        month: monthKey,
        monthLabel: `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
        total: mockTotal,
        count: mockCount,
      });

      // Data harian simulasi sederhana (hanya 1 tanggal per bulan untuk mockup chart)
      finalDailyDataByMonth[monthKey] = [
        { day: `${monthKey}-15`, dayLabel: `15 ${MONTH_NAMES[d.getMonth()]}`, total: mockTotal, count: mockCount }
      ];
    }
  }

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="container-fluid font-sans text-[#0f1111] relative">
      <WelcomeOverlay userName={user?.user_metadata?.full_name || "Admin"} />
      
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0f1111] mb-0">Dashboard</h1>
        <Link href="/admin/add" className="hidden md:flex items-center gap-2 bg-[#f0c14b] hover:bg-[#f4d078] text-[#111] border border-[#a88734] px-3 py-1.5 rounded text-sm transition-colors mt-4 md:mt-0 font-medium">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Content Row: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
        {/* Earnings Card */}
        <div className="bg-white rounded border border-[#e7e7e7] p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[#565959] mb-1">Total Balance</div>
            <div className="text-2xl font-bold text-[#0f1111]">{formatRupiah(totalRevenue)}</div>
          </div>
          <div className="text-[#007185] bg-[#007185]/10 p-2 rounded">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded border border-[#e7e7e7] p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[#565959] mb-1">Orders Shipped</div>
            <div className="text-2xl font-bold text-[#0f1111]">{totalOrders}</div>
          </div>
          <div className="text-[#007185] bg-[#007185]/10 p-2 rounded">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Sold Card */}
        <div className="bg-white rounded border border-[#e7e7e7] p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[#565959] mb-1">Units Sold</div>
            <div className="text-2xl font-bold text-[#0f1111]">{totalSold}</div>
          </div>
          <div className="text-[#007185] bg-[#007185]/10 p-2 rounded">
            <Package size={24} />
          </div>
        </div>

        {/* Active Card */}
        <div className="bg-white rounded border border-[#e7e7e7] p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[#565959] mb-1">Active Listings</div>
            <div className="text-2xl font-bold text-[#0f1111]">{totalActive}</div>
          </div>
          <div className="text-[#007185] bg-[#007185]/10 p-2 rounded">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Content Row: Charts & Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded border border-[#e7e7e7] mb-4 h-full">
            <div className="px-5 py-3 border-b border-[#e7e7e7] bg-[#f8f9fa] rounded-t flex items-center justify-between">
              <h6 className="m-0 font-bold text-[#0f1111]">Sales Summary</h6>
              {isMockData && (
                <span className="bg-[#f4d078]/20 text-[#a88734] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-[#f4d078]/50">
                  Data Simulasi
                </span>
              )}
            </div>
            <div className="p-5">
              <SalesChart monthlyData={finalMonthlyData} dailyDataByMonth={finalDailyDataByMonth} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded border border-[#e7e7e7] mb-4 h-full">
            <div className="px-5 py-3 border-b border-[#e7e7e7] bg-[#f8f9fa] rounded-t">
              <h6 className="m-0 font-bold text-[#0f1111]">Manage Banners</h6>
            </div>
            <div className="p-5">
              <BannerManager banners={allBanners} />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
