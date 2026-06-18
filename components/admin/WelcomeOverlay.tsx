"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function WelcomeOverlay({ userName }: { userName: string }) {
  const [show, setShow] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Cek apakah sudah pernah muncul di sesi ini
    const hasSeenWelcome = sessionStorage.getItem("admin_welcome_shown");
    
    if (hasSeenWelcome) {
      setShow(false);
      return;
    }

    setShow(true);

    // Hilangkan setelah 2.5 detik
    const timer = setTimeout(() => {
      setAnimateOut(true);
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("admin_welcome_shown", "true");
      }, 500); // durasi animasi fade-out
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#131921] transition-opacity duration-500 ${animateOut ? "opacity-0" : "opacity-100"}`}>
      <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative mb-6">
          {/* Efek glow */}
          <div className="absolute inset-0 bg-[#ff9900] blur-[30px] opacity-40 animate-pulse rounded-full"></div>
          
          <div className="h-24 w-24 bg-[#232f3e] border border-[#ff9900]/50 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl transform hover:scale-105 transition-transform">
            <ShieldCheck size={48} className="text-[#ff9900]" strokeWidth={2} />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
          Selamat Datang, <span className="text-[#ff9900]">{userName}</span>
        </h1>
        
        <p className="text-[#eaeded]/70 font-medium text-sm flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin text-[#ff9900]" /> 
          Mempersiapkan Workspace Anda...
        </p>

        {/* Progress bar tipis */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-[#ff9900] animate-[shimmer_2s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left', animationName: 'progress' }}></div>
        </div>

        <style jsx>{`
          @keyframes progress {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(0.7); }
            100% { transform: scaleX(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
