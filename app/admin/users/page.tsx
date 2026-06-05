import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import UserActions from "@/components/admin/UserActions";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Auth check - pastikan yang akses adalah admin yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Inisialisasi client dengan Service Role Key untuk bypass RLS dan baca auth.users
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Ambil daftar pengguna
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  const allUsers = users ?? [];

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
        <h1 className="text-[1.75rem] font-normal text-[#5a5c69] mb-0">Kelola Pengguna</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Katalog Pengguna */}
        <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
          <div className="px-5 py-4 border-b border-[#e3e6f0] bg-[#f8f9fc] rounded-t flex items-center justify-between">
            <div>
              <h6 className="m-0 font-bold text-[#4e73df]">Daftar Akun (Admin & Customer)</h6>
              <span className="text-xs text-[#858796]">{allUsers.length} pengguna terdaftar</span>
            </div>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#858796]">
                <thead className="border-b border-[#e3e6f0] text-[#5a5c69]">
                  <tr>
                    <th className="px-5 py-3 font-bold">Nama Lengkap</th>
                    <th className="px-5 py-3 font-bold">Email</th>
                    <th className="px-5 py-3 font-bold">No HP</th>
                    <th className="px-5 py-3 font-bold">Role</th>
                    <th className="px-5 py-3 font-bold">Terdaftar Pada</th>
                    <th className="px-5 py-3 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e6f0]">
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[#858796]">
                        Belum ada pengguna.
                      </td>
                    </tr>
                  )}
                  {allUsers.map((u) => {
                    const role = u.user_metadata?.role || "admin"; // Default admin jika tidak ada role (karena akun lama)
                    const name = u.user_metadata?.full_name || "-";
                    const phone = u.user_metadata?.phone || "-";
                    
                    return (
                      <tr key={u.id} className="hover:bg-[#f8f9fc] transition-colors">
                        <td className="px-5 py-3">
                          <span className="font-bold text-[#5a5c69]">{name}</span>
                        </td>
                        <td className="px-5 py-3">
                          {u.email}
                        </td>
                        <td className="px-5 py-3">
                          {phone}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            role === "admin" 
                              ? "bg-[#4e73df]/10 text-[#4e73df]" 
                              : "bg-[#1cc88a]/10 text-[#1cc88a]"
                          }`}>
                            {role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs">
                          {formatDate(u.created_at)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <UserActions userId={u.id} currentRole={role} metadata={u.user_metadata || {}} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
