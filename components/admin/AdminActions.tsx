"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, CheckCircle, RotateCcw, LogOut, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminActions({ id, status, showLogout = false }: { id: string; status: string; showLogout?: boolean }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdateStatus = async () => {
    setLoading(true);
    const newStatus = status === 'available' ? 'sold' : 'available';
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", id)
      .select();

    if (error) {
      alert("Waduh, gagal! Pesannya: " + error.message);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Yakin mau hapus barang ini? Gak bisa balik lagi lho!")) return;
    setLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Waduh, gagal hapus! Pesannya: " + error.message);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex justify-end gap-2">
      {showLogout && (
        <button
          onClick={handleLogout}
          title="Keluar"
          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={20} />
        </button>
      )}
      {id && (
        <>
          <button
            onClick={() => router.push(`/admin/edit/${id}`)}
            disabled={loading}
            title="Edit Barang"
            className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={handleUpdateStatus}
            disabled={loading}
            title={status === 'available' ? "Tandai Terjual" : "Jadikan Tersedia"}
            className={`p-2 rounded-lg transition ${status === 'available' ? 'text-zinc-400 hover:text-green-600 hover:bg-green-50' : 'text-green-600 hover:bg-zinc-100'}`}
          >
            {status === 'available' ? <CheckCircle size={20} /> : <RotateCcw size={20} />}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            title="Hapus Barang"
            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={20} />
          </button>
        </>
      )}
    </div>
  );
}