import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, RotateCcw, X } from "lucide-react";
import { Link } from "wouter";
import AjakDukung from "@/components/AjakDukung";
import VisiMisiDialog from "@/components/VisiMisiDialog";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";
import { evidenceStory, historyImage, historyMoments, langkahPenerapan, persoalanHmi, ranahPerbaikan, storyImage } from "@/lib/evidence-story";
import "@/styles/evidence.css";

type Scene = (typeof evidenceStory)[number];

type CameraProfile = {
  focusX: number;
  focusY: number;
  zoom: number;
  panX: number;
  panY: number;
};

const historyIntroCamera: CameraProfile = { focusX: 62, focusY: 49, zoom: 1.62, panX: -1, panY: -2 };
const sceneCameraProfiles: readonly CameraProfile[] = [
  historyIntroCamera,
  { focusX: 68, focusY: 53, zoom: 1.58, panX: -2, panY: -2 },
  { focusX: 57, focusY: 51, zoom: 1.62, panX: 1, panY: -2 },
  { focusX: 76, focusY: 49, zoom: 1.66, panX: -2, panY: -2 },
  { focusX: 50, focusY: 55, zoom: 1.58, panX: 1, panY: -2 },
  { focusX: 72, focusY: 55, zoom: 1.68, panX: -2, panY: -2 },
];

const italicTerms = new Set(["Student Needs", "Student Interest", "evidence-based", "insight"]);

function StoryText({ children }: { children: string }) {
  return <>{children.split(/(Student Needs|Student Interest|evidence-based|insight)/g).map((part, index) => (
    italicTerms.has(part) ? <em className="story-term" key={`${part}-${index}`}>{part}</em> : part
  ))}</>;
}

const organizationLevels = ["Komisariat", "Cabang", "Badko", "Pengurus Besar"];

const mobileDiagramCopy = [
  {
    title: "Enam pergulatan, satu tradisi kader",
    body: "Setiap masa mengubah bentuk tantangan HMI. Yang perlu diwariskan bukan hanya struktur, tetapi juga pengetahuan tentang cara kader membaca dan menjawab zamannya.",
  },
  {
    title: "Satu nama, perjalanan yang panjang",
    body: "Latihan Kader hanya menandai satu titik. Organisasi perlu membaca kelanjutan aktivitas, perkembangan kompetensi, dan dukungan yang dibutuhkan kader.",
  },
  {
    title: "Data tersebar belum menjadi pengetahuan",
    body: "Sentuh setiap sumber data. Ketika definisi dan alurnya terhubung, notulensi, dokumentasi, data kader, dan evaluasi dapat membentuk insight organisasi.",
  },
  {
    title: "Dua dasar pengambilan keputusan",
    body: "Bandingkan keputusan yang berangkat dari rasionalisasi berbeda dengan keputusan yang membangun tata kelola data, membaca Student Needs dan Student Interest, serta memeriksa hasil evaluasi.",
  },
  {
    title: "Energi organisasi menentukan arah gerakan",
    body: "Ketika perhatian lebih banyak berputar pada dinamika internal, persoalan kader, mahasiswa, dan masyarakat semakin jauh dari ruang keputusan.",
  },
  {
    title: "Bukti menghubungkan ekosistem perkaderan",
    body: "Setiap jenjang memiliki peran berbeda, tetapi pengetahuannya perlu mengalir sebagai satu ekosistem pembinaan yang terus belajar.",
  },
] as const;

const fragmentDetails = [
  { label: "Notulensi", detail: "Keputusan forum, argumentasi, dan tindak lanjut dapat dibaca kembali." },
  { label: "Dokumentasi", detail: "Aktivitas tidak berhenti sebagai arsip, tetapi memberi konteks atas proses kader." },
  { label: "Data kader", detail: "Perjalanan, kompetensi, dan kebutuhan dukungan dapat dikenali lintas periode." },
  { label: "Evaluasi", detail: "Hasil program diperiksa untuk mengetahui apa yang bekerja dan perlu diperbaiki." },
] as const;

