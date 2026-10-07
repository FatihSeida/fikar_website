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
          <Route path="/series/:slug" component={SeriDetailPage} />
          <Route path="/series">
            {() => <GerbangRilis fitur="series-1" halaman={SeriesPage} judul="Series HMI Evidence" uraian="Empat seri tulisan Ahmad Zulfikar tentang arah kaderisasi HMI, terbit satu per satu setiap Rabu. Setiap seri bisa ditanggapi atas nama komisariat dan cabangmu." />}
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
