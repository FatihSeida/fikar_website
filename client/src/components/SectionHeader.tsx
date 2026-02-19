interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, centered }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {subtitle && (
        <span className="block font-mono text-xs text-primary tracking-widest mb-4 uppercase">
          {subtitle}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
        {title}
      </h2>
      <div className={`h-1 w-20 bg-primary mt-6 ${centered ? "mx-auto" : ""}`} />
    </div>
  );
}
