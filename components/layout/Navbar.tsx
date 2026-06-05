"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";

interface NavbarProps {
  categories: string[];
}

const Navbar = ({ categories }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("customer");
  const router = useRouter();
  const cartCount = useCart((state) => state.items.length);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }

    const fetchUser = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User";
          const role = session.user.user_metadata?.role || "customer";
          const firstName = fullName.split(' ')[0];
          setUserName(firstName);
          setUserRole(role);
        }
      } catch (e) {
        console.error("Gagal load session", e);
      }
    };
    fetchUser();
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setTheme('light');
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-1">
          <span className="text-zinc-900 dark:text-zinc-100">RAIN</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-light">SECOND</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Beranda</Link>
          <Link href="/shop" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Koleksi</Link>
          <Link href="/#about" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Tentang Kami</Link>
          <Link href="/#contact" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Hubungi Kami</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/shop" className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors hidden sm:block">
            <Search size={20} />
          </Link>
          
          <button onClick={toggleTheme} className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link href={userName ? (userRole === "admin" ? "/admin" : "/profile") : "/login"} className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors hidden sm:block">
            <User size={20} />
          </Link>

          <Link href="/cart" className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-[10px] font-bold text-white dark:text-zinc-900">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <User size={24} className="text-zinc-400" />
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500">Selamat datang,</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{userName || "Guest"}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Link href="/" onClick={closeMenu} className="py-2 font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800">Beranda</Link>
            <Link href="/shop" onClick={closeMenu} className="py-2 font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800">Semua Koleksi</Link>
            <Link href="/#about" onClick={closeMenu} className="py-2 font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800">Tentang Kami</Link>
            <Link href="/#contact" onClick={closeMenu} className="py-2 font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800">Hubungi Kami</Link>
            <Link href={userName ? (userRole === "admin" ? "/admin" : "/profile") : "/login"} onClick={closeMenu} className="py-2 font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800">Akun Saya</Link>
            
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-4 mb-2">Kategori</h3>
            {categories.map((cat) => (
              <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`} onClick={closeMenu} className="py-2 text-sm text-zinc-600 dark:text-zinc-400">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;
