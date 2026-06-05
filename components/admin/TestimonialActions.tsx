"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, CheckCircle, XCircle } from "lucide-react";

export default function TestimonialActions({ id, isApproved }: { id: string, isApproved: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggleApproval = async () => {
    setLoading(true);
    await supabase.from("testimonials").update({ is_approved: !isApproved }).eq("id", id);
    router.refresh();
    setLoading(false);
  };

  const deleteTestimonial = async () => {
    if (!confirm("Hapus testimoni ini?")) return;
    setLoading(true);
    await supabase.from("testimonials").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={toggleApproval} 
        disabled={loading}
        className={`p-1.5 rounded transition ${isApproved ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
        title={isApproved ? "Sembunyikan" : "Tampilkan"}
      >
        {isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
      </button>
      <button 
        onClick={deleteTestimonial}
        disabled={loading}
        className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        title="Hapus"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
