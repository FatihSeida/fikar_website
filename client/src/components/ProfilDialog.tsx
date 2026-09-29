import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ringkasanProfil, ruangPengabdian } from "@/lib/riwayat";
import { site } from "@/lib/site";

export default function ProfilDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[350] bg-black/80 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed inset-x-4 bottom-[4dvh] top-[4dvh] z-[351] mx-auto max-w-4xl overflow-y-auto overscroll-contain border border-[hsl(var(--gold))]/40 bg-[hsl(var(--evidence))] text-white shadow-2xl outline-none md:bottom-[7vh] md:top-[7vh]">
          <div className="sticky top-0 z-10 flex justify-end bg-[hsl(var(--evidence))]/95 p-3 backdrop-blur">
            <DialogPrimitive.Close className="grid h-11 w-11 place-items-center border border-white/30 transition-colors hover:border-[hsl(var(--gold))]" aria-label="Tutup profil Ahmad Zulfikar">
              <X size={20} />
            </DialogPrimitive.Close>
          </div>
          <div className="px-6 pb-10 md:px-10 md:pb-14">
            <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--gold))]">Kenali Zulfikar</p>
                <DialogPrimitive.Title className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{site.nama}</DialogPrimitive.Title>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/60">{site.kandidat}</p>
                <DialogPrimitive.Description className="mt-8 text-base leading-relaxed text-white/80">
                  Tumbuh melalui kaderisasi HMI, pendidikan hukum, dan ruang advokasi. Perjalanan itu menumbuhkan keyakinan bahwa organisasi perlu mengenali kadernya dan membaca kenyataan sebelum mengambil keputusan.
                </DialogPrimitive.Description>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/70">
                  {ringkasanProfil.map((paragraf) => <p key={paragraf}>{paragraf}</p>)}
                </div>
              </div>
              <img src="/ahmad/profile-centered.webp" alt="Potret Ahmad Zulfikar" className="aspect-[4/3] w-full object-cover object-[center_25%] md:aspect-[4/5]" loading="lazy" />
            </div>
            <div className="mt-9 grid gap-4 border-t border-white/20 pt-6 md:grid-cols-3">
              {ruangPengabdian.map((ruang, index) => (
                <article key={ruang.label}>
                  <span className="font-serif text-2xl text-[hsl(var(--gold))]">0{index + 1}</span>
                  <h3 className="mt-2 font-serif text-xl">{ruang.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{ruang.uraian}</p>
                </article>
              ))}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
