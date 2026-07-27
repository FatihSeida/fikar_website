import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Pemikiran from "@/components/sections/Pemikiran";
import Notes from "@/components/sections/Notes";
import Contact from "@/components/sections/Contact";
import SiteFooter from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Pemikiran />
        <Notes />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
