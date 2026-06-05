"use client";

import { useState } from "react";
import { Search, Bell, Mail, Menu, X, CheckCircle, Package } from "lucide-react";
import AdminActions from "@/components/admin/AdminActions";

export default function AdminTopbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Mencari Data: ${searchQuery}`);
    }
  };

  const notifications = [
    { id: 1, text: "Pesanan baru #ORD-001 dari Budi", time: "5 mnt lalu", unread: true },
    { id: 2, text: "Stok produk 'Vintage Jacket' menipis", time: "1 jam lalu", unread: true },
    { id: 3, text: "Pembayaran berhasil untuk #ORD-002", time: "2 jam lalu", unread: false },
  ];

  return (
    <nav className="h-16 bg-[#131921] flex items-center justify-between px-6 shrink-0 z-50 border-b border-zinc-800 relative">
      <button className="text-white md:hidden hover:text-[#ff9900] transition">
        <Menu size={24} />
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white rounded overflow-hidden shadow-sm h-9">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders, products, or customers" 
          className="bg-transparent px-4 text-sm outline-none w-80 text-[#0f1111] placeholder:text-[#565959]" 
          suppressHydrationWarning={true}
        />
        <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] text-zinc-900 px-4 h-full flex items-center justify-center transition">
          <Search size={18} />
        </button>
      </form>

      {/* Topbar Navbar */}
      <div className="flex items-center gap-5">
        
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); }}
            className="text-white hover:text-[#ff9900] relative transition"
          >
            <Bell size={20} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#c40000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#131921]">
              {notifications.filter(n => n.unread).length}
            </span>
          </button>

          {showNotifications && (
            <div className="absolute top-10 right-0 w-80 bg-white border border-[#e7e7e7] shadow-xl rounded-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="bg-[#f2f4f8] px-4 py-3 border-b border-[#e7e7e7] flex justify-between items-center">
                <h3 className="font-bold text-[#0f1111] text-sm">Notifications</h3>
                <button onClick={() => setShowNotifications(false)}><X size={16} className="text-zinc-500 hover:text-black" /></button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-[#e7e7e7] hover:bg-zinc-50 cursor-pointer flex gap-3 ${n.unread ? "bg-blue-50/50" : ""}`}>
                    <div className="shrink-0 mt-0.5">
                      <Package size={16} className={n.unread ? "text-[#007185]" : "text-zinc-400"} />
                    </div>
                    <div>
                      <p className={`text-sm ${n.unread ? 'font-bold text-[#0f1111]' : 'font-medium text-[#565959]'}`}>{n.text}</p>
                      <p className="text-xs text-[#565959] mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 text-center text-[#007185] hover:text-[#c45500] hover:underline text-xs font-bold cursor-pointer border-t border-[#e7e7e7]">
                View All Activity
              </div>
            </div>
          )}
        </div>

        {/* Mail / Messages Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); }}
            className="text-white hover:text-[#ff9900] relative transition"
          >
            <Mail size={20} />
          </button>

          {showMessages && (
            <div className="absolute top-10 right-0 w-72 bg-white border border-[#e7e7e7] shadow-xl rounded-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="bg-[#f2f4f8] px-4 py-3 border-b border-[#e7e7e7] flex justify-between items-center">
                <h3 className="font-bold text-[#0f1111] text-sm">Messages</h3>
                <button onClick={() => setShowMessages(false)}><X size={16} className="text-zinc-500 hover:text-black" /></button>
              </div>
              <div className="p-8 text-center flex flex-col items-center">
                <CheckCircle size={32} className="text-[#007185] mb-3" />
                <p className="text-sm font-bold text-[#0f1111]">Inbox is Empty</p>
                <p className="text-xs text-[#565959] mt-1">No new messages from customers.</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-white/20 mx-1"></div>
        
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[11px] font-medium text-[#eaeded] leading-none mb-1">Hello, Admin</span>
            <span className="text-sm font-bold text-white leading-none group-hover:text-[#ff9900] transition">Account & Settings</span>
          </div>
          <div className="w-8 h-8 rounded bg-[#eaeded] text-[#131921] flex items-center justify-center text-sm font-bold border border-transparent group-hover:border-[#ff9900] transition ml-2">
            A
          </div>
          <div className="ml-1">
            <AdminActions id="" status="" showLogout={true} />
          </div>
        </div>
      </div>
    </nav>
  );
}
