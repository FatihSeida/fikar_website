import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";
import { evidenceStory, historyImage, historyMoments, storyImage } from "@/lib/evidence-story";
import "@/styles/evidence.css";

type Scene = (typeof evidenceStory)[number];
type HistoryMoment = (typeof historyMoments)[number];

type CameraProfile = {
  focusX: number;
  focusY: number;
  zoom: number;
  panX: number;
  panY: number;
};

const historyIntroCamera: CameraProfile = { focusX: 62, focusY: 49, zoom: 1.62, panX: -1, panY: -2 };
const historyReflectionCamera: CameraProfile = { focusX: 55, focusY: 66, zoom: 1.66, panX: 1, panY: -2 };
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

  if (index === 0) {
    return (
      <div className="mobile-diagram mobile-history-mini">
        <div className="mobile-history-mini-track">
          {historyMoments.map(moment => <span key={moment.years}>{moment.years}</span>)}
        </div>
        <p>Pergulatan berubah bentuk. Ikhtiar untuk membaca zaman dan membina kader tetap berlanjut.</p>
      </div>
    );
  }

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

function DesktopHistoryLayer({
  beatIndex,
  kind,
  moment,
  phase,
  activeBeat,
}: {
  beatIndex: number;
  kind: "intro" | "moment" | "reflection";
  moment: HistoryMoment;
  phase: MotionValue<number>;
  activeBeat: number;
}) {
  const scene = evidenceStory[0];
  const visual = kind === "intro"
    ? { ...historyIntroCamera, src: storyImage(scene.image) }
    : kind === "reflection"
      ? { ...historyReflectionCamera, src: storyImage("06-masa-depan") }
      : { ...moment, src: historyImage(moment.image) };
  const opacity = useTransform(phase, [beatIndex - 0.14, beatIndex + 0.1, beatIndex + 0.86, beatIndex + 1.12], [beatIndex === 0 ? 1 : 0, 1, 1, 0]);
  const scale = useTransform(phase, [beatIndex - 0.12, beatIndex + 0.08, beatIndex + 0.78, beatIndex + 1.12], [1.025, 1.08, visual.zoom, visual.zoom * 1.04]);
  const x = useTransform(phase, [beatIndex - 0.12, beatIndex + 1.12], ["0%", `${visual.panX}%`]);
  const cameraY = useTransform(phase, [beatIndex - 0.12, beatIndex + 1.12], ["0%", `${visual.panY}%`]);
  const filter = useTransform(phase, [beatIndex - 0.14, beatIndex + 0.09, beatIndex + 0.9, beatIndex + 1.1], ["blur(7px)", "blur(0px)", "blur(0px)", "blur(7px)"]);
  const copyY = useTransform(phase, [beatIndex, beatIndex + 0.22, beatIndex + 1], [24, 0, -18]);
  const active = activeBeat === beatIndex;

  return (
    <motion.section
      className={`story-layer desktop-history-layer desktop-history-${kind}`}
      style={{ opacity, visibility: Math.abs(activeBeat - beatIndex) <= 1 ? "visible" : "hidden" }}
      aria-hidden={!active}
      aria-label={kind === "moment" ? `${moment.years}: ${moment.title}` : scene.label}
    >
      <motion.img
        className="story-landscape"
        src={visual.src}
        alt=""
        style={{ scale, x, y: cameraY, filter, transformOrigin: `${visual.focusX}% ${visual.focusY}%` }}
        decoding="async"
      />
      <div className="story-shade" />
      <motion.div className="story-copy desktop-history-copy" style={{ opacity: active ? 1 : 0, y: copyY }}>
        {kind === "intro" && <>
          <p className="story-eyebrow"><span>01</span>{scene.chapter}</p>
          <h2><StoryText>{scene.title}</StoryText></h2>
          <p className="story-body"><StoryText>{scene.body}</StoryText></p>
          <span className="desktop-history-cue">Gulir untuk memasuki enam peristiwa <ArrowDown size={14} /></span>
        </>}

        {kind === "moment" && <>
          <p className="desktop-history-index"><span>Peristiwa</span><strong>{moment.years}</strong></p>
          <h2>{moment.title}</h2>
          <p className="story-body">{moment.body}</p>
        </>}

        {kind === "reflection" && <>
          <p className="story-eyebrow"><span>01</span>Dari sejarah menuju hari ini</p>
          <h2>Pergulatan berubah bentuk. Kerja organisasi terus berulang.</h2>
          <p className="story-body">Setiap periode menghadirkan kepengurusan, Rapat Anggota Komisariat, Konferensi Cabang, Musyawarah Daerah, Kongres, dan Rapat Kerja. Rapat Bidang, Rapat Presidium, Rapat Harian, serta Pleno memastikan roda organisasi tetap berjalan.</p>
          <p className="story-body story-body-secondary">Di tengah perubahan karakteristik zaman, kader HMI perlu tetap mewarisi semangat para pendahulunya. Karena itu, peninjauan aktivitas kader menjadi penting.</p>
          <p className="story-bridge"><StoryText>{scene.bridge}</StoryText></p>
        </>}
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
        <p className="story-bridge"><StoryText>{scene.bridge}</StoryText></p>
      </motion.div>
    </motion.section>
  );
}

