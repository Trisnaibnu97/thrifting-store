import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    // 1. Verifikasi signature dari Midtrans
    const hash = crypto
      .createHash("sha512")
      .update(
        `${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`
      )
      .digest("hex");

    if (hash !== body.signature_key) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    const transactionStatus: string = body.transaction_status;
    const orderId: string = body.order_id;

    // 2. Pembayaran berhasil
    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      const { data: order } = await supabase
        .from("orders")
        .select("items")
        .eq("order_id", orderId)
        .single();

      if (order && order.items) {
        const itemIds = order.items.map((item: any) => item.id);
        
        await supabase
          .from("products")
          .update({ status: "sold" })
          .in("id", itemIds);

        await supabase
          .from("orders")
          .update({ status: "settlement" })
          .eq("order_id", orderId);
      }
    }

    // 3. Pembayaran expire atau dibatalkan — cleanup order
    if (transactionStatus === "expire" || transactionStatus === "cancel") {
      await supabase
        .from("orders")
        .update({ status: transactionStatus })
        .eq("order_id", orderId);
    }

    return NextResponse.json({ message: "OK" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
