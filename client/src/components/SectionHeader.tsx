interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Judul section. Garis tipis clay menggantikan balok tebal merah pada
 * versi lama, sebagai aksen.
 */
export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-16">
      {subtitle && <span className="eyebrow mb-5 block">{subtitle}</span>}
      <h2 className="font-serif text-3xl text-foreground md:text-4xl">{title}</h2>
      <div className="mt-7 h-px w-16 bg-accent" />
    </div>
  );
}
