import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import AdminActions from "@/components/admin/AdminActions";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const allProducts = products ?? [];

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="container-fluid font-sans text-[#858796]">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-[1.75rem] font-normal text-[#5a5c69] mb-0">Management Produk</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Katalog Produk */}
        <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
          <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center justify-between">
            <div>
              <h6 className="m-0 font-bold text-[#4e73df]">Daftar Semua Produk</h6>
              <span className="text-xs text-[#858796]">{allProducts.length} produk ditemukan</span>
            </div>
            <Link href="/admin/add">
              <button className="flex items-center gap-1 bg-[#4e73df] hover:bg-[#2e59d9] text-white px-3 py-1.5 rounded shadow-sm text-xs font-bold transition-colors">
                <Plus size={12} /> Tambah Produk Baru
              </button>
            </Link>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#858796]">
                <thead className="border-b border-[#e3e6f0] text-[#5a5c69]">
                  <tr>
                    <th className="px-5 py-3 font-bold">Produk</th>
                    <th className="px-5 py-3 font-bold">Deskripsi</th>
                    <th className="px-5 py-3 font-bold">Harga</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e6f0]">
                  {allProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[#858796]">
                        Belum ada produk di database.
                      </td>
                    </tr>
                  )}
                  {allProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8f9fc] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded bg-[#eaecf4] shrink-0 border border-[#e3e6f0]">
                            <Image src={item.image_urls?.[0] ?? ""} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-[#5a5c69] m-0">{item.name}</p>
                            <p className="text-xs text-[#858796] m-0 mt-0.5">
                              Size {item.size} · {item.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 max-w-xs truncate text-[#858796]">
                        {item.description || "-"}
                      </td>
                      <td className="px-5 py-3 font-medium text-[#5a5c69]">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === "available"
                            ? "bg-[#1cc88a]/10 text-[#1cc88a]"
                            : "bg-[#858796]/10 text-[#858796]"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <AdminActions id={item.id} status={item.status} />
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
