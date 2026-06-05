import Link from "next/link";
import { LayoutDashboard, Users, ShoppingBag, Settings } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminActions from "@/components/admin/AdminActions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f2f4f8] font-sans text-[#0f1111]">
      {/* Sidebar - Amazon Secondary Dark */}
      <ul className="flex flex-col w-64 bg-[#232f3e] text-white overflow-y-auto shrink-0 border-r border-[#131921]">
        <Link href="/admin" className="flex items-center justify-center h-16 border-b border-white/10 shrink-0 bg-[#131921]">
          <div className="flex items-center gap-3 px-4 w-full">
            <div className="w-8 h-8 rounded bg-[#ff9900] text-zinc-900 flex items-center justify-center font-black text-xl">
              R
            </div>
            <span className="font-bold tracking-wide text-base">Rain Seller</span>
          </div>
        </Link>

        <div className="px-3 py-6">
          <p className="text-[11px] font-bold text-[#eaeded]/60 uppercase tracking-wider mb-3 px-3">Home</p>
          <li className="mb-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/10 text-white font-medium text-sm transition-colors">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>

          <div className="my-6 border-t border-white/10"></div>

          <p className="text-[11px] font-bold text-[#eaeded]/60 uppercase tracking-wider mb-3 px-3">Catalog & Orders</p>
          <li className="mb-1">
            <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/10 text-[#eaeded] hover:text-white font-medium text-sm transition-colors">
              <ShoppingBag size={18} />
              Inventory
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/10 text-[#eaeded] hover:text-white font-medium text-sm transition-colors">
              <LayoutDashboard size={18} />
              Manage Orders
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/admin/reports/sales" className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/10 text-[#eaeded] hover:text-white font-medium text-sm transition-colors">
              <LayoutDashboard size={18} />
              Sales Report
            </Link>
          </li>

          <div className="my-6 border-t border-white/10"></div>

          <p className="text-[11px] font-bold text-[#eaeded]/60 uppercase tracking-wider mb-3 px-3">Settings</p>
          <li className="mb-1">
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/10 text-[#eaeded] hover:text-white font-medium text-sm transition-colors">
              <Users size={18} />
              User Permissions
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/10 text-[#eaeded] hover:text-white font-medium text-sm transition-colors">
              <Settings size={18} />
              Store Settings
            </Link>
          </li>
        </div>
      </ul>

      {/* Content Wrapper */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar - Amazon Primary Dark (Interactive) */}
        <AdminTopbar />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f2f4f8] p-6 lg:p-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white py-4 shrink-0 border-t border-[#e7e7e7]">
          <div className="container mx-auto text-center text-sm text-[#565959]">
            &copy; 2026, Rainsecond.id or its affiliates. Amazon Seller Central Clone.
          </div>
        </footer>
      </div>
    </div>
  );
}
