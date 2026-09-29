import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link2, X } from "lucide-react";
import TeksIstilah from "@/components/TeksIstilah";
import { pilarStrategis } from "@/lib/program";
import { misi, visi } from "@/lib/site";
import "@/styles/evidence.css";

function SalinTautanProgram({ nomor }: { nomor: string }) {
  const [tersalin, setTersalin] = useState(false);
  const salin = async () => {
    const tautan = `${window.location.origin}/hmi-evidence#program-${nomor}`;
    try {
      await navigator.clipboard.writeText(tautan);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 1800);
    } catch {
      window.prompt("Salin tautan program ini:", tautan);
    }
  };
  return (
    <button type="button" className="program-link" onClick={salin} aria-label={`Salin tautan Program ${nomor}`}>
      <Link2 size={13} /> {tersalin ? "Tautan tersalin" : `Tautan program ${nomor}`}
    </button>
  );
}

interface VisiMisiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target?: string;
}

export default function VisiMisiDialog({ open, onOpenChange, target }: VisiMisiDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      if (target && /^(?:visi-misi|pilar-\d{2}|program-\d{2})$/.test(target)) {
        const element = contentRef.current?.querySelector<HTMLElement>(`#${target}`);
        element?.querySelector("details")?.setAttribute("open", "");
        element?.scrollIntoView({ block: "start", behavior: "instant" });
      } else {
        contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
      }
    }, 60);
    return () => window.clearTimeout(timer);
  }, [open, target]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="visi-dialog-overlay" />
        <DialogPrimitive.Content ref={contentRef} className="visi-dialog-content" aria-describedby="visi-dialog-deskripsi">
          <DialogPrimitive.Description id="visi-dialog-deskripsi" className="sr-only">
            Visi, enam misi, enam pilar, dan dua puluh program strategis Ahmad Zulfikar.
          </DialogPrimitive.Description>
          <DialogPrimitive.Close className="visi-dialog-close" aria-label="Tutup visi, misi, dan program"><X size={22} /></DialogPrimitive.Close>
          <section className="evidence-program" id="visi-misi">
            <div className="program-inner">
              <p className="story-eyebrow">Gagasan Ahmad Zulfikar</p>
              <DialogPrimitive.Title asChild>
                <h2>Visi, Misi, dan <em>Program Strategis</em></h2>
              </DialogPrimitive.Title>
              <figure className="program-vision">
                <figcaption>Visi</figcaption>
                <blockquote>“{visi}”</blockquote>
              </figure>

              <h2>Enam Misi</h2>
              <ol className="program-missions">
                {misi.map((item, index) => (
                  <li key={item}><span>0{index + 1}</span><p><TeksIstilah>{item}</TeksIstilah></p></li>
                ))}
              </ol>

              <div className="basis-divider" />
              <p className="story-eyebrow">Pilar dan Program Strategis</p>
              <h2>Enam pilar, <em>dua puluh program strategis.</em></h2>
              <p className="basis-lede">Setiap pilar diturunkan dari satu misi. Tiga belas program awal diperkuat dengan tujuh rancangan baru yang menautkan riset, pengabdian, profesi, media, sejarah, dan jejaring global.</p>
              <nav className="program-jump" aria-label="Pilih pilar program">
                {pilarStrategis.map((pilar) => (
                  <button key={pilar.nomor} type="button" onClick={() => contentRef.current?.querySelector<HTMLElement>(`#pilar-${pilar.nomor}`)?.scrollIntoView({ block: "start", behavior: "smooth" })}>
                    <span>{pilar.nomor}</span>{pilar.judul}
                  </button>
                ))}
              </nav>
              <div className="program-pillars">
                {pilarStrategis.map((pilar) => (
                  <article key={pilar.nomor} id={`pilar-${pilar.nomor}`} className="program-pillar">
                    <div className="pillar-head">
                      <span>Pilar {pilar.nomor} · Turunan Misi {pilar.nomor}</span>
                      <h3>{pilar.judul}</h3>
                      <p><TeksIstilah>{pilar.uraian}</TeksIstilah></p>
                      <p className="pillar-answers"><em>Menjawab</em>{pilar.menjawab.join(" · ")}</p>
                    </div>
                    <ol className="pillar-programs">
                      {pilar.program.map((program) => (
                        <li key={program.nomor} id={`program-${program.nomor}`}>
                          <details className="program-entry">
                            <summary><span>{program.nomor}</span><h4>{program.judul}</h4><span className="program-entry-toggle" aria-hidden="true">+</span></summary>
                            <div className="program-entry-body">
                            <SalinTautanProgram nomor={program.nomor} />
                            {program.urgensi && <div className="program-detail"><h5>Latar belakang & urgensi</h5><p>{program.urgensi}</p></div>}
                            <div className="program-detail"><h5>Gagasan program</h5><p><TeksIstilah>{program.deskripsi}</TeksIstilah></p></div>
                            <div className="program-detail"><h5>Arah dan manfaat</h5><p>{program.tujuan}</p></div>
                            {program.fokus && <div className="program-detail"><h5>Fokus dalam pilar</h5><ul>{program.fokus.map((item) => <li key={item}>{item}</li>)}</ul></div>}
                            {program.implementasi && <div className="program-detail"><h5>Rencana pengembangan</h5><p>{program.implementasi}</p></div>}
                            <div className="program-detail"><h5>Hasil yang dituju</h5><ul>{program.hasil.map((item) => <li key={item}>{item}</li>)}</ul></div>
                            </div>
                          </details>
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
              <p className="basis-note"><strong>Cara menjalankan.</strong> Setiap program berjalan melalui lima langkah bertahap: kenali, rancang, uji coba, perluas, dan bakukan. Program yang belum menunjukkan manfaat diperbaiki lebih dulu sebelum diperluas ke seluruh cabang.</p>
            </div>
          </section>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
