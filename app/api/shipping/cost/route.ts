import { NextResponse } from "next/server";

const RAJAONGKIR_KEY = process.env.RAJAONGKIR_API_KEY!;
const BASE_URL = "https://rajaongkir.komerce.id/api/v1";

// District ID Kabupaten Bogor — didapat dari search "Kabupaten Bogor"
// Akan di-resolve saat pertama kali dipakai
let ORIGIN_DISTRICT_ID: string | null = null;

async function getOriginDistrictId(): Promise<string> {
  if (ORIGIN_DISTRICT_ID) return ORIGIN_DISTRICT_ID;

  const res = await fetch(
    `${BASE_URL}/destination/domestic-destination?search=Bogor&limit=10&offset=0`,
    { headers: { key: RAJAONGKIR_KEY } }
  );
  const data = await res.json();
  console.log("Origin search full first result:", JSON.stringify(data.data?.[0]));
  console.log("All results labels:", data.data?.map((d: { label: string; id: number }) => `${d.label} (id:${d.id})`));

  // Cari Kabupaten Bogor spesifik
  const kabBogor = data.data?.find((d: { label: string }) =>
    d.label?.toUpperCase().includes("KABUPATEN BOGOR") ||
    d.label?.toUpperCase().includes("KAB. BOGOR") ||
    d.label?.toUpperCase().includes("KAB BOGOR")
  );

  const bogor = kabBogor ?? data.data?.find((d: { city_name?: string; province_name?: string; label: string }) =>
    (d.city_name?.toUpperCase().includes("BOGOR") || d.label?.toUpperCase().includes("BOGOR")) &&
    (d.province_name?.toUpperCase().includes("JAWA BARAT") || d.label?.toUpperCase().includes("JAWA BARAT"))
  );

  const first = bogor ?? data.data?.[0];
  if (!first) throw new Error(`Tidak bisa resolve origin. Response: ${JSON.stringify(data).substring(0, 200)}`);

  console.log("Origin resolved:", first.label, "| full object:", JSON.stringify(first));
  // Coba gunakan ID langsung dari Komerce (biasanya field 'id')
  const id = first.id;
  ORIGIN_DISTRICT_ID = String(id);
  console.log("Using origin ID:", ORIGIN_DISTRICT_ID);
  return ORIGIN_DISTRICT_ID;
}

// Semua kurir yang didukung V2
const ALL_COURIERS = "jne:sicepat:jnt:tiki:pos:anteraja:ninja:lion:wahana:dse:ncs:rex:rpx:sentral:star:sap:ide";

export async function POST(req: Request) {
  try {
    const { destinationDistrictId, destinationId, weight = 500 } = await req.json() as {
      destinationDistrictId: string;
      destinationId?: string;
      weight?: number;
    };

    if (!destinationDistrictId) {
      return NextResponse.json({ error: "destinationDistrictId wajib diisi" }, { status: 400 });
    }

    const originId = await getOriginDistrictId();
    // Komerce expects destination as the direct 'id' from search
    const destId = destinationId || destinationDistrictId;
    console.log("Trying cost with origin:", originId, "destination:", destId);
    
    const body = new URLSearchParams({
      origin: originId,
      destination: destId,
      weight: weight.toString(),
      courier: ALL_COURIERS,
      price: "lowest",
    });

    const res = await fetch(`${BASE_URL}/calculate/domestic-cost`, {
      method: "POST",
      headers: {
        key: RAJAONGKIR_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await res.json();
    console.log("RajaOngkir cost response:", JSON.stringify(data).substring(0, 500));

    if (!res.ok) {
      console.error("RajaOngkir Cost Error:", data);
      throw new Error(data.message || data.error || `HTTP ${res.status}: Gagal cek ongkir. Detail: ${JSON.stringify(data)}`);
    }

    // Response Komerce v1 /calculate/domestic-cost: { data: [{ name, code, service, description, cost, etd }] }
    const services = (data.data ?? []).map((s: {
      name: string;
      code: string;
      service: string;
      description: string;
      cost: number;
      etd: string;
    }) => ({
      courierName: s.name,
      courierCode: s.code,
      service: s.service,
      description: s.description,
      cost: s.cost,
      etd: s.etd,
    }));

    return NextResponse.json({ services });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
