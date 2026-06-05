import { createClient } from "@/lib/supabase/server";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("category")
    .eq("status", "available");

  // Ambil kategori unik, buang yang null/kosong
  const categories: string[] = [
    ...new Set(
      (data ?? [])
        .map((p) => p.category as string)
        .filter(Boolean)
    ),
  ].sort();

  return <Navbar categories={categories} />;
}
