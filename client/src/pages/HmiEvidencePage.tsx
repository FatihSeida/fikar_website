import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";
import { evidenceStory, storyImage } from "@/lib/evidence-story";
import "@/styles/evidence.css";

type Scene = (typeof evidenceStory)[number];

const italicTerms = new Set(["Student Needs", "Student Interest", "evidence-based", "insight"]);

function StoryText({ children }: { children: string }) {
  return <>{children.split(/(Student Needs|Student Interest|evidence-based|insight)/g).map((part, index) => (
    italicTerms.has(part) ? <em className="story-term" key={`${part}-${index}`}>{part}</em> : part
  ))}</>;
}

const organizationLevels = ["Komisariat", "Cabang", "Badko", "Pengurus Besar"];

function OrganizationFlow({ active, connected }: { active: boolean; connected?: boolean }) {
  return (
    <div className={`story-hierarchy ${connected ? "is-connected" : "is-fragmented"} ${active ? "is-active" : ""}`} aria-hidden="true">
      <span className="hierarchy-kicker">Alur data organisasi</span>
      <div className="hierarchy-levels">
        {organizationLevels.map((level, index) => (
          <div className="hierarchy-level" key={level} style={{ "--level-index": index } as CSSProperties}>
            <i />
            <span>0{index + 1}</span>
            <strong>{level}</strong>
            {index < organizationLevels.length - 1 && <b />}
          </div>
        ))}
      </div>
      <p>{connected ? "Pengetahuan mengalir lintas jenjang" : "Data dihasilkan, alurnya terputus"}</p>
    </div>
  );
}

function KnowledgeFragments({ active }: { active: boolean }) {
  return (
    <div className={`knowledge-fragments ${active ? "is-active" : ""}`} aria-hidden="true">
      <span className="fragment-card">Notulensi</span>
      <span className="fragment-card">Dokumentasi</span>
      <span className="fragment-card">Data kader</span>
      <span className="fragment-card">Evaluasi</span>
      <div className="knowledge-core"><em>Insight</em><strong>Memori organisasi</strong></div>
    </div>
  );
}

function DecisionComparison({ active }: { active: boolean }) {
  return (
    <div className={`decision-comparison ${active ? "is-active" : ""}`} aria-hidden="true">
      <div className="decision-side decision-assumption">
        <span>Asumsi</span>
        <strong>Program berulang</strong>
        <p>Kebiasaan periode sebelumnya</p>
        <p>Kegiatan selesai</p>
        <p>Laporan tersimpan</p>
      </div>
      <div className="decision-side decision-evidence">
        <span>Bukti</span>
        <strong>Keputusan belajar</strong>
        <p><em>Student Needs</em></p>
        <p><em>Student Interest</em></p>
        <p>Dampak diperiksa</p>
      </div>
      <i className="decision-divider" />
    </div>
  );
}