function MobileStoryDiagram({ index }: { index: number }) {
  const [fragment, setFragment] = useState(0);
  const [decision, setDecision] = useState<"asumsi" | "bukti">("bukti");

  if (index === 0) return <div className="mobile-diagram"><HistoryCard /></div>;

  if (index === 1) {
    return (
      <div className="mobile-diagram mobile-journey-diagram">
        {["Latihan Kader", "Tetap aktif?", "Kompetensi berkembang?", "Dukungan berikutnya?"].map((label, itemIndex) => (
          <div className="mobile-journey-point" key={label}>
            <i className={itemIndex === 0 ? "is-known" : ""} />
            <span>0{itemIndex + 1}</span><strong>{label}</strong>
          </div>
        ))}
        <p>Yang tercatat sering kali titik awalnya, bukan keseluruhan perjalanannya.</p>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="mobile-diagram mobile-data-diagram">
        <div className="mobile-fragment-grid">
          {fragmentDetails.map((item, itemIndex) => (
            <button key={item.label} type="button" onClick={() => setFragment(itemIndex)} aria-pressed={fragment === itemIndex}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="mobile-insight-core"><em>Insight</em><span>Memori organisasi</span></div>
        <p aria-live="polite"><strong>{fragmentDetails[fragment].label}:</strong> {fragmentDetails[fragment].detail}</p>
      </div>
    );
  }

  if (index === 3) {
    const evidence = decision === "bukti";
    const assumptionItems = ["Setiap orang membawa rasionalisasinya", "Rasionalisasi saling dicocokkan", "Dasarnya berbeda dan belum terverifikasi", "Perbedaan dasar melahirkan benturan"];
    const evidenceItems = ["Membentuk tata kelola data", "Data diolah menjadi informasi dan bukti", "Pengambilan keputusan menjadi lebih jernih", "Keputusan atas perkara lebih mudah ditentukan"];
    return (
      <div className="mobile-diagram mobile-decision-diagram">
        <div className="mobile-decision-tabs" role="group" aria-label="Bandingkan dasar keputusan">
          <button type="button" aria-pressed={!evidence} onClick={() => setDecision("asumsi")}>Asumsi</button>
          <button type="button" aria-pressed={evidence} onClick={() => setDecision("bukti")}>Bukti</button>
        </div>
        <div className={`mobile-decision-card ${evidence ? "is-evidence" : "is-assumption"}`} aria-live="polite">
          <span>{evidence ? "Bukti" : "Asumsi"}</span>
          <strong>{evidence ? "Keputusan memiliki dasar yang dapat diperiksa" : "Rasionalisasi bertemu tanpa dasar bersama"}</strong>
          <ul>{(evidence ? evidenceItems : assumptionItems).map(item => <li key={item}><StoryText>{item}</StoryText></li>)}</ul>
        </div>
      </div>
    );
  }

  if (index === 4) {
    return (
      <div className="mobile-diagram mobile-energy-diagram">
        <div className="mobile-energy-row is-dominant"><span>Dinamika internal</span><i><b /></i><strong>Lebih terbaca</strong></div>
        <div className="mobile-energy-row"><span>Perjalanan kader</span><i><b /></i><strong>Belum utuh</strong></div>
        <div className="mobile-energy-row"><span>Persoalan mahasiswa</span><i><b /></i><strong>Menjauh</strong></div>
        <div className="mobile-energy-row"><span>Pengabdian masyarakat</span><i><b /></i><strong>Menjauh</strong></div>
        <p>Apa yang paling sering dibicarakan akan menjadi hal yang paling mudah dipetakan.</p>
      </div>
    );
  }

  return (
    <div className="mobile-diagram mobile-ecosystem-diagram">
      <div className="mobile-ecosystem-levels">
        {organizationLevels.map((level, levelIndex) => <div key={level}><span>0{levelIndex + 1}</span><strong>{level}</strong><i /></div>)}
      </div>
      <div className="mobile-evidence-core"><span>HMI</span><strong>Evidence</strong></div>
      <p>Data mengalir menjadi pengetahuan, lalu kembali sebagai dukungan bagi perkaderan.</p>
    </div>
  );
}

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
        <strong>Dasar berbeda</strong>
        <p>Rasionalisasi dibawa masing-masing</p>
        <p>Belum terverifikasi</p>
        <p>Perbedaan melahirkan benturan</p>
      </div>
      <div className="decision-side decision-evidence">
        <span>Bukti</span>
        <strong>Tata kelola data</strong>
        <p>Data menjadi informasi dan bukti</p>
        <p>Keputusan lebih jernih</p>
        <p>Dasarnya dapat diperiksa</p>
      </div>
      <i className="decision-divider" />
    </div>
  );
}

/** Garis waktu enam masa HMI. Setiap titik dapat diklik untuk membuka narasinya. */
function HistoryExplorer({ variant, selected, onSelect }: { variant: "stage" | "card"; selected: number; onSelect: (index: number) => void }) {
  const moment = historyMoments[selected];
  return (
    <div className={`history-explorer history-explorer-${variant}`}>
      <p className="history-explorer-hint">Klik setiap masa untuk membaca narasinya</p>
      <div className="history-line" role="group" aria-label="Enam masa perjalanan HMI">
        <i className="history-line-track" aria-hidden="true"><b style={{ width: `${(selected / (historyMoments.length - 1)) * 100}%` }} /></i>
        {historyMoments.map((item, index) => (
          <button
            key={item.years}
            type="button"
            className={index < selected ? "is-passed" : undefined}
            aria-pressed={selected === index}
            aria-label={`${item.years}: ${item.title}`}
            onClick={() => onSelect(index)}
          >
            <i aria-hidden="true" /><span>{item.years.split("–")[0]}</span>
          </button>
        ))}
      </div>
      <div aria-live="polite">
        <article key={moment.years} className="history-detail">
          {variant === "card" && <img src={historyImage(moment.image)} alt={moment.focus} loading="lazy" decoding="async" />}
          <p className="history-detail-index"><span>Peristiwa 0{selected + 1}</span><strong>{moment.years}</strong></p>
          <h3>{moment.title}</h3>
          <p>{moment.body}</p>
        </article>
      </div>
    </div>
  );
}

function HistoryCard() {
  const [selected, setSelected] = useState(0);
  return <HistoryExplorer variant="card" selected={selected} onSelect={setSelected} />;
}

/** Bab pertama pada desktop: satu layar sejarah dengan garis waktu interaktif. */
function DesktopHistoryLayer({ phase, activeBeat }: { phase: MotionValue<number>; activeBeat: number }) {
  const scene = evidenceStory[0];
  const [selected, setSelected] = useState(0);
  const opacity = useTransform(phase, [0, 0.86, 1.12], [1, 1, 0]);
  const scale = useTransform(phase, [0, 0.86, 1.12], [1.03, 1.1, 1.14]);
  const filter = useTransform(phase, [0, 0.9, 1.1], ["blur(0px)", "blur(0px)", "blur(7px)"]);
  const copyY = useTransform(phase, [0, 1], [0, -18]);
  const active = activeBeat === 0;

  return (
    <motion.section
      className={`story-layer desktop-history-layer ${active ? "is-active" : ""}`}
      style={{ opacity, visibility: activeBeat <= 1 ? "visible" : "hidden" }}
      aria-hidden={!active}
      aria-label={scene.label}
    >
      <motion.div className="history-backdrop" style={{ scale, filter }}>
        {historyMoments.map((moment, index) => (
          <img
            key={moment.image}
            className={index === selected ? "is-active" : undefined}
            src={historyImage(moment.image)}
            alt=""
            style={{ objectPosition: `${moment.focusX}% ${moment.focusY}%` }}
            decoding="async"
          />
        ))}
      </motion.div>
      <div className="story-shade" />
      <motion.div className="story-copy desktop-history-copy" style={{ opacity: active ? 1 : 0, y: copyY }}>
        <p className="story-eyebrow"><span>01</span>{scene.chapter}</p>
        <h2><StoryText>{scene.title}</StoryText></h2>
        <p className="story-body"><StoryText>{scene.body}</StoryText></p>
      </motion.div>
      <motion.div className="desktop-history-explorer" style={{ opacity: active ? 1 : 0, y: copyY }}>
        <HistoryExplorer variant="stage" selected={selected} onSelect={setSelected} />
      </motion.div>
    </motion.section>
  );
}

function StoryLayer({
  scene,
  sceneIndex,
  beatIndex,
  phase,
  activeBeat,
  isLast,
}: {
  scene: Scene;
  sceneIndex: number;
  beatIndex: number;
  phase: MotionValue<number>;
  activeBeat: number;
  isLast: boolean;
}) {
  const camera = sceneCameraProfiles[sceneIndex];
  const opacity = useTransform(phase, [beatIndex - 0.16, beatIndex + 0.12, beatIndex + 0.84, beatIndex + 1.12], [0, 1, 1, isLast ? 1 : 0]);
  const scale = useTransform(phase, [beatIndex - 0.15, beatIndex + 0.08, beatIndex + 0.78, beatIndex + 1.15], [1.025, 1.08, camera.zoom, camera.zoom * 1.04]);
  const x = useTransform(phase, [beatIndex - 0.15, beatIndex + 1.15], ["0%", `${camera.panX}%`]);
  const cameraY = useTransform(phase, [beatIndex - 0.15, beatIndex + 1.15], ["0%", `${camera.panY}%`]);
  const filter = useTransform(phase, [beatIndex - 0.14, beatIndex + 0.1, beatIndex + 0.9, beatIndex + 1.1], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  const y = useTransform(phase, [beatIndex, beatIndex + 0.2, beatIndex + 1], [22, 0, -18]);
  const symbolY = useTransform(phase, [beatIndex, beatIndex + 1], [35, -35]);
  const orbitRotation = useTransform(phase, [beatIndex, beatIndex + 1], [-25, 60]);
  const active = activeBeat === beatIndex;
  return (
    <motion.section className={`story-layer story-layer-${sceneIndex}`} style={{ opacity, visibility: Math.abs(activeBeat - beatIndex) <= 1 ? "visible" : "hidden" }} aria-hidden={!active} aria-label={scene.label}>
      <motion.img className="story-landscape" src={storyImage(scene.image)} alt="" style={{ scale, x, y: cameraY, filter, objectPosition: scene.position, transformOrigin: `${camera.focusX}% ${camera.focusY}%` }} decoding="async" />
      <div className="story-shade" />
      <motion.div className="story-symbol" style={{ y: symbolY }} aria-hidden="true">{scene.symbol}</motion.div>
      {sceneIndex === 2 && <><KnowledgeFragments active={active} /><OrganizationFlow active={active} /></>}
      {sceneIndex === 3 && <><DecisionComparison active={active} /><motion.div className="story-orbit" aria-hidden="true" style={{ rotate: orbitRotation }}><span /><span /><span /></motion.div></>}
      {sceneIndex === 5 && <OrganizationFlow active={active} connected />}
      <motion.div className="story-copy" style={{ opacity: active ? 1 : 0, y }}>
        <p className="story-eyebrow"><span>0{sceneIndex + 1}</span>{scene.chapter}</p>
        <h2 className={scene.title.length > 85 ? "story-title-long" : undefined}><StoryText>{scene.title}</StoryText></h2>
        <p className="story-body"><StoryText>{scene.body}</StoryText></p>
        {scene.bodySecondary && <p className="story-body story-body-secondary"><StoryText>{scene.bodySecondary}</StoryText></p>}
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
        {scene.bodySecondary && <p className="story-body story-body-secondary"><StoryText>{scene.bodySecondary}</StoryText></p>}
        {index === 0 && <HistoryCard />}
        {index > 0 && <div className="story-reading-diagram">
          <h3>{mobileDiagramCopy[index].title}</h3>
          <MobileStoryDiagram index={index} />
        </div>}
      </div>
    </section>
  ))}</div>;
}

