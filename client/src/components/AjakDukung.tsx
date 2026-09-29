import TombolBagikan from "@/components/TombolBagikan";
import TombolStory from "@/components/TombolStory";
import type { IsiStory } from "@/lib/story";

/**
 * Ajakan mendukung HMI Evidence dengan membagikan ke WhatsApp atau Instagram
 * Story. Dipakai di hasil kuis, sesudah kirim masalah, dan di akhir HMI Evidence.
 */
export default function AjakDukung({
  uraian,
  path,
  pesan,
  story,
  namaFile,
  gelap = false,
  className = "",
}: {
  uraian: string;
  path: string;
  pesan: string;
  story: IsiStory;
  namaFile: string;
  gelap?: boolean;
  className?: string;
}) {
  return (
    <section className={`${gelap ? "border-white/15 bg-white/[0.04] text-white" : "border-primary/25 bg-primary/[0.04]"} border p-6 md:p-7 ${className}`}>
      <p className={gelap ? "evidence-kicker" : "eyebrow"}>Dukung HMI Evidence</p>
      <h3 className="mt-3 font-serif text-2xl leading-snug">Dukung Transformasi Gerakan Organisasi Berbasis Bukti</h3>
      <p className={`mt-2 max-w-xl text-sm leading-relaxed ${gelap ? "text-white/70" : "text-muted-foreground"}`}>{uraian}</p>
      <div className="mt-5 flex flex-wrap items-start gap-3">
        <TombolBagikan path={path} pesan={pesan} gelap={gelap} />
        <TombolStory isi={story} namaFile={namaFile} />
      </div>
    </section>
  );
}
