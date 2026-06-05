import { NextResponse } from "next/server";

const RAJAONGKIR_KEY = process.env.RAJAONGKIR_API_KEY!;
const BASE_URL = "https://rajaongkir.komerce.id/api/v1";

export async function GET(req: Request) {
  try {
    const searchRes = await fetch(
      `${BASE_URL}/destination/domestic-destination?search=Kemang&limit=1`,
      { headers: { key: RAJAONGKIR_KEY } }
    );
    const searchData = await searchRes.json();
    
    if (!searchData.data || searchData.data.length === 0) {
      return NextResponse.json({ error: "Search failed", searchData });
    }
    
    const target = searchData.data[0];
    
    // Test 1: Using id
    const body1 = new URLSearchParams({ origin: "1496", destination: String(target.id), weight: "1000", courier: "jne" });
    const costRes1 = await fetch(`${BASE_URL}/calculate/domestic-cost`, {
      method: "POST", headers: { key: RAJAONGKIR_KEY, "Content-Type": "application/x-www-form-urlencoded" }, body: body1
    });
    
    // Test 2: Using subdistrict_id
    const body2 = new URLSearchParams({ origin: "115", destination: String(target.subdistrict_id), weight: "1000", courier: "jne" });
    const costRes2 = await fetch(`${BASE_URL}/calculate/domestic-cost`, {
      method: "POST", headers: { key: RAJAONGKIR_KEY, "Content-Type": "application/x-www-form-urlencoded" }, body: body2
    });

    return NextResponse.json({
      target,
      test1_id_endpoint_domestic: await costRes1.json(),
      test2_subdistrict_endpoint_domestic: await costRes2.json(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
