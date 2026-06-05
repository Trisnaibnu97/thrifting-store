"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Truck, Loader2 } from "lucide-react";

interface Destination {
  id: number;
  label: string;
  district_id: number | null;
  subdistrict_id: number | null;
}

interface ShippingService {
  courierName: string;
  courierCode: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface SelectedShipping {
  courier: string;
  courierName: string;
  service: string;
  cost: number;
  etd: string;
  cityName: string;
  districtId: string;
}

interface ShippingFormProps {
  onShippingChange: (shipping: SelectedShipping | null) => void;
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function ShippingForm({ onShippingChange }: ShippingFormProps) {
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [services, setServices] = useState<ShippingService[]>([]);
  const [selectedService, setSelectedService] = useState<ShippingService | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingCost, setLoadingCost] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown klik luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounce search
  useEffect(() => {
    if (!search.trim() || selectedDest) {
      setDestinations([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoadingSearch(true);
      setErrorMsg("");
      try {
        const res = await fetch(`/api/shipping/cities?search=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setDestinations(data.destinations ?? []);
        setShowDropdown(true);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Gagal cari destinasi");
      } finally {
        setLoadingSearch(false);
      }
    }, 400);
  }, [search, selectedDest]);

  const handleSelectDest = async (dest: Destination) => {
    setSelectedDest(dest);
    setSearch(dest.label);
    setShowDropdown(false);
    setDestinations([]);
    setServices([]);
    setSelectedService(null);
    onShippingChange(null);
    setErrorMsg("");

    // Langsung cek ongkir semua kurir
    setLoadingCost(true);
    try {
      const res = await fetch("/api/shipping/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: String(dest.id),
          destinationDistrictId: dest.district_id ? String(dest.district_id) : String(dest.id),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.services?.length) throw new Error("Tidak ada layanan tersedia untuk rute ini");
      setServices(data.services);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal cek ongkir");
    } finally {
      setLoadingCost(false);
    }
  };

  const handleSelectService = (svc: ShippingService) => {
    setSelectedService(svc);
    if (selectedDest) {
      onShippingChange({
        courier: svc.courierCode,
        courierName: svc.courierName,
        service: svc.service,
        cost: svc.cost,
        etd: svc.etd,
        cityName: selectedDest.label,
        districtId: String(selectedDest.id),
      });
    }
  };

  const inputClass = "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors";

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 space-y-5">
      <h2 className="font-black text-zinc-950 uppercase tracking-widest text-xs flex items-center gap-2">
        <Truck size={14} className="text-orange-500" /> Pengiriman
      </h2>

      {/* Search kota tujuan */}
      <div className="space-y-1.5 relative" ref={wrapperRef}>
        <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
          <MapPin size={11} /> Kota / Kecamatan Tujuan <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Ketik nama kota atau kecamatan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedDest(null);
              setServices([]);
              setSelectedService(null);
              onShippingChange(null);
            }}
            onFocus={() => destinations.length > 0 && setShowDropdown(true)}
            className={inputClass}
          />
          {loadingSearch && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-400" />
          )}
        </div>

        {/* Dropdown hasil search */}
        {showDropdown && destinations.length > 0 && (
          <div className="absolute z-30 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleSelectDest(dest)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
              >
                <span className="font-semibold text-zinc-900">{dest.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading ongkir */}
      {loadingCost && (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
          <Loader2 size={14} className="animate-spin" />
          <span>Mengecek ongkir semua kurir...</span>
        </div>
      )}

      {/* Error */}
      {errorMsg && !loadingCost && (
        <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
      )}

      {/* Pilih layanan */}
      {services.length > 0 && !loadingCost && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-700">
            Pilih Layanan <span className="text-red-500">*</span>
            <span className="text-zinc-400 font-normal ml-1">({services.length} tersedia)</span>
          </label>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {services.map((svc, i) => (
              <label
                key={i}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                  selectedService?.courierCode === svc.courierCode && selectedService?.service === svc.service
                    ? "border-zinc-950 bg-zinc-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingService"
                    checked={selectedService?.courierCode === svc.courierCode && selectedService?.service === svc.service}
                    onChange={() => handleSelectService(svc)}
                    className="accent-zinc-950 shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      {svc.courierName} {svc.service}
                    </p>
                    <p className="text-xs text-zinc-400">{svc.description} · Est. {svc.etd} hari</p>
                  </div>
                </div>
                <span className="text-sm font-black text-zinc-900 shrink-0 ml-4">
                  {formatRupiah(svc.cost)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
