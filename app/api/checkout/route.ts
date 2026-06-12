import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Product, getFinalPrice } from "@/types/product";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    if (!serverKey || !clientKey) {
      return NextResponse.json({ error: "Konfigurasi Midtrans belum lengkap di .env.local" }, { status: 500 });
    }

    const body = await req.json() as {
      items: Product[];
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      customerAddress?: string;
      shipping?: {
        courier: string;
        service: string;
        cost: number;
        cityName?: string;
      };
    };

    const { items, customerName, customerEmail, customerPhone, customerAddress, shipping } = body;

    // Validasi
    if (!items?.length) return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    if (!customerName?.trim() || !customerEmail?.trim()) return NextResponse.json({ error: "Nama dan email wajib diisi" }, { status: 400 });

    const supabase = await createClient();
    const orderId = `RAIN-${Date.now()}`;

    const subtotal = items.reduce((acc, item) => acc + getFinalPrice(item), 0);
    const shippingCost = shipping?.cost || 0;
    const serverTotal = subtotal + shippingCost;

    const itemDetails = items.map((item) => ({
      id: item.id,
      name: item.name.substring(0, 50),
      price: getFinalPrice(item),
      quantity: 1,
    }));

    if (shippingCost > 0) {
      itemDetails.push({
        id: "SHIPPING",
        name: `Ongkir ${shipping?.courier?.toUpperCase() || ""} ${shipping?.service || ""}`.substring(0, 50),
        price: shippingCost,
        quantity: 1,
      });
    }

    // Panggil API Midtrans
    let snap = new midtransClient.Snap({
      isProduction: isProduction,
      serverKey: serverKey,
      clientKey: clientKey
    });

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: serverTotal
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customerName.split(" ")[0],
        last_name: customerName.split(" ").slice(1).join(" ") || "",
        email: customerEmail,
        phone: customerPhone || "08111111111",
        shipping_address: {
          first_name: customerName.split(" ")[0],
          last_name: customerName.split(" ").slice(1).join(" ") || "",
          phone: customerPhone || "08111111111",
          address: customerAddress || "-",
          city: shipping?.cityName || "Bogor",
          postal_code: "16111",
          country_code: "IDN"
        }
      }
    };

    const transaction = await snap.createTransaction(parameter);

    // Simpan ke Database
    const { error: dbError } = await supabase.from("orders").insert({
      order_id: orderId,
      items: items,
      total_amount: serverTotal,
      shipping_cost: shippingCost,
      shipping_courier: shipping ? `${shipping.courier} - ${shipping.service}` : "-",
      shipping_city: shipping?.cityName || "-",
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      customer_address: customerAddress || "-",
      status: "pending",
      reference: transaction.token, // Simpan reference/token Midtrans
    });

    if (dbError) {
      console.error("DATABASE ERROR:", dbError.message);
      return NextResponse.json({ error: `Gagal simpan database: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      paymentUrl: transaction.redirect_url, 
      token: transaction.token,
      orderId: orderId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("CRASH PADA API CHECKOUT MIDTRANS:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
