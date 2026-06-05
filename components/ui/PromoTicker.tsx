export default function PromoTicker() {
  return (
    <div className="w-full overflow-hidden bg-red-600 text-white py-1.5 flex items-center relative z-50">
      <div className="flex w-max animate-marquee text-[11px] md:text-xs font-black uppercase tracking-[0.2em]">
        {/* Repeat the text multiple times to ensure continuous smooth scroll */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center px-4">
            <span>🔥 FLASH SALE HARI INI: DISKON HINGGA 50% UNTUK KOLEKSI STREETWEAR</span>
            <span className="mx-8 opacity-50">•</span>
            <span>GRATIS ONGKIR SELURUH INDONESIA KHUSUS PEMBELIAN DI ATAS RP 500.000</span>
            <span className="mx-8 opacity-50">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
