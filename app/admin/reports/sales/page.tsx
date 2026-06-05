import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ExportToExcel from "@/components/admin/ExportToExcel";

export default async function SalesReportPage() {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch orders, only successful ones maybe? Or all of them, let's fetch all
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const allOrders = orders ?? [];

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate some stats
  const totalSales = allOrders
    .filter(o => o.status === "paid" || o.status === "success")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const totalOrders = allOrders.length;
  const successfulOrders = allOrders.filter(o => o.status === "paid" || o.status === "success").length;

  return (
    <div className="container-fluid font-sans text-[#858796]">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-[1.75rem] font-normal text-[#5a5c69] mb-1">Laporan Penjualan</h1>
          <p className="text-sm text-[#858796]">Ringkasan penjualan dan riwayat transaksi store Anda.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <ExportToExcel data={allOrders} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-4 border-[#4e73df] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#4e73df] uppercase mb-1">Total Pendapatan (Sukses)</div>
              <div className="text-xl font-bold text-[#5a5c69]">{formatRupiah(totalSales)}</div>
            </div>
            <div className="text-[#dddfeb]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-4 border-[#1cc88a] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#1cc88a] uppercase mb-1">Total Pesanan</div>
              <div className="text-xl font-bold text-[#5a5c69]">{totalOrders}</div>
            </div>
            <div className="text-[#dddfeb]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-4 border-[#36b9cc] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#36b9cc] uppercase mb-1">Pesanan Sukses</div>
              <div className="text-xl font-bold text-[#5a5c69]">{successfulOrders}</div>
            </div>
            <div className="text-[#dddfeb]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
        <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center justify-between">
          <h6 className="m-0 font-bold text-[#4e73df]">Data Transaksi Lengkap</h6>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#858796]">
              <thead className="border-b border-[#e3e6f0] text-[#5a5c69]">
                <tr>
                  <th className="px-5 py-3 font-bold">Order ID</th>
                  <th className="px-5 py-3 font-bold">Pelanggan</th>
                  <th className="px-5 py-3 font-bold">Total Belanja</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e6f0]">
                {allOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[#858796]">
                      Belum ada data penjualan.
                    </td>
                  </tr>
                )}
                {allOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-[#f8f9fc] transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-bold text-[#5a5c69]">{order.order_id}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-bold text-[#5a5c69] m-0">{order.customer_name}</p>
                        <p className="text-xs text-[#858796] m-0">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-[#5a5c69]">
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.status === "pending" ? "bg-[#f6c23e]/10 text-[#f6c23e]" :
                        order.status === "paid" || order.status === "success" ? "bg-[#1cc88a]/10 text-[#1cc88a]" :
                        order.status === "failed" || order.status === "cancel" ? "bg-[#e74a3b]/10 text-[#e74a3b]" :
                        "bg-[#858796]/10 text-[#858796]"
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