function StoryLayer({ scene, index, phase, active }: { scene: Scene; index: number; phase: MotionValue<number>; active: number }) {
  const lastScene = evidenceStory.length - 1;
  const camera = [
    { scale: [1.03, 1.18], x: ["0%", "-2%"], y: ["0%", "1.5%"] },
    { scale: [1.24, 1.08], x: ["3%", "0%"], y: ["1%", "0%"] },
    { scale: [1.13, 1.035], x: ["-3%", "0%"], y: ["0%", "-1%"] },
    { scale: [1.2, 1.06], x: ["4%", "0%"], y: ["1%", "0%"] },
    { scale: [1.06, 1.14], x: ["0%", "-2%"], y: ["0%", "1%"] },
    { scale: [1.18, 1.005], x: ["2%", "0%"], y: ["1%", "0%"] },
  ][index];
  const opacity = useTransform(phase, [index - 0.16, index + 0.12, index + 0.84, index + 1.12], [index === 0 ? 1 : 0, 1, 1, index === lastScene ? 1 : 0]);
  const scale = useTransform(phase, [index - 0.15, index + 1.15], camera.scale);
  const x = useTransform(phase, [index - 0.15, index + 1.15], camera.x);
  const cameraY = useTransform(phase, [index - 0.15, index + 1.15], camera.y);
  const filter = useTransform(phase, [index - 0.14, index + 0.1, index + 0.9, index + 1.1], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  const y = useTransform(phase, [index, index + 0.2, index + 1], [22, 0, -18]);
  const symbolY = useTransform(phase, [index, index + 1], [35, -35]);
  const orbitRotation = useTransform(phase, [3, 4], [-25, 60]);
  return (
    <motion.section className={`story-layer story-layer-${index}`} style={{ opacity, visibility: Math.abs(active - index) <= 1 ? "visible" : "hidden" }} aria-hidden={active !== index} aria-label={scene.label}>
      <motion.img className="story-landscape" src={storyImage(scene.image)} alt="" style={{ scale, x, y: cameraY, filter, objectPosition: scene.position }} decoding="async" />
      <div className="story-shade" />
      <motion.div className="story-symbol" style={{ y: symbolY }} aria-hidden="true">{scene.symbol}</motion.div>
      {index === 2 && <><KnowledgeFragments active={active === index} /><OrganizationFlow active={active === index} /></>}
      {index === 3 && <><DecisionComparison active={active === index} /><motion.div className="story-orbit" aria-hidden="true" style={{ rotate: orbitRotation }}><span /><span /><span /></motion.div></>}
      {index === 5 && <OrganizationFlow active={active === index} connected />}
      <motion.div className="story-copy" style={{ opacity: active === index ? 1 : 0, y }}>
        <p className="story-eyebrow"><span>0{index + 1}</span>{scene.chapter}</p>
        <h2 className={scene.title.length > 85 ? "story-title-long" : undefined}><StoryText>{scene.title}</StoryText></h2>
        <p className="story-body"><StoryText>{scene.body}</StoryText></p>
        <p className="story-bridge"><StoryText>{scene.bridge}</StoryText></p>
      </motion.div>
    </motion.section>
  );
}

function ReadingView() {
  return <div className="story-reading">{evidenceStory.map((scene, index) => (
    <section key={scene.label} id={`chapter-${index + 1}`}>
      <img src={storyImage(scene.image)} alt="" loading="lazy" />
      <div className="story-shade" />
      <div className="story-copy">
        <p className="story-eyebrow"><span>0{index + 1}</span>{scene.chapter}</p>
        <h2 className={scene.title.length > 85 ? "story-title-long" : undefined}><StoryText>{scene.title}</StoryText></h2><p className="story-body"><StoryText>{scene.body}</StoryText></p>
        <p className="story-bridge"><StoryText>{scene.bridge}</StoryText></p>
      </div>
    </section>
  ))}</div>;
}

function CinematicStory() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const storyDuration = evidenceStory.length - 0.01;
  const lastScene = evidenceStory.length - 1;
  const phase = useTransform(scrollYProgress, [0, 1], [0, storyDuration]);
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0.03, 1]);
  const pointerX = useMotionValue(72);
  const pointerY = useMotionValue(42);
  const glowX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.7 });
  const glowY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.7 });
  const spotlight = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(231, 207, 146, .15), transparent 27%)`;
  useMotionValueEvent(phase, "change", value => setActive(Math.min(lastScene, Math.max(0, Math.floor(value)))));

  const goToChapter = (index: number) => {
    if (!track.current || !stage.current) return;
    const start = track.current.getBoundingClientRect().top + window.scrollY;
    const distance = track.current.offsetHeight - stage.current.offsetHeight;
    window.scrollTo({ top: start + distance * ((index + 0.25) / storyDuration), behavior: "smooth" });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  const goForward = () => {
    if (active < lastScene) {
      goToChapter(active + 1);
      return;
    }
    document.getElementById("komitmen")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={track} className="story-track" id="cerita">
      <div ref={stage} className="story-stage" onPointerMove={handlePointerMove} onPointerLeave={() => { pointerX.set(72); pointerY.set(42); }}>
        {evidenceStory.map((scene, index) => <StoryLayer key={scene.label} scene={scene} index={index} phase={phase} active={active} />)}
        <motion.div className="story-spotlight" style={{ background: spotlight }} aria-hidden="true" />
        <div className="story-vignette" aria-hidden="true" />
        <div className="story-topline" aria-hidden="true">
          <span>{active === 2 ? "" : "HMI Evidence / Perjalanan kader"}</span>
          <AnimatePresence mode="wait"><motion.span key={active} className="story-count" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>0{active + 1} / 0{evidenceStory.length}</motion.span></AnimatePresence>
          <span>{evidenceStory[active].era}</span>
        </div>
        <div className="story-progress-rail" aria-hidden="true"><motion.span style={{ scaleY: scrollYProgress }} /></div>
        <svg className="story-thread" viewBox="0 0 1000 460" fill="none" aria-hidden="true">
          <path d="M25 400 C160 400 120 70 290 100 S360 420 530 330 S620 90 730 165 S890 350 970 40" stroke="currentColor" strokeOpacity=".15" />
          <motion.path d="M25 400 C160 400 120 70 290 100 S360 420 530 330 S620 90 730 165 S890 350 970 40" stroke="currentColor" strokeWidth="1.6" style={{ pathLength: lineProgress }} />
        </svg>
        <nav className="story-chapters" aria-label="Bab HMI Evidence">
          {evidenceStory.map((scene, index) => <button key={scene.label} onClick={() => goToChapter(index)} aria-label={`Bab ${index + 1}: ${scene.label}`} aria-current={active === index ? "step" : undefined}>
            <span className="chapter-number">0{index + 1}</span><span className="chapter-label">{scene.label}</span><span className="chapter-bar" />
          </button>)}
        </nav>
        <button type="button" className="story-next" onClick={goForward} aria-label={active < lastScene ? `Lanjut ke ${evidenceStory[active + 1].label}` : "Lanjut ke komitmen"}>
          <span>{active < lastScene ? "Bab selanjutnya" : "Penutup"}</span>
          <strong>{active < lastScene ? evidenceStory[active + 1].label : "Komitmen"}</strong>
          <ArrowDown size={14} />
        </button>
        <AnimatePresence>{active === 0 && <motion.div className="story-scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true"><i /><span>Gulir untuk menelusuri</span></motion.div>}</AnimatePresence>
        <a className="story-skip" href="#komitmen">Ke komitmen <ArrowDown size={12} /></a>
      </div>
    </div>
  );
}

export default function HmiEvidencePage() {
  const reducedMotion = useReducedMotion();
  const [reading, setReading] = useState(false);
  const [shortScreen, setShortScreen] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-height: 520px), (max-width: 767px) and (max-height: 650px)");
    const update = () => setShortScreen(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const readMode = reducedMotion || shortScreen || reading;
  return (
    <div className="evidence-page">
      <Navbar dark />
      <main>
        <header className="evidence-prologue">
          <img src={storyImage("04-lingkaran-organisasi")} alt="Ilustrasi perjalanan kader di dalam organisasi" loading="eager" />
          <div className="prologue-shade" />
          <div className="prologue-content">
            <p className="story-eyebrow">HMI Evidence</p>
            <h1>Transformasi Gerakan Organisasi <em>Berbasis Bukti.</em></h1>
            <p className="prologue-question">Komitmen HMI Evidence menghadirkan ekosistem perkaderan terbaharukan.</p>
            <p className="prologue-intro">Sebuah perjalanan untuk mengenali kader, membaca pengalamannya, dan menghadirkan pengetahuan itu ke dalam keputusan organisasi.</p>
            <a href={readMode ? "#chapter-1" : "#cerita"} className="story-begin">Mulai membaca <ArrowDown size={18} /></a>
          </div>
          <div className="prologue-bottom"><span>{evidenceStory.length} bagian / Satu rangkaian cerita</span><button onClick={() => setReading(!reading)} aria-pressed={!!readMode} disabled={!!reducedMotion || shortScreen}>{readMode ? "Mode baca" : "Baca tanpa animasi"}</button></div>
        </header>

        {readMode ? <ReadingView /> : <CinematicStory />}

        <section className="evidence-commitment" id="komitmen">
          <p className="story-eyebrow">Pedoman Perkaderan / Tafsir Tujuan / 5KIC</p>
          <h2>Perkaderan tidak kehilangan arah.<br /><em>Ia memperoleh cara untuk terus belajar.</em></h2>
          <p>Pengalaman perkaderan berbasis bukti bukan tujuan baru yang menggantikan Pedoman Perkaderan. Ia merupakan ikhtiar untuk memastikan proses pembinaan berjalan sejalan dengan Pedoman Perkaderan dan Tafsir Tujuan HMI.</p>
          <p>Setiap data, evaluasi, keputusan, dan pembaruan program diarahkan untuk membina insan akademis, pencipta, pengabdi, bernafaskan Islam, dan bertanggung jawab bagi terwujudnya masyarakat adil makmur yang diridai Allah SWT.</p>
          <p className="commitment-statement">Dari pengalaman menjadi pengetahuan. Dari pengetahuan menjadi keputusan. Dari keputusan menuju terbinanya lima kualitas Insan Cita.</p>
          <a href="/tentang" className="commitment-link">Kenali visi dan misi Ahmad Zulfikar <ArrowRight size={18} /></a>
          <a href="#" className="story-restart"><RotateCcw size={14} /> Kembali ke awal</a>
          <p className="story-manifesto">Jangan bicara HMI tanpa bukti</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
