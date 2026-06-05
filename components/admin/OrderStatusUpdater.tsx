"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    let trackingNumber = null;
    if (newStatus === "dikirim") {
      const input = prompt("Silakan masukkan Nomor Resi pengiriman:");
      if (input === null) {
        // Jika admin klik cancel di prompt, batalkan perubahan status
        e.target.value = currentStatus;
        return;
      }
      trackingNumber = input.trim();
    }

    setStatus(newStatus);
    setLoading(true);

    try {
      const supabase = createClient();
      
      const updateData: any = { status: newStatus };
      if (trackingNumber !== null) {
        updateData.tracking_number = trackingNumber;
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("order_id", orderId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Gagal mengupdate status pesanan.");
      setStatus(currentStatus); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className="text-xs font-bold bg-[#f8f9fc] border border-[#e3e6f0] text-[#5a5c69] rounded px-2 py-1 outline-none focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] transition disabled:opacity-50"
      >
        <option value="pending">Pending</option>
        <option value="settlement">Dibayar</option>
        <option value="dikemas">Dikemas</option>
        <option value="dikirim">Dikirim</option>
        <option value="selesai">Selesai</option>
        <option value="cancel">Batal</option>
      </select>
      {loading && <Loader2 size={14} className="animate-spin text-[#4e73df]" />}
    </div>
  );
}
