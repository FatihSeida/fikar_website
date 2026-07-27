import { Link } from "wouter";
import PaperGrain from "@/components/PaperGrain";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6">
      <PaperGrain />
      <div className="max-w-md text-center">
        <span className="eyebrow mb-6 block">404</span>

        <h1 className="mb-6 font-serif text-3xl text-foreground md:text-4xl">
          Halaman tidak ditemukan
        </h1>

        <p className="mb-10 text-base text-muted-foreground">
          Halaman yang Anda cari tidak ada. Mungkin sudah dipindahkan atau dihapus.
        </p>

        <Link
          href="/"
          className="inline-flex items-center border border-foreground px-8 py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors duration-500 hover:bg-foreground hover:text-background"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
