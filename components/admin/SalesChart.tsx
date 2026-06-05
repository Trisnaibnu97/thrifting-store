"use client";

import { useState } from "react";
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

interface MonthlySales {
  month: string;       // "2025-01"
  monthLabel: string;  // "Jan 25"
  total: number;
  count: number;
}

interface DailySales {
  day: string;         // "2025-01-15"
  dayLabel: string;    // "15 Jan"
  total: number;
  count: number;
}

interface SalesChartProps {
  monthlyData: MonthlySales[];
  dailyDataByMonth: Record<string, DailySales[]>;
}

const formatRupiah = (val: number) => {
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)}jt`;
  if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(0)}rb`;
  return `Rp ${val}`;
};

export default function SalesChart({ monthlyData, dailyDataByMonth }: SalesChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const dailyData = selectedMonth ? dailyDataByMonth[selectedMonth] ?? [] : [];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[#5a5c69] font-bold text-lg m-0">
            {selectedMonth ? `Detail: ${monthlyData.find(m => m.month === selectedMonth)?.monthLabel}` : "Penjualan Bulanan"}
          </h2>
          <p className="text-xs text-[#858796] mt-1 m-0">
            {selectedMonth ? "Klik bar untuk kembali ke tampilan bulanan" : "Klik bar bulan untuk lihat detail harian"}
          </p>
        </div>
        {selectedMonth && (
          <button
            onClick={() => setSelectedMonth(null)}
            className="text-xs font-bold text-[#4e73df] hover:text-[#2e59d9] transition-colors"
          >
            &larr; Kembali
          </button>
        )}
      </div>

      <div className="h-[300px] w-full">
        {monthlyData.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#858796]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-[#d1d3e2]">
              <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            <p className="font-bold">Belum ada data penjualan</p>
            <p className="text-xs">Grafik akan muncul setelah ada pesanan yang lunas (Settlement).</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {selectedMonth ? (
              <BarChart data={dailyData} onClick={() => setSelectedMonth(null)}>
                <defs>
                  <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4e73df" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#4e73df" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" vertical={false} />
                <XAxis dataKey="dayLabel" stroke="#858796" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#858796" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatRupiah} width={70} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e3e6f0", borderRadius: "0.35rem", boxShadow: "0 0.15rem 1.75rem 0 rgba(58,59,69,0.15)" }}
                  labelStyle={{ color: "#5a5c69", fontWeight: "bold", marginBottom: 4 }}
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, "Total"]}
                />
                <Bar dataKey="total" fill="url(#colorDaily)" radius={[4, 4, 0, 0]} cursor="pointer" maxBarSize={40} />
              </BarChart>
            ) : (
              <BarChart
                data={monthlyData}
                onClick={(e: any) => {
                  if (e?.activePayload?.[0]) {
                    const month = (e.activePayload[0].payload as MonthlySales).month;
                    setSelectedMonth(month);
                  }
                }}
              >
                <defs>
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4e73df" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#4e73df" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" vertical={false} />
                <XAxis dataKey="monthLabel" stroke="#858796" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#858796" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatRupiah} width={70} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e3e6f0", borderRadius: "0.35rem", boxShadow: "0 0.15rem 1.75rem 0 rgba(58,59,69,0.15)" }}
                  labelStyle={{ color: "#5a5c69", fontWeight: "bold", marginBottom: 4 }}
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, "Total"]}
                />
                <Bar dataKey="total" fill="url(#colorMonthly)" radius={[4, 4, 0, 0]} cursor="pointer" maxBarSize={40} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