const mobileChapterStepCounts = evidenceStory.map(() => 2);
const mobileScenePans = [
  { x: -4, y: -6 },
  { x: 4, y: -5 },
  { x: -5, y: -4 },
  { x: 5, y: -6 },
  { x: -4, y: -5 },
  { x: 4, y: -7 },
] as const;

function MobileCinematicStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const totalSteps = mobileChapterStepCounts.reduce((sum, count) => sum + count, 0);
  const completedSteps = mobileChapterStepCounts.slice(0, activeScene).reduce((sum, count) => sum + count, 0);
  const currentStep = completedSteps + activeStep;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = storyRef.current;
      if (!root) return;
      const storyBounds = root.getBoundingClientRect();
      setVisible(storyBounds.top < window.innerHeight * 0.84 && storyBounds.bottom > window.innerHeight * 0.16);
      const screenTarget = window.innerHeight * 0.5;
      let bestDistance = Number.POSITIVE_INFINITY;
      let nextScene = 0;
      let nextStep = 0;
      let bestElement: HTMLElement | null = null;
      root.querySelectorAll<HTMLElement>("[data-mobile-step]").forEach(element => {
        const bounds = element.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height * 0.5 - screenTarget);
        if (distance < bestDistance) {
          bestDistance = distance;
          nextScene = Number(element.dataset.scene ?? 0);
          nextStep = Number(element.dataset.step ?? 0);
          bestElement = element;
        }
      });
      if (bestElement) {
        const element = bestElement as HTMLElement;
        const bounds = element.getBoundingClientRect();
        const stepProgress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
        const travel = (stepProgress - 0.5) * 2;
        const panX = Number(element.dataset.panX ?? mobileScenePans[nextScene]?.x ?? 0);
        const panY = Number(element.dataset.panY ?? mobileScenePans[nextScene]?.y ?? -5);
        const originX = Number(element.dataset.cameraOriginX ?? 50);
        const originY = Number(element.dataset.cameraOriginY ?? 50);
        const startScale = Number(element.dataset.cameraStart ?? 1.025);
        const endScale = Number(element.dataset.cameraZoom ?? 1.62);
        const zoomProgress = Math.min(1, Math.max(0, (stepProgress - 0.18) / 0.58));
        const easedZoom = 1 - Math.pow(1 - zoomProgress, 3);
        root.style.setProperty("--mobile-camera-x", `${travel * panX}%`);
        root.style.setProperty("--mobile-camera-y", `${travel * panY}%`);
        root.style.setProperty("--mobile-camera-origin-x", `${originX}%`);
        root.style.setProperty("--mobile-camera-origin-y", `${originY}%`);
        root.style.setProperty("--mobile-camera-scale", `${startScale + (endScale - startScale) * easedZoom}`);
      }
      setActiveScene(nextScene);
      setActiveStep(nextStep);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={storyRef} className="mobile-story" id="cerita">
      <div
        className={`mobile-story-progress ${visible ? "is-visible" : ""}`}
        style={{ "--mobile-story-progress": `${progress}%` } as CSSProperties}
        aria-label={`Bab ${activeScene + 1} dari ${evidenceStory.length}`}
      >
        <span>0{activeScene + 1} / 0{evidenceStory.length}</span>
        <i><b /></i>
      </div>

      {evidenceStory.map((scene, index) => {
        const pan = mobileScenePans[index];
        const camera = sceneCameraProfiles[index];
        return (
        <section className={`mobile-story-chapter ${activeScene === index ? "is-active" : ""}`} key={scene.label} id={`mobile-chapter-${index + 1}`} aria-label={`Bab ${index + 1}: ${scene.label}`}>
          <div className="mobile-scene-background" aria-hidden="true">
            <img src={storyImage(scene.image)} alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" style={{ objectPosition: scene.position }} />
            <div className="mobile-scene-shade" />
            <div className="mobile-scene-depth"><i /><i /><i /></div>
          </div>

          <div className="mobile-scene-sequence">
            <article className="mobile-story-step mobile-narrative-step" data-mobile-step data-scene={index} data-step="0" data-pan-x={pan.x / 2} data-pan-y={pan.y / 2} data-camera-origin-x={camera.focusX} data-camera-origin-y={camera.focusY} data-camera-start="1.025" data-camera-zoom={camera.zoom - 0.28}>
              <div className="mobile-story-card">
                <p className="story-eyebrow"><span>0{index + 1}</span>{scene.chapter}</p>
                <h2 className={`mobile-story-title ${scene.title.length > 85 ? "is-long" : ""}`}><StoryText>{scene.title}</StoryText></h2>
                <p className="story-body"><StoryText>{scene.body}</StoryText></p>
                {scene.bodySecondary && <p className="story-body story-body-secondary"><StoryText>{scene.bodySecondary}</StoryText></p>}
              </div>
            </article>

            <article className="mobile-story-step mobile-visual-step" data-mobile-step data-scene={index} data-step="1" data-pan-x={-pan.x / 2} data-pan-y={pan.y / 2 - 1} data-camera-origin-x={camera.focusX} data-camera-origin-y={camera.focusY} data-camera-start={camera.zoom - 0.4} data-camera-zoom={camera.zoom}>
              <div className="mobile-visual-card">
                <span className="mobile-step-label">Baca visual</span>
                <h3>{mobileDiagramCopy[index].title}</h3>
                <MobileStoryDiagram index={index} />
                <p className="mobile-diagram-caption"><StoryText>{mobileDiagramCopy[index].body}</StoryText></p>
              </div>
            </article>

          </div>
        </section>
        );
      })}
    </div>
  );
}

