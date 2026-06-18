import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
    const ADMIN_WA = process.env.ADMIN_WA; // Format WA: "0812xxx" atau "62812xxx"

    if (!FONNTE_TOKEN || !ADMIN_WA) {
      console.warn("Fonnte Token atau Nomor Admin belum diatur di .env.local.");
      // Tetap kembalikan true agar checkout di frontend tidak error (hanya skip kirim WA)
      return NextResponse.json({ success: true, warning: "Credentials missing in .env.local" });
    }

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": FONNTE_TOKEN,
      },
      // Fonnte menggunakan form-urlencoded
      body: new URLSearchParams({
        target: ADMIN_WA,
        message: message,
      }),
    });

    const result = await response.json();
    console.log("Status Pengiriman Fonnte:", result); // Tambahkan log untuk debugging

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("WA API Error:", error);
    return NextResponse.json({ error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
