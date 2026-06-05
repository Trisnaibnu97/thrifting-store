import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="text-sm font-black tracking-widest text-zinc-800 dark:text-zinc-200 uppercase animate-pulse">
          Sedang Memuat...
        </p>
      </div>
    </div>
  );
}
