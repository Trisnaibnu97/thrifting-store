import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TestimonialActions from "@/components/admin/TestimonialActions";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify Admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  // Fetch testimonials
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  const allTestimonials = testimonials ?? [];

  return (
    <div className="container-fluid font-sans text-[#858796]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-[1.75rem] font-normal text-[#5a5c69] mb-0">Management Testimoni</h1>
      </div>

      <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
        <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center justify-between">
          <div>
            <h6 className="m-0 font-bold text-[#4e73df]">Daftar Testimoni Pelanggan</h6>
            <span className="text-xs text-[#858796]">{allTestimonials.length} testimoni ditemukan</span>
          </div>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#858796]">
              <thead className="border-b border-[#e3e6f0] text-[#5a5c69]">
                <tr>
                  <th className="px-5 py-3 font-bold">Pelanggan</th>
                  <th className="px-5 py-3 font-bold">Rating</th>
                  <th className="px-5 py-3 font-bold max-w-xs">Isi Testimoni</th>
                  <th className="px-5 py-3 font-bold text-center">Status Tampil</th>
                  <th className="px-5 py-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e6f0]">
                {allTestimonials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[#858796]">
                      Belum ada testimoni masuk.
                    </td>
                  </tr>
                )}
                {allTestimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f8f9fc] transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-bold text-[#5a5c69]">{t.customer_name}</span>
                      <p className="text-[10px]">{new Date(t.created_at).toLocaleDateString("id-ID")}</p>
                    </td>
                    <td className="px-5 py-3 text-[#f6c23e] text-lg">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </td>
                    <td className="px-5 py-3 max-w-xs text-xs truncate">
                      {t.content}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.is_approved ? "Tampil" : "Disembunyikan"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <TestimonialActions id={t.id} isApproved={t.is_approved} />
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
