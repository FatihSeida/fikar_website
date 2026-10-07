import { polaIstilah } from "@/lib/istilah";

/** Memiringkan istilah bahasa Inggris di dalam kalimat berbahasa Indonesia. */
export default function TeksIstilah({ children }: { children: string }) {
  return (
    <>
      {children.split(polaIstilah).map((bagian, index) => (index % 2 === 1 ? <em key={index}>{bagian}</em> : bagian))}
    </>
  );
}
