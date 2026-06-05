import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Product, getFinalPrice } from "@/types/product";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim() || "";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim() || "";

    if (!serverKey) {
      return NextResponse.json({ error: "Konfigurasi Midtrans belum lengkap di .env.local" }, { status: 500 });
    }

    // Pindahkan inisialisasi ke dalam fungsi agar environment variable selalu terbaca dengan benar
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: serverKey,
      clientKey: clientKey,
    });

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
      price: getFinalPrice(item),
      quantity: 1,
      name: item.name.substring(0, 50),
    }));

    if (shippingCost > 0) {
      itemDetails.push({
        id: `SHIPPING-${shipping?.courier?.toUpperCase() || "STD"}`,
        price: shippingCost,
        quantity: 1,
        name: `Ongkir ${shipping?.courier?.toUpperCase() || ""} ${shipping?.service || ""}`.substring(0, 50),
      });
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: serverTotal,
      },
      customer_details: {
        first_name: customerName.split(" ")[0],
        last_name: customerName.split(" ").slice(1).join(" ") || "",
        email: customerEmail,
        phone: customerPhone || "",
        shipping_address: {
          first_name: customerName.split(" ")[0],
          last_name: customerName.split(" ").slice(1).join(" ") || "",
          phone: customerPhone || "",
          address: customerAddress || "-",
          city: "Bogor", // Default city placeholder
          country_code: "IDN"
        }
      },
      item_details: itemDetails,
    };

    const transaction = await snap.createTransaction(parameter);

    if (!transaction || !transaction.redirect_url) {
      return NextResponse.json({ error: "Gagal membuat transaksi Midtrans" }, { status: 500 });
    }

    const { error: dbError } = await supabase.from("orders").insert({
      order_id: orderId,
      items: items, // Kolom di database bernama 'items', bukan 'product_ids'
      total_amount: serverTotal,
      shipping_cost: shippingCost,
      shipping_courier: shipping ? `${shipping.courier} - ${shipping.service}` : "-",
      shipping_city: shipping?.cityName || "-",
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      customer_address: customerAddress || "-",
      status: "pending",
      reference: transaction.token, // Simpan token Snap Midtrans sebagai reference
    });

    if (dbError) {
      console.error("DATABASE ERROR:", dbError.message);
      return NextResponse.json({ error: `Gagal simpan database: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      paymentUrl: transaction.redirect_url, // URL untuk diarahkan ke Midtrans Snap
      orderId: orderId,
      reference: transaction.token,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("CRASH PADA API CHECKOUT MIDTRANS:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
