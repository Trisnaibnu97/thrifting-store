"use client";

import { useState } from "react";
import { deleteUser, updateUserRole } from "@/app/admin/users/actions";
import { Trash2, Shield, User } from "lucide-react";

interface Props {
  userId: string;
  currentRole: string;
  metadata: any;
}

export default function UserActions({ userId, currentRole, metadata }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus pengguna ini permanen?")) return;
    setLoading(true);
    const res = await deleteUser(userId);
    if (!res.success) alert("Gagal menghapus pengguna: " + res.error);
    setLoading(false);
  };

  const handleToggleRole = async () => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    if (!confirm(`Ubah role pengguna menjadi ${newRole.toUpperCase()}?`)) return;
    setLoading(true);
    const res = await updateUserRole(userId, metadata, newRole);
    if (!res.success) alert("Gagal mengubah role: " + res.error);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={handleToggleRole} 
        disabled={loading}
        title={`Jadikan ${currentRole === 'admin' ? 'Customer' : 'Admin'}`}
        className="p-1.5 bg-[#f8f9fc] hover:bg-[#e3e6f0] border border-[#e3e6f0] rounded text-[#858796] hover:text-[#4e73df] transition disabled:opacity-50"
      >
        {currentRole === "admin" ? <User size={14} /> : <Shield size={14} />}
      </button>
      <button 
        onClick={handleDelete} 
        disabled={loading}
        title="Hapus Pengguna"
        className="p-1.5 bg-[#f8f9fc] hover:bg-[#e3e6f0] border border-[#e3e6f0] rounded text-[#858796] hover:text-[#e74a3b] transition disabled:opacity-50"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
