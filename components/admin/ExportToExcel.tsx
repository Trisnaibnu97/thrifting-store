"use client";

import React from "react";
import { Download } from "lucide-react";

interface Order {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface ExportToExcelProps {
  data: Order[];
}

export default function ExportToExcel({ data }: ExportToExcelProps) {
  const exportToCSV = () => {
    // Define headers
    const headers = [
      "Order ID",
      "Tanggal",
      "Nama Pelanggan",
      "Email",
      "Alamat",
      "Total Belanja",
      "Status"
    ];

    // Format data rows
    const rows = data.map((order) => {
      const date = new Date(order.created_at).toLocaleDateString("id-ID");
      return [
        order.order_id,
        date,
        // Wrap strings in quotes to handle commas within the data
        `"${order.customer_name}"`,
        `"${order.customer_email}"`,
        `"${order.customer_address.replace(/"/g, '""')}"`,
        order.total_amount,
        order.status
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_penjualan_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 bg-[#1cc88a] hover:bg-[#17a673] text-white px-4 py-2 rounded text-sm font-bold shadow-sm transition-colors"
    >
      <Download size={16} />
      Export ke Excel (CSV)
    </button>
  );
}
