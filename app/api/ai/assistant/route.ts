import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Initialize Supabase admin to fetch all products
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("status", "available");

    const availableProducts = products || [];

    // --- MOCK AI ENGINE ---
    // In a real scenario, we would send the 'prompt' and 'availableProducts' to OpenAI or Google Gemini.
    // For now, we use a smart heuristic to simulate the AI finding relevant products.
    
    const query = prompt.toLowerCase();
    let matchedProducts = availableProducts.filter(p => {
      const name = p.name.toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      
      // Basic keyword matching simulation
      const tokens = query.split(" ").filter((t: string) => t.length > 2);
      const isMatch = tokens.some((token: string) => name.includes(token) || desc.includes(token) || cat.includes(token));
      
      return isMatch;
    });

    // If no exact match, just return 4 random items to show off the UI (acting like AI suggestion)
    if (matchedProducts.length === 0) {
      matchedProducts = [...availableProducts].sort(() => 0.5 - Math.random()).slice(0, 4);
    } else {
      // Limit to 8
      matchedProducts = matchedProducts.slice(0, 8);
    }

    // Generate dynamic message
    let message = "Ini beberapa koleksi yang aku temukan untukmu!";
    if (query.includes("konser")) message = "Wow, untuk konser kamu butuh sesuatu yang *stand out*. Coba lihat koleksi ini!";
    if (query.includes("dingin") || query.includes("jaket")) message = "Cuaca dingin bukan berarti nggak bisa tampil keren. Ini beberapa outerwear terbaik kami.";
    if (query.includes("murah") || query.includes("under")) message = "Tenang, tampil hype nggak harus menguras dompet. Ini kurasi outfit hemat untukmu.";

    return NextResponse.json({
      message,
      products: matchedProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