function CinematicStory() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [activeBeat, setActiveBeat] = useState(0);
  const totalBeats = evidenceStory.length;
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const storyDuration = totalBeats - 0.01;
  const lastBeat = totalBeats - 1;
  const phase = useTransform(scrollYProgress, [0, 1], [0, storyDuration]);
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0.03, 1]);
  const pointerX = useMotionValue(72);
  const pointerY = useMotionValue(42);
  const glowX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.7 });
  const glowY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.7 });
  const spotlight = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(231, 207, 146, .15), transparent 27%)`;
  useMotionValueEvent(phase, "change", value => setActiveBeat(Math.min(lastBeat, Math.max(0, Math.floor(value)))));

  const activeChapter = activeBeat;
  const activeEra = evidenceStory[activeChapter].era;

  const goToChapter = (chapterIndex: number) => {
    if (!track.current || !stage.current) return;
    const start = track.current.getBoundingClientRect().top + window.scrollY;
    const distance = track.current.offsetHeight - stage.current.offsetHeight;
    window.scrollTo({ top: start + distance * ((chapterIndex + 0.18) / storyDuration), behavior: "smooth" });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  const goForward = () => {
    if (activeChapter < evidenceStory.length - 1) {
      goToChapter(activeChapter + 1);
      return;
    }
    document.getElementById("kondisi-hmi")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={track} className="story-track" id="cerita" style={{ "--story-height": `${totalBeats * 200}svh` } as CSSProperties}>
      <div ref={stage} className="story-stage" onPointerMove={handlePointerMove} onPointerLeave={() => { pointerX.set(72); pointerY.set(42); }}>
        <DesktopHistoryLayer phase={phase} activeBeat={activeBeat} />
        {evidenceStory.slice(1).map((scene, storyIndex) => {
          const sceneIndex = storyIndex + 1;
          const beatIndex = sceneIndex;
          return <StoryLayer
            key={scene.label}
            scene={scene}
            sceneIndex={sceneIndex}
            beatIndex={beatIndex}
            phase={phase}
            activeBeat={activeBeat}
            isLast={beatIndex === lastBeat}
          />;
        })}
        <motion.div className="story-spotlight" style={{ background: spotlight }} aria-hidden="true" />
        <div className="story-vignette" aria-hidden="true" />
        <div className="story-topline" aria-hidden="true">
          <span>HMI Evidence / {evidenceStory[activeChapter].label}</span>
          <AnimatePresence mode="wait"><motion.span key={activeChapter} className="story-count" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>0{activeChapter + 1} / 0{evidenceStory.length}</motion.span></AnimatePresence>
          <AnimatePresence mode="wait"><motion.span key={activeEra} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>{activeEra}</motion.span></AnimatePresence>
        </div>
        <div className="story-progress-rail" aria-hidden="true"><motion.span style={{ scaleY: scrollYProgress }} /></div>
        <svg className="story-thread" viewBox="0 0 1000 460" fill="none" aria-hidden="true">
          <path d="M25 400 C160 400 120 70 290 100 S360 420 530 330 S620 90 730 165 S890 350 970 40" stroke="currentColor" strokeOpacity=".15" />
          <motion.path d="M25 400 C160 400 120 70 290 100 S360 420 530 330 S620 90 730 165 S890 350 970 40" stroke="currentColor" strokeWidth="1.6" style={{ pathLength: lineProgress }} />
        </svg>
        <nav className="story-chapters" aria-label="Bab HMI Evidence">
          {evidenceStory.map((scene, index) => <button key={scene.label} onClick={() => goToChapter(index)} aria-label={`Bab ${index + 1}: ${scene.label}`} aria-current={activeChapter === index ? "step" : undefined}>
            <span className="chapter-number">0{index + 1}</span><span className="chapter-label">{scene.label}</span><span className="chapter-bar" />
          </button>)}
        </nav>
        <button type="button" className="story-next" onClick={goForward} aria-label={activeChapter < evidenceStory.length - 1 ? `Lanjut ke ${evidenceStory[activeChapter + 1].label}` : "Lanjut ke kondisi HMI"}>
          <span>{activeChapter < evidenceStory.length - 1 ? "Bab selanjutnya" : "Selanjutnya"}</span>
          <strong>{activeChapter < evidenceStory.length - 1 ? evidenceStory[activeChapter + 1].label : "Kondisi HMI"}</strong>
          <ArrowDown size={14} />
        </button>
        <AnimatePresence>{activeBeat === 0 && <motion.div className="story-scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true"><i /><span>Gulir untuk menelusuri</span></motion.div>}</AnimatePresence>
        <a className="story-skip" href="#kondisi-hmi">Lewati cerita <ArrowDown size={12} /></a>
      </div>
    </div>
  );
}

const indikatorTerbanyak = Math.max(...persoalanHmi.map(persoalan => persoalan.indikator));

/** Dasar pembacaan cerita: 44 indikator kemunduran HMI dan empat ranah perbaikannya. */
function EvidenceBasis() {
  return (
    <section className="evidence-basis" id="kondisi-hmi">
      <div className="basis-inner">
        <p className="story-eyebrow">44 Indikator Kemunduran HMI</p>
        <h2>Kondisi HMI <em>Saat Ini</em></h2>
        <p className="basis-lede">Pada 2006, Agussalim Sitompul mencatat 44 indikator kemunduran HMI sebagai bahan otokritik. Daftar ini bukan vonis untuk seluruh HMI, melainkan bahan pertanyaan yang masih dapat diperiksa di komisariat, cabang, Badko, dan Pengurus Besar. Dalam buku <cite>HMI Evidence</cite>, ke-44 indikator tersebut dikelompokkan menjadi enam persoalan utama.</p>
        <ol className="basis-problems">
          {persoalanHmi.map(persoalan => (
            <li key={persoalan.judul}>
              <div className="problem-head">
                <div><strong>{persoalan.judul}</strong><span>{persoalan.sorotan}</span></div>
                <b>{persoalan.indikator}<small>indikator</small></b>
              </div>
              <i className="problem-meter" aria-hidden="true"><span style={{ width: `${(persoalan.indikator / indikatorTerbanyak) * 100}%` }} /></i>
              <p>{persoalan.uraian}</p>
              <p className="problem-symptom"><em>Contoh gejala:</em> {persoalan.gejala}</p>
            </li>
          ))}
        </ol>
        <p className="basis-note"><strong>Saling terkait.</strong> Enam persoalan ini tidak berdiri sendiri. Rekrutmen yang menurun, misalnya, dapat berhubungan dengan kaderisasi, data, dan tata kelola sekaligus. Karena itu, perbaikannya tidak cukup dengan menambah kegiatan.</p>
        <p className="basis-source">Sumber: Agussalim Sitompul, <cite>44 Indikator Kemunduran HMI: Suatu Kritikan dan Koreksi untuk Kebangkitan Kembali HMI</cite> (Jakarta: CV Misaka Galiza, 2006); pengelompokan dari buku <cite>HMI Evidence</cite>, Bab 8.</p>
        <Link href="/indikator" className="basis-link">Jelajahi 44 indikator satu per satu <ArrowRight size={16} /></Link>

        <div className="basis-divider" />

        <p className="story-eyebrow">4 Ranah Perbaikan</p>
        <h2>Membangun Perkaderan <em>Berbasis Bukti</em></h2>
        <p className="basis-lede">Enam persoalan tersebut tidak dijawab dengan enam program baru. Perbaikannya harus masuk ke cara HMI bekerja sehari-hari. Ada empat hal yang perlu diperhatikan dalam membangun ekosistem perkaderan berbasis bukti.</p>
        <ol className="basis-ranah">
          {ranahPerbaikan.map((ranah, index) => (
            <li key={ranah.judul}><span>0{index + 1}</span><h3>{ranah.judul}</h3><p>{ranah.uraian}</p></li>
          ))}
        </ol>
        <div className="basis-principle">
          <strong>Mulai dari data, bukan dari aplikasi</strong>
          <p>Prioritas pertama bukan membangun satu aplikasi nasional. HMI perlu lebih dulu menyepakati data minimum, definisi yang sama, dan siapa yang bertanggung jawab. Aplikasi baru berguna setelah alurnya jelas.</p>
        </div>
        <p className="story-eyebrow basis-steps-label">Lima langkah penerapan bertahap</p>
        <ol className="basis-steps">
          {langkahPenerapan.map((langkah, index) => (
            <li key={langkah.judul}><span>0{index + 1}</span><strong>{langkah.judul}</strong><p>{langkah.uraian}</p></li>
          ))}
        </ol>
        <p className="basis-source">Diturunkan dari buku <cite>HMI Evidence</cite>, Bab 8: Gerakan Organisasi Berbasis Bukti.</p>
      </div>
    </section>
  );
}

const penandaBaca = [
  { id: "cerita", label: "Cerita HMI Evidence" },
  { id: "kondisi-hmi", label: "Kondisi HMI" },
  { id: "komitmen", label: "Komitmen" },
];
const KUNCI_BACA = "hmi-evidence-terakhir-dibaca";

/** Mengingat posisi baca terakhir di peramban ini dan menawarkan untuk melanjutkannya. */
function LanjutkanMembaca() {
  const [tersimpan, setTersimpan] = useState<{ rasio: number; label: string } | null>(null);

  useEffect(() => {
    if (window.location.hash) return;
    try {
      const data = JSON.parse(localStorage.getItem(KUNCI_BACA) || "null");
      if (data && typeof data.rasio === "number" && data.rasio > 0.06 && data.rasio < 0.97 && typeof data.label === "string") setTersimpan(data);
    } catch {
      // Penyimpanan peramban bisa diblokir; fitur ini cukup dilewati.
    }
  }, []);

  useEffect(() => {
    let jeda = 0;
    const simpan = () => {
      jeda = 0;
      const maksimum = document.documentElement.scrollHeight - window.innerHeight;
      if (maksimum <= 0 || window.scrollY < window.innerHeight) return;
      const aktif = penandaBaca.filter(({ id }) => {
        const elemen = document.getElementById(id);
        return elemen && elemen.getBoundingClientRect().top <= window.innerHeight * 0.4;
      }).pop();
      try {
        localStorage.setItem(KUNCI_BACA, JSON.stringify({ rasio: window.scrollY / maksimum, label: aktif?.label ?? "HMI Evidence" }));
      } catch {
        // Abaikan bila penyimpanan penuh atau diblokir.
      }
    };
    const onScroll = () => {
      if (window.scrollY > window.innerHeight) setTersimpan(null);
      if (!jeda) jeda = window.setTimeout(simpan, 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (jeda) window.clearTimeout(jeda);
    };
  }, []);

  if (!tersimpan) return null;
  const lanjutkan = () => {
    const maksimum = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: tersimpan.rasio * maksimum, behavior: "instant" });
    setTersimpan(null);
  };
  return (
    <div className="resume-reading" role="status">
      <button type="button" onClick={lanjutkan}>
        <span>Lanjutkan membaca</span>
        <strong>{tersimpan.label} · {Math.round(tersimpan.rasio * 100)}%</strong>
      </button>
      <button type="button" className="resume-close" onClick={() => setTersimpan(null)} aria-label="Tutup"><X size={14} /></button>
    </div>
  );
}

export default function HmiEvidencePage() {
  const reducedMotion = useReducedMotion();
  const [reading, setReading] = useState(false);
  // Dibaca langsung saat render pertama supaya HP tidak sempat merender versi
  // desktop dan mengunduh semua gambarnya.
  const [shortScreen, setShortScreen] = useState(() => window.matchMedia("(max-height: 520px), (max-width: 767px) and (max-height: 650px)").matches);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [limitedDevice, setLimitedDevice] = useState(false);
  const [visiMisiOpen, setVisiMisiOpen] = useState(false);
  const [visiMisiTarget, setVisiMisiTarget] = useState<string | undefined>();
  useEffect(() => {
    const query = window.matchMedia("(max-height: 520px), (max-width: 767px) and (max-height: 650px)");
    const update = () => setShortScreen(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const isMobile = query.matches;
      const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
      setMobile(isMobile);
      setLimitedDevice(isMobile && device.connection?.saveData === true);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const target = decodeURIComponent(window.location.hash.slice(1));
    if (!target) return;
    if (/^(?:visi-misi|pilar-\d{2}|program-\d{2})$/.test(target)) {
      setVisiMisiTarget(target);
      setVisiMisiOpen(true);
      return;
    }
    // Halaman panjang ini baru stabil setelah pemuat pembuka selesai, jadi
    // lompatannya diulang beberapa kali kecuali pembaca sudah menggulir sendiri.
    let batal = false;
    const hentikan = () => { batal = true; };
    const lompat = () => { if (!batal) document.getElementById(target)?.scrollIntoView({ behavior: "instant", block: "start" }); };
    const jeda = [80, 900, 2700].map((ms) => window.setTimeout(lompat, ms));
    window.addEventListener("wheel", hentikan, { passive: true });
    window.addEventListener("touchstart", hentikan, { passive: true });
    window.addEventListener("keydown", hentikan);
    return () => {
      jeda.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("wheel", hentikan);
      window.removeEventListener("touchstart", hentikan);
      window.removeEventListener("keydown", hentikan);
    };
  }, []);
  useEffect(() => {
    const bukaDariTautan = () => {
      const target = decodeURIComponent(window.location.hash.slice(1));
      if (!/^(?:visi-misi|pilar-\d{2}|program-\d{2})$/.test(target)) return;
      setVisiMisiTarget(target);
      setVisiMisiOpen(true);
    };
    window.addEventListener("hashchange", bukaDariTautan);
    return () => window.removeEventListener("hashchange", bukaDariTautan);
  }, []);
  const forcedReadMode = reducedMotion || shortScreen || limitedDevice;
  const readMode = forcedReadMode || reading;
  return (
    <div className="evidence-page">
      <Navbar dark />
      <LanjutkanMembaca />
      <main>
        <header className="evidence-prologue">
          <img src={storyImage("04-lingkaran-organisasi")} alt="Ilustrasi perjalanan kader di dalam organisasi" loading="eager" />
          <div className="prologue-shade" />
          <div className="prologue-content">
            <p className="story-eyebrow">HMI Evidence</p>
            <h1>Transformasi Gerakan Organisasi <em>Berbasis Bukti.</em></h1>
            <p className="prologue-question">HMI Evidence berangkat dari tanggung jawab untuk menjaga keberlanjutan perkaderan HMI.</p>
            <p className="prologue-intro">Pembinaan kader memerlukan pemahaman atas keadaan mereka. Pengalaman perkaderan di komisariat dan cabang harus menjadi bahan pertimbangan dalam menetapkan kebijakan organisasi.</p>
            <div className="prologue-actions">
              <a href={readMode ? "#chapter-1" : "#cerita"} className="story-begin">Mulai membaca <ArrowDown size={18} /></a>
              <button type="button" onClick={() => { setVisiMisiTarget(undefined); setVisiMisiOpen(true); }} className="prologue-shortcut"><span>Buka dialog</span><strong>Visi, Misi, dan Program Strategis</strong><ArrowRight size={16} /></button>
            </div>
          </div>
          <div className="prologue-bottom"><span>{evidenceStory.length} bagian / Satu rangkaian cerita</span><button onClick={() => setReading(!reading)} aria-pressed={!!readMode} disabled={!!forcedReadMode}>{limitedDevice ? "Mode ringan aktif" : readMode ? "Mode baca" : "Baca tanpa animasi"}</button></div>
        </header>

        {readMode ? <ReadingView /> : mobile ? <MobileCinematicStory /> : <CinematicStory />}

        <EvidenceBasis />

        <section className="evidence-commitment" id="komitmen">
          <p className="story-eyebrow">Pedoman Perkaderan / Tafsir Tujuan / 5KIC</p>
          <h2>Memperkuat pelaksanaan perkaderan<br /><em>sesuai tujuan HMI.</em></h2>
          <p>Perkaderan berbasis bukti merupakan pendekatan untuk memperkuat pelaksanaan Pedoman Perkaderan dan Tafsir Tujuan HMI. Pencatatan perkembangan kader serta evaluasi pembinaan diperlukan untuk menilai sejauh mana proses perkaderan telah berjalan sesuai dengan arah tersebut.</p>
          <p>Pengelolaan data, evaluasi, dan perbaikan program harus tetap mengacu pada pembinaan lima kualitas Insan Cita: akademis, pencipta, pengabdi, bernafaskan Islam, serta bertanggung jawab bagi terwujudnya masyarakat adil makmur yang diridai Allah SWT.</p>
          <p className="commitment-statement">Dari pengalaman menjadi pengetahuan. Dari pengetahuan menjadi keputusan. Dari keputusan menuju terbinanya lima kualitas Insan Cita.</p>
        </section>

        <section className="evidence-commitment evidence-closing" aria-label="Lanjutkan perjalanan">
          <AjakDukung
            gelap
            className="evidence-dukung"
            uraian="Sudah membaca HMI Evidence sampai akhir? Bagikan ke grup WhatsApp atau Instagram Story, supaya lebih banyak kader ikut membangun HMI yang belajar dari bukti."
            path="/hmi-evidence"
            pesan="Jangan bicara HMI tanpa bukti. Baca HMI Evidence: Transformasi Gerakan Organisasi Berbasis Bukti, lalu ukur komisariatmu lewat kuis audit komisariat."
            namaFile="story-hmi-evidence.png"
            story={{
              label: "HMI Evidence",
              judul: "Transformasi Gerakan Organisasi Berbasis Bukti",
              isi: "Dukung perbaikan kaderisasi HMI dengan transformasi gerakan organisasi berbasis bukti. Baca gagasannya dan audit tata kelola komisariatmu lewat mini kuis yang kami miliki.",
              tautan: "ahmadzulfikar.com/hmi-evidence",
              gambarSiap: "/ahmad/story-hmi-evidence-v2.png",
            }}
          />
          <p className="story-eyebrow">Lanjutkan perjalanan</p>
          <nav className="commitment-choices" aria-label="Lanjutkan perjalanan website">
            <a href="/tentang"><span>01</span><strong>Mengenal Ahmad Zulfikar</strong><ArrowRight size={18} /></a>
            <button type="button" onClick={() => { setVisiMisiTarget(undefined); setVisiMisiOpen(true); }}><span>02</span><strong>Visi Misi Ahmad Zulfikar</strong><ArrowRight size={18} /></button>
            <a href="/catatan"><span>03</span><strong>Membaca Catatan</strong><ArrowRight size={18} /></a>
          </nav>
          <a href="#" className="story-restart"><RotateCcw size={14} /> Kembali ke awal</a>
          <p className="story-manifesto">Jangan bicara HMI tanpa bukti</p>
        </section>
      </main>
      <SiteFooter />
      <VisiMisiDialog open={visiMisiOpen} onOpenChange={setVisiMisiOpen} target={visiMisiTarget} />
    </div>
  );
}