function HistoryReadingTimeline() {
  return (
    <div className="history-reading-timeline">
      {historyMoments.map(moment => (
        <article key={moment.years}>
          <img src={historyImage(moment.image)} alt={moment.focus} loading="lazy" />
          <div>
            <span>{moment.years}</span>
            <h3>{moment.title}</h3>
            <p>{moment.body}</p>
          </div>
        </article>
      ))}
    </div>
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
        {index === 0 && <HistoryReadingTimeline />}
        <p className="story-bridge"><StoryText>{scene.bridge}</StoryText></p>
        <div className="story-reading-diagram">
          <h3>{mobileDiagramCopy[index].title}</h3>
          <MobileStoryDiagram index={index} />
        </div>
      </div>
    </section>
  ))}</div>;
}

const mobileChapterStepCounts = evidenceStory.map((_, index) => index === 0 ? historyMoments.length + 3 : 3);
const mobileScenePans = [
  { x: -4, y: -6 },
  { x: 4, y: -5 },
  { x: -5, y: -4 },
  { x: 5, y: -6 },
  { x: -4, y: -5 },
  { x: 4, y: -7 },
] as const;

const mobileHistoryVisuals = [
  {
    key: "history-intro",
    src: storyImage(evidenceStory[0].image),
    period: "1947 sampai Reformasi",
    ...historyIntroCamera,
  },
  ...historyMoments.map(moment => ({
    key: moment.image,
    src: historyImage(moment.image),
    period: moment.years,
    focusX: moment.focusX,
    focusY: moment.focusY,
    zoom: moment.zoom,
    panX: moment.panX,
    panY: moment.panY,
  })),
  {
    key: "history-reflection",
    src: storyImage("06-masa-depan"),
    period: "Dari sejarah menuju hari ini",
    ...historyReflectionCamera,
  },
];

