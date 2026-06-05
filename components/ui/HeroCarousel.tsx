"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
}

export default function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, isHovered]);

  if (!banners || banners.length === 0) return null;

  return (
    <div 
      className="relative w-full aspect-[4/5] md:aspect-[21/9] lg:aspect-[24/9] overflow-hidden bg-zinc-900 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
            }`}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className={`object-cover transition-transform duration-[10000ms] ease-linear ${isActive ? "scale-110" : "scale-100"}`}
                priority={index === 0}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950/90 via-zinc-950/50 to-transparent flex flex-col justify-end md:justify-center p-8 md:p-16 lg:p-24" />
            </div>

            {/* Teks dengan efek kemunculan dramatis */}
            <div className={`absolute bottom-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-6 md:left-16 lg:left-24 max-w-2xl transition-all duration-700 delay-200 ${isActive ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
              <h2 className="text-white text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase leading-none drop-shadow-2xl">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-white/90 text-lg md:text-xl font-bold max-w-lg mb-8 uppercase tracking-widest drop-shadow-lg border-l-4 border-red-500 pl-4">
                  {banner.subtitle}
                </p>
              )}
              {banner.link_url ? (
                <Link 
                  href={banner.link_url} 
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-white bg-red-600 hover:bg-white hover:text-zinc-900 transition-all uppercase tracking-widest shadow-xl shadow-red-600/30 hover:shadow-white/30 hover:scale-105 active:scale-95"
                >
                  Klaim Promo &rarr;
                </Link>
              ) : (
                <div className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-white bg-red-600 hover:bg-white hover:text-zinc-900 transition-all uppercase tracking-widest shadow-xl shadow-red-600/30 hover:shadow-white/30 hover:scale-105 active:scale-95">
                  Jelajahi Sekarang
                </div>
              )}
            </div>

            {/* Right side collage - Polaroid effect (only visible on large screens) */}
            <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 right-24 xl:right-40 w-[300px] h-[400px] transition-all duration-1000 delay-500 ${isActive ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}>
              
              {/* Polaroid 1 (Back) */}
              <div className="absolute top-10 -left-16 w-56 h-64 bg-white p-3 pb-12 -rotate-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105 hover:-rotate-6 hover:z-30 group/p1">
                <div className="relative w-full h-full bg-zinc-200 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop" 
                    alt="Vintage Tee" 
                    className="w-full h-full object-cover filter grayscale group-hover/p1:grayscale-0 transition-all duration-500" 
                  />
                </div>
              </div>
              
              {/* Polaroid 2 (Front) */}
              <div className="absolute top-0 right-0 w-64 h-72 bg-white p-3 pb-12 rotate-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-110 hover:rotate-2 hover:z-30 z-20 group/p2">
                <div className="relative w-full h-full bg-zinc-200 overflow-hidden">
                  <img 
                    src={banner.image_url} 
                    alt="Current Banner Thumbnail" 
                    className="w-full h-full object-cover group-hover/p2:scale-110 transition-all duration-700" 
                  />
                </div>
                {/* Vintage Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm -rotate-3 border border-white/20 shadow-sm" style={{mixBlendMode: 'overlay'}}></div>
              </div>

              {/* Decorative scribble / text */}
              <div className="absolute -bottom-10 right-10 -rotate-6 font-mono text-white/50 text-xs tracking-[0.2em]">
                {banner.id.slice(0, 8).toUpperCase()} // ARCHIVE
              </div>

            </div>
          </div>
        );
      })}

      {/* Navigation Arrows: Muncul dengan efek slide dari samping saat hover */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute top-1/2 -translate-y-1/2 left-4 z-30 bg-white/10 hover:bg-white text-white hover:text-zinc-900 p-3 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute top-1/2 -translate-y-1/2 right-4 z-30 bg-white/10 hover:bg-white text-white hover:text-zinc-900 p-3 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Progress Bar indikator yang memanjang */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-6 md:left-16 lg:left-24 z-30 flex space-x-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === currentIndex ? "w-16 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "w-4 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
