const istilah = /(Student Needs|Student Interest|soft skills|hard skills|evidence-based|evidence-informed|feeling|insight|follow up|Senior Course|Basic Training|Intermediate Training|Advance Training)/g;

/** Memiringkan istilah bahasa Inggris di dalam kalimat berbahasa Indonesia. */
export default function TeksIstilah({ children }: { children: string }) {
  return (
    <>
      {children.split(istilah).map((bagian, index) => (index % 2 === 1 ? <em key={index}>{bagian}</em> : bagian))}
    </>
  );
}
