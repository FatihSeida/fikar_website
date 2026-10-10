import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLoader from "@/components/AppLoader";
import JourneyNavigator from "@/components/JourneyNavigator";
import Home from "@/pages/Home";
import { catatKunjungan } from "@/lib/analytics";
import { GerbangAudit, GerbangRilis } from "@/components/SegeraHadir";

const NoteDetail = lazy(() => import("@/pages/NoteDetail"));
const TentangPage = lazy(() => import("@/pages/TentangPage"));
const HmiEvidencePage = lazy(() => import("@/pages/HmiEvidencePage"));
const GalleryPage = lazy(() => import("@/pages/GalleryPage"));
const NotesPage = lazy(() => import("@/pages/NotesPage"));
const IndikatorPage = lazy(() => import("@/pages/IndikatorPage"));
const IndikatorDetailPage = lazy(() => import("@/pages/IndikatorDetailPage"));
const KuisPage = lazy(() => import("@/pages/KuisPage"));
const IkutPage = lazy(() => import("@/pages/IkutPage"));
const SeriesPage = lazy(() => import("@/pages/SeriesPage"));
const SeriDetailPage = lazy(() => import("@/pages/SeriDetailPage"));
const KursiKetuaPage = lazy(() => import("@/pages/KursiKetuaPage"));
const KepemimpinanPage = lazy(() => import("@/pages/KepemimpinanPage"));
const BangunHmiPage = lazy(() => import("@/pages/BangunHmiPage"));
const MaturityCabangPage = lazy(() => import("@/pages/MaturityCabangPage"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span />
      <p>Menyiapkan halaman</p>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    catatKunjungan(location);
  }, [location]);
  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catatan/:slug" component={NoteDetail} />
          <Route path="/hmi-evidence" component={HmiEvidencePage} />
          <Route path="/galeri" component={GalleryPage} />
          <Route path="/pemikiran"><Redirect to="/hmi-evidence" /></Route>
          <Route path="/pemikiran-ide"><Redirect to="/hmi-evidence" /></Route>
          <Route path="/catatan" component={NotesPage} />
          <Route path="/tentang" component={TentangPage} />
          <Route path="/indikator/:nomor" component={IndikatorDetailPage} />
          <Route path="/indikator" component={IndikatorPage} />
          <Route path="/kuis">{() => <GerbangAudit halaman={KuisPage} />}</Route>
          <Route path="/ikut">{() => <GerbangAudit halaman={IkutPage} />}</Route>
          <Route path="/kepemimpinan">
            {() => <GerbangRilis fitur="kursi-ketua" halaman={KepemimpinanPage} judul="Ruang Kepemimpinan" uraian="Latihan memimpin untuk ketum dan pengurus komisariat serta cabang. Jalani satu hari dari kursi ketua umum, lalu ukur seberapa matang cabangmu bekerja." />}
          </Route>
          <Route path="/kursi-ketum">
            {() => <GerbangRilis fitur="kursi-ketua" halaman={KursiKetuaPage} judul="Sehari di Kursi Ketum" uraian="Satu hari sebagai ketua umum dalam 15 situasi organisasi. Pilih tindakan yang paling mungkin kamu lakukan, lalu lihat potret cara memimpinmu dan tiga langkah untuk dicoba bersama pengurus." />}
          </Route>
          <Route path="/bangun-hmi">
            {() => <GerbangRilis fitur="bangun-hmi" halaman={BangunHmiPage} judul="Bangun HMI Bersama" uraian="HMI digambarkan sebagai bangunan. Nilai kondisi setiap bagiannya, pilih tiga yang paling mendesak, lalu sampaikan masukanmu untuk PB." />}
          </Route>
          <Route path="/maturity-cabang">
            {() => <GerbangRilis fitur="maturity-cabang" halaman={MaturityCabangPage} judul="Maturity Level Cabang" uraian="Komisariat sudah mengaudit dirinya. Sekarang giliran cabang: nilai enam dimensi kerja cabang, pilih yang ingin dinaikkan, dan unduh panduan serta templatnya." />}
          </Route>
          <Route path="/series/:slug" component={SeriDetailPage} />
          <Route path="/series">
            {() => <GerbangRilis fitur="series-1" sejakH2 halaman={SeriesPage} judul="Series HMI Evidence" uraian="Empat cerita tentang arah HMI: dari kader yang melangkah ke dunia, ingatan organisasi, suara pemuda, sampai bersama membangun HMI." />}
          </Route>
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      {!location.startsWith("/admin") && <JourneyNavigator location={location} />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLoader />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
