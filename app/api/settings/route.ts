import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Menggunakan service role key jika ada untuk bypass RLS saat update, atau fallback ke anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (error) throw error;
    
    return NextResponse.json({
      aboutUs: data.about_us,
      contactUs: data.contact_us,
      whatsapp: data.whatsapp,
      instagram: data.instagram
    });
  } catch (error) {
    return NextResponse.json({
      aboutUs: "Toko thrift pilihan.",
      contactUs: "Hubungi kami di IG.",
      whatsapp: "081234567890",
      instagram: "@rainsecond_thrift"
    });
  }
}

export async function POST(req: Request) {
  try {
    const { aboutUs, contactUs, whatsapp, instagram } = await req.json();
    
    const { error } = await supabase
      .from("settings")
      .update({ 
        about_us: aboutUs, 
        contact_us: contactUs,
        whatsapp: whatsapp,
        instagram: instagram
      })
      .eq("id", 1);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
