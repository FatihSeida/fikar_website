import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-serif text-base text-foreground">{site.nama}</p>

        <div className="flex items-center gap-8">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
            data-testid="link-social-instagram"
          >
            {site.instagram.label}
          </a>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
