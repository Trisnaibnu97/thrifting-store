"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-zinc-950 text-white pt-20 pb-10 border-t-8 border-red-600">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Section: Giant Typography & Testimonials */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-12">

          <div className="flex flex-col">
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none text-white">
              RAIN
              <br />
              SECOND
            </h1>
            <p className="mt-4 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
              Curated Archival & Secondhand Pieces.
            </p>
          </div>

          {/* Testimonial/Review Widget next to the text */}
          <div className="flex flex-col gap-4">

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden group/testi hover:bg-zinc-800/80 transition-all">
              <div className="flex items-center gap-1 mb-2 text-[#ff9900]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                ))}
              </div>
              <p className="text-zinc-300 text-sm font-medium leading-relaxed italic mb-4">
                "Barang thrift paling legit yang pernah gw beli. Wangi, no minus, detail 100% sesuai deskripsi! Auto langganan."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                  R
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Rangga S.</p>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden md:ml-8 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 mb-2 text-[#ff9900]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                ))}
              </div>
              <p className="text-zinc-300 text-sm font-medium leading-relaxed italic mb-4">
                "Sumpah packingnya rapi bgt kayak barang baru. Pengiriman ngebut. Bakal sering jajan di sini!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center text-xs font-bold text-white">
                  D
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Dina A.</p>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Verified Buyer</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Middle Section: Grid Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-24 border-t border-zinc-800 pt-12">

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Explore</h3>
            <Link href="/shop" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              Latest Drops <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/shop" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              Archive <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/shop" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              Brands <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Support</h3>
            <Link href="#" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              FAQ <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="#" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              Shipping / Returns <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="#" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              Terms of Service <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Socials</h3>
            <a href="#" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              Instagram <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="#" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              TikTok <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="#" className="text-sm font-bold uppercase hover:text-red-500 transition-colors flex items-center gap-1 group">
              Grailed <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Newsletter</h3>
            <p className="text-xs font-bold text-zinc-400">Akses awal ke rilis mingguan kami.</p>
            <div className="flex mt-2">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent border-b-2 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white outline-none py-2 text-xs font-black uppercase w-full transition-colors"
              />
              <button className="bg-white text-zinc-950 px-4 text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & Ticker */}
        <div className="flex flex-col items-center">
          <div className="w-full h-px bg-zinc-800 mb-8"></div>

          <div className="flex flex-col md:flex-row justify-between w-full items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              © {new Date().getFullYear()} RAINSECOND. ALL RIGHTS RESERVED.
            </p>

            <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
              <span>BOGOR</span>
              <span>—</span>
              <span>INDONESIA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;