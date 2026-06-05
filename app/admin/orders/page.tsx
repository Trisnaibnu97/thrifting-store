import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch orders
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

  return (
    <div className="container-fluid font-sans text-[#858796]">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-[1.75rem] font-normal text-[#5a5c69] mb-0">Management Pesanan</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Katalog Pesanan */}
        <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
          <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center justify-between">
            <div>
              <h6 className="m-0 font-bold text-[#4e73df]">Daftar Semua Pesanan (Orders)</h6>
              <span className="text-xs text-[#858796]">{allOrders.length} pesanan ditemukan</span>
            </div>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#858796]">
                <thead className="border-b border-[#e3e6f0] text-[#5a5c69]">
                  <tr>
                    <th className="px-5 py-3 font-bold">Order ID</th>
                    <th className="px-5 py-3 font-bold">Pelanggan</th>
                    <th className="px-5 py-3 font-bold">Total Harga</th>
                    <th className="px-5 py-3 font-bold">Status Pembayaran</th>
                    <th className="px-5 py-3 font-bold">Tanggal Pesanan</th>
                    <th className="px-5 py-3 font-bold text-right">Aksi Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e6f0]">
                  {allOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[#858796]">
                        Belum ada pesanan masuk.
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
                          <p className="text-[10px] text-[#858796] m-0 mt-0.5 max-w-[200px] truncate" title={order.customer_address}>
                            {order.customer_address}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium text-[#5a5c69]">
                        {formatRupiah(order.total_amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === "pending" ? "bg-[#f6c23e]/10 text-[#f6c23e]" :
                          order.status === "settlement" ? "bg-[#1cc88a]/10 text-[#1cc88a]" :
                          order.status === "dikemas" ? "bg-[#4e73df]/10 text-[#4e73df]" :
                          order.status === "dikirim" ? "bg-[#36b9cc]/10 text-[#36b9cc]" :
                          order.status === "selesai" ? "bg-[#1cc88a]/20 text-[#1cc88a]" :
                          order.status === "cancel" || order.status === "deny" ? "bg-[#e74a3b]/10 text-[#e74a3b]" :
                          "bg-[#858796]/10 text-[#858796]"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end">
                          <OrderStatusUpdater orderId={order.order_id} currentStatus={order.status} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
