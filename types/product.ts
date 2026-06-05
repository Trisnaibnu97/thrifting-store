// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  condition: string;
  image_urls: string[];
  status: 'available' | 'sold';
  category: string;
  created_at: string;
  // Diskon opsional — bisa pakai persen, nominal, atau keduanya
  discount_percent: number | null;
  discount_price: number | null;
  // Berat dalam gram (untuk kalkulasi ongkir)
  weight: number | null;
}

/** Hitung harga akhir setelah diskon */
export function getFinalPrice(product: Product): number {
  if (product.discount_price) return product.discount_price;
  if (product.discount_percent) {
    return Math.round(product.price * (1 - product.discount_percent / 100));
  }
  return product.price;
}

/** Cek apakah produk sedang diskon */
export function hasDiscount(product: Product): boolean {
  return !!(product.discount_percent || product.discount_price);
}