function MobileHistoryChapter({ activeScene, activeStep }: { activeScene: number; activeStep: number }) {
  const scene = evidenceStory[0];
  const activeHistory = Math.min(mobileHistoryVisuals.length - 1, Math.max(0, activeStep));
  const routineStep = historyMoments.length + 1;
  const bridgeStep = historyMoments.length + 2;

  return (
    <section className={`mobile-story-chapter mobile-history-chapter ${activeScene === 0 ? "is-active" : ""}`} id="mobile-chapter-1" aria-label="Bab 1: HMI dari masa ke masa">
      <div className="mobile-scene-background mobile-history-background" aria-hidden="true">
        {mobileHistoryVisuals.map((visual, index) => (
          <img
            className={activeHistory === index ? "is-active" : ""}
            key={visual.key}
            src={visual.src}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
        <div className="mobile-scene-shade" />
        <div className="mobile-scene-depth"><i /><i /><i /></div>
        <div className="mobile-history-period"><span>{mobileHistoryVisuals[activeHistory].period}</span><i /></div>
      </div>

      <div className="mobile-scene-sequence">
        <article className="mobile-story-step mobile-narrative-step mobile-history-intro" data-mobile-step data-scene="0" data-step="0" data-pan-x={historyIntroCamera.panX} data-pan-y={historyIntroCamera.panY} data-camera-origin-x={historyIntroCamera.focusX} data-camera-origin-y={historyIntroCamera.focusY} data-camera-start="1.025" data-camera-zoom={historyIntroCamera.zoom}>
          <div className="mobile-story-card">
            <p className="story-eyebrow"><span>01</span>{scene.chapter}</p>
            <h2 className="mobile-story-title is-long"><StoryText>{scene.title}</StoryText></h2>
            <p className="story-body"><StoryText>{scene.body}</StoryText></p>
            {scene.bodySecondary && <p className="story-body story-body-secondary"><StoryText>{scene.bodySecondary}</StoryText></p>}
            <span className="mobile-history-cue">Gulir untuk memasuki setiap masa <ArrowDown size={14} /></span>
          </div>
        </article>

        {historyMoments.map((moment, index) => (
          <article
            className="mobile-story-step mobile-history-step"
            data-mobile-step
            data-scene="0"
            data-step={index + 1}
            data-pan-x={moment.panX}
            data-pan-y={moment.panY}
            data-camera-origin-x={moment.focusX}
            data-camera-origin-y={moment.focusY}
            data-camera-start="1.025"
            data-camera-zoom={moment.zoom}
            key={moment.years}
          >
            <div className="mobile-history-card">
              <div className="mobile-history-heading"><span>Peristiwa 0{index + 1}</span><strong>{moment.years}</strong></div>
              <h3>{moment.title}</h3>
              <p>{moment.body}</p>
            </div>
          </article>
        ))}

        <article className="mobile-story-step mobile-history-step mobile-history-reflection" data-mobile-step data-scene="0" data-step={routineStep} data-pan-x={historyReflectionCamera.panX} data-pan-y={historyReflectionCamera.panY} data-camera-origin-x={historyReflectionCamera.focusX} data-camera-origin-y={historyReflectionCamera.focusY} data-camera-start="1.025" data-camera-zoom={historyReflectionCamera.zoom}>
          <div className="mobile-history-card">
            <span className="mobile-step-label">Dari sejarah menuju hari ini</span>
            <h3>Pergulatan berubah bentuk. Kerja organisasi terus berulang.</h3>
            <p>Setiap periode menghadirkan kepengurusan, Rapat Anggota Komisariat, Konferensi Cabang, Musyawarah Daerah, Kongres, dan Rapat Kerja. Rapat Bidang, Rapat Presidium, Rapat Harian, serta Pleno memastikan roda organisasi tetap berjalan.</p>
            <p>Di tengah perubahan karakteristik zaman, kader HMI perlu tetap mewarisi semangat para pendahulunya. Karena itu, peninjauan aktivitas kader menjadi penting.</p>
            <p>Roda organisasi dan estafeta kepemimpinan dapat terus berjalan, sementara pengalaman serta aktivitas kader belum menjadi informasi yang ikut berpindah dari satu periode ke periode berikutnya.</p>
          </div>
        </article>

        <article className="mobile-story-step mobile-bridge-step" data-mobile-step data-scene="0" data-step={bridgeStep} data-pan-x={historyReflectionCamera.panX} data-pan-y={historyReflectionCamera.panY - 1} data-camera-origin-x={historyReflectionCamera.focusX} data-camera-origin-y={historyReflectionCamera.focusY} data-camera-start="1.42" data-camera-zoom="1.8">
          <div className="mobile-bridge-card">
            <span className="mobile-step-label">Yang perlu dibawa</span>
            <p><StoryText>{scene.bridge}</StoryText></p>
            <span className="mobile-next-chapter">Selanjutnya, {evidenceStory[1].label}</span>
            <ArrowDown size={18} aria-hidden="true" />
          </div>
        </article>
      </div>
    </section>
  );
}

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

      <MobileHistoryChapter activeScene={activeScene} activeStep={activeScene === 0 ? activeStep : 0} />

      {evidenceStory.slice(1).map((scene, storyIndex) => {
        const index = storyIndex + 1;
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

            <article className="mobile-story-step mobile-bridge-step" data-mobile-step data-scene={index} data-step="2" data-pan-x={pan.x / 3} data-pan-y={pan.y / 2 - 1.5} data-camera-origin-x={camera.focusX} data-camera-origin-y={camera.focusY} data-camera-start={camera.zoom - 0.2} data-camera-zoom={camera.zoom + 0.14}>
              <div className="mobile-bridge-card">
                <span className="mobile-step-label">Yang perlu dibawa</span>
                <p><StoryText>{scene.bridge}</StoryText></p>
                <span className="mobile-next-chapter">{index < evidenceStory.length - 1 ? `Selanjutnya, ${evidenceStory[index + 1].label}` : "Selanjutnya, komitmen HMI Evidence"}</span>
                <ArrowDown size={18} aria-hidden="true" />
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
  const historyBeatCount = historyMoments.length + 2;
  const totalBeats = historyBeatCount + evidenceStory.length - 1;
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

  const activeChapter = activeBeat < historyBeatCount ? 0 : activeBeat - historyBeatCount + 1;
  const activeEra = activeBeat === 0
    ? "1947 sampai Reformasi"
    : activeBeat <= historyMoments.length
      ? historyMoments[activeBeat - 1].years
      : activeBeat === historyBeatCount - 1
        ? "Dari sejarah menuju hari ini"
        : evidenceStory[activeChapter].era;

  const chapterBeat = (chapterIndex: number) => chapterIndex === 0 ? 0 : historyBeatCount + chapterIndex - 1;

  const goToChapter = (chapterIndex: number) => {
    if (!track.current || !stage.current) return;
    const start = track.current.getBoundingClientRect().top + window.scrollY;
    const distance = track.current.offsetHeight - stage.current.offsetHeight;
    window.scrollTo({ top: start + distance * ((chapterBeat(chapterIndex) + 0.18) / storyDuration), behavior: "smooth" });
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
    document.getElementById("komitmen")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={track} className="story-track" id="cerita" style={{ "--story-height": `${totalBeats * 200}svh` } as CSSProperties}>
      <div ref={stage} className="story-stage" onPointerMove={handlePointerMove} onPointerLeave={() => { pointerX.set(72); pointerY.set(42); }}>
        <DesktopHistoryLayer beatIndex={0} kind="intro" moment={historyMoments[0]} phase={phase} activeBeat={activeBeat} />
        {historyMoments.map((moment, index) => (
          <DesktopHistoryLayer key={moment.years} beatIndex={index + 1} kind="moment" moment={moment} phase={phase} activeBeat={activeBeat} />
        ))}
        <DesktopHistoryLayer beatIndex={historyBeatCount - 1} kind="reflection" moment={historyMoments[historyMoments.length - 1]} phase={phase} activeBeat={activeBeat} />
        {evidenceStory.slice(1).map((scene, storyIndex) => {
          const sceneIndex = storyIndex + 1;
          const beatIndex = historyBeatCount + storyIndex;
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
        <button type="button" className="story-next" onClick={goForward} aria-label={activeChapter < evidenceStory.length - 1 ? `Lanjut ke ${evidenceStory[activeChapter + 1].label}` : "Lanjut ke komitmen"}>
          <span>{activeChapter < evidenceStory.length - 1 ? "Bab selanjutnya" : "Penutup"}</span>
          <strong>{activeChapter < evidenceStory.length - 1 ? evidenceStory[activeChapter + 1].label : "Komitmen"}</strong>
          <ArrowDown size={14} />
        </button>
        <AnimatePresence>{activeBeat === 0 && <motion.div className="story-scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true"><i /><span>Gulir untuk menelusuri</span></motion.div>}</AnimatePresence>
        <a className="story-skip" href="#komitmen">Ke komitmen <ArrowDown size={12} /></a>
      </div>
    </div>
  );
}

export default function HmiEvidencePage() {
  const reducedMotion = useReducedMotion();
  const [reading, setReading] = useState(false);
  const [shortScreen, setShortScreen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [limitedDevice, setLimitedDevice] = useState(false);
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
  const forcedReadMode = reducedMotion || shortScreen || limitedDevice;
  const readMode = forcedReadMode || reading;
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
          <div className="prologue-bottom"><span>{evidenceStory.length} bagian / Satu rangkaian cerita</span><button onClick={() => setReading(!reading)} aria-pressed={!!readMode} disabled={!!forcedReadMode}>{limitedDevice ? "Mode ringan aktif" : readMode ? "Mode baca" : "Baca tanpa animasi"}</button></div>
        </header>

        {readMode ? <ReadingView /> : mobile ? <MobileCinematicStory /> : <CinematicStory />}

        <section className="evidence-commitment" id="komitmen">
          <p className="story-eyebrow">Pedoman Perkaderan / Tafsir Tujuan / 5KIC</p>
          <h2>Perkaderan tidak kehilangan arah.<br /><em>Ia memperoleh cara untuk terus belajar.</em></h2>
          <p>Pengalaman perkaderan berbasis bukti bukan tujuan baru yang menggantikan Pedoman Perkaderan. Ia merupakan ikhtiar untuk memastikan proses pembinaan berjalan sejalan dengan Pedoman Perkaderan dan Tafsir Tujuan HMI.</p>
          <p>Setiap data, evaluasi, keputusan, dan pembaruan program diarahkan untuk membina insan akademis, pencipta, pengabdi, bernafaskan Islam, dan bertanggung jawab bagi terwujudnya masyarakat adil makmur yang diridai Allah SWT.</p>
          <p className="commitment-statement">Dari pengalaman menjadi pengetahuan. Dari pengetahuan menjadi keputusan. Dari keputusan menuju terbinanya lima kualitas Insan Cita.</p>
          <nav className="commitment-choices" aria-label="Lanjutkan perjalanan website">
            <a href="/tentang"><span>01</span><strong>Mengenal Ahmad Zulfikar</strong><ArrowRight size={18} /></a>
            <a href="/catatan"><span>02</span><strong>Membaca Catatan</strong><ArrowRight size={18} /></a>
            <a href="/galeri"><span>03</span><strong>Melihat Aktivitas</strong><ArrowRight size={18} /></a>
          </nav>
          <a href="#" className="story-restart"><RotateCcw size={14} /> Kembali ke awal</a>
          <p className="story-manifesto">Jangan bicara HMI tanpa bukti</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
