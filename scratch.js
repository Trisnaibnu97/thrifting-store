const RAJAONGKIR_KEY = "3OwdnMcwa01301bf905a8ed6aHukHwe6";
const BASE_URL = "https://rajaongkir.komerce.id/api/v1";
const search = "Cibinong";

async function test() {
  const res = await fetch(
    `${BASE_URL}/destination/domestic-destination?search=${encodeURIComponent(search)}&limit=10&offset=0`,
    { headers: { key: RAJAONGKIR_KEY } }
  );
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}

test();
