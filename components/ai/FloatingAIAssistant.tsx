"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, ArrowRight, Loader2, Search, Camera, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]);
    
    // Simulasi efek ngetik AI
    setAiMessage("Menganalisis gaya yang kamu inginkan...");

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query })
      });
      
      const data = await res.json();
      
      setTimeout(() => {
        setResults(data.products || []);
        setAiMessage(data.message || "Ini beberapa rekomendasi yang cocok untukmu!");
        setLoading(false);
      }, 1500); // Fake delay for dramatic AI effect
      
    } catch (err) {
      setAiMessage("Duh, AI-nya lagi pusing. Coba lagi nanti ya.");
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setLoading(true);
    setHasSearched(true);
    setResults([]);
    setAiMessage("Memindai gambar dengan AI Vision...");
    
    // Simulate image recognition
    setTimeout(() => {
      setAiMessage(`Gambar terdeteksi mirip gaya "Vintage Casual". Sedang mencari di katalog...`);
      setTimeout(async () => {
        try {
          const res = await fetch("/api/ai/assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: "baju retro vintage casual" })
          });
          const data = await res.json();
          setResults(data.products || []);
          setAiMessage("Ini item yang mirip dengan foto referensimu!");
        } catch (e) {
          setAiMessage("Gagal menemukan item yang mirip.");
        } finally {
          setLoading(false);
          setIsUploading(false);
        }
      }, 1500);
    }, 2000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-5 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ${isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"}`}
      >
        <Sparkles size={20} className="animate-pulse" />
        <span className="text-sm font-black uppercase tracking-widest hidden sm:block">Ask AI</span>
      </button>

      {/* Fullscreen Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-all duration-500 flex flex-col ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="container mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col max-w-4xl relative h-full">
          {/* Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-4 md:right-6 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full bg-zinc-100 dark:bg-zinc-900 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="pt-16 pb-8 md:pt-24 md:pb-12 text-center shrink-0">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white mb-6">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4">
              Personal AI Shopper
            </h2>
            <p className="text-sm md:text-base text-zinc-500 font-medium max-w-lg mx-auto">
              Ceritakan outfit seperti apa yang sedang kamu cari. AI kami akan memindai seluruh katalog untuk menemukan gaya yang sempurna.
            </p>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSearch} className="relative w-full shrink-0 z-20 flex items-center">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title="Cari dengan foto"
            >
              <Camera size={28} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari outfit untuk..."
              className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white pl-12 pr-16 py-6 text-xl md:text-3xl font-bold text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 outline-none transition-colors"
            />
            <button 
              type="submit"
              disabled={loading || (!query.trim() && !isUploading)}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 disabled:opacity-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
            </button>
          </form>

          {/* Quick Prompts (Only show if not searched) */}
          {!hasSearched && (
            <div className="flex flex-wrap gap-2 mt-8">
              {["Outfit nongkrong malam minggu", "Jaket tebal untuk cuaca dingin", "Gaya streetwear jepang", "Baju santai budget under 200rb"].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setQuery(prompt); setHasSearched(true); handleSearch(new Event('submit') as any); }}
                  className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Results Area */}
          <div className="flex-1 mt-8 overflow-y-auto pb-20 no-scrollbar">
            {hasSearched && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-3 mb-8">
                  <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-2xl rounded-tl-none text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                    {aiMessage}
                  </div>
                </div>

                {!loading && results.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/product/${product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="group relative flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                          {product.image_urls?.[0] ? (
                            <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400"><Search size={24} /></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">{product.name}</h3>
                          <p className="text-xs font-black text-zinc-500 dark:text-zinc-400 mt-1">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!loading && results.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-zinc-500">Sayang sekali, aku belum menemukan baju yang pas dengan deskripsi itu.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
