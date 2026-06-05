import { NextResponse } from "next/server";

const RAJAONGKIR_KEY = process.env.RAJAONGKIR_API_KEY!;
const BASE_URL = "https://rajaongkir.komerce.id/api/v1";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";

    if (!search.trim()) {
      return NextResponse.json({ destinations: [] });
    }

    const res = await fetch(
      `${BASE_URL}/destination/domestic-destination?search=${encodeURIComponent(search)}&limit=10&offset=0`,
      { headers: { key: RAJAONGKIR_KEY } }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("RajaOngkir API Error:", data);
      throw new Error(data.message || data.error || `API Error: ${JSON.stringify(data)}`);
    }

    // Response: { data: [{ id, label, district_id, subdistrict_id, ... }] }
    const destinations = (data.data ?? []).map((d: {
      id: number;
      label: string;
      [key: string]: unknown;
    }) => {
      // Log field pertama untuk debug
      if (data.data?.indexOf(d) === 0) {
        console.log("Destination object sample:", JSON.stringify(d));
      }
      return {
        id: d.id,
        label: d.label,
        // Kirim semua field ID yang mungkin dipakai
        district_id: (d.district_id as number) ?? null,
        subdistrict_id: (d.subdistrict_id as number) ?? null,
      };
    });

    return NextResponse.json({ destinations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
