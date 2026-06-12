import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const API_KEY = process.env.DUITKU_API_KEY?.trim() || "";
    
    // Duitku callback pakai x-www-form-urlencoded
    const formData = await req.formData();

    const merchantCode = formData.get("merchantCode") as string;
    const amount = formData.get("amount") as string;
    const merchantOrderId = formData.get("merchantOrderId") as string;
    const resultCode = formData.get("resultCode") as string;
    const reference = formData.get("reference") as string;
    const signature = formData.get("signature") as string;

    if (!merchantCode || !amount || !merchantOrderId || !signature) {
      return NextResponse.json({ message: "Bad Parameter" }, { status: 400 });
    }

    // Verifikasi signature: MD5(merchantCode + amount + merchantOrderId + apiKey)
    const expectedSignature = crypto
      .createHash("md5")
      .update(`${merchantCode}${amount}${merchantOrderId}${API_KEY}`)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("DUITKU WEBHOOK: Invalid Signature");
      return NextResponse.json({ message: "Bad Signature" }, { status: 403 });
    }

    const supabase = await createClient();

    // resultCode: "00" = sukses
    if (resultCode === "00") {
      const { data: order } = await supabase
        .from("orders")
        .select("items")
        .eq("order_id", merchantOrderId)
        .single();

      if (order && order.items) {
        // Update produk jadi sold
        const productIds = order.items.map((item: any) => item.id);
        
        await supabase
          .from("products")
          .update({ status: "sold" })
          .in("id", productIds);
      }

      // Update status order
      await supabase
        .from("orders")
        .update({ status: "settlement", reference })
        .eq("order_id", merchantOrderId);
        
      console.log(`Pesanan ${merchantOrderId} berhasil dibayar via Duitku!`);
    } else {
      // Pembayaran gagal/expired
      await supabase
        .from("orders")
        .update({ status: "cancel" })
        .eq("order_id", merchantOrderId);
        
      console.log(`Pesanan ${merchantOrderId} dibatalkan (Code: ${resultCode})`);
    }

    return NextResponse.json({ message: "OK" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("DUITKU WEBHOOK ERROR:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
