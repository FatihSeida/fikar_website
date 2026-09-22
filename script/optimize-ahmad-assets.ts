import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "assets");
const PUBLIC = path.join(ROOT, "client", "public");

const portraits = [
  ["ChatGPT Image 20 Sep 2026, 13.19.50 (8).png", "hero.webp", 1800],
  ["ChatGPT Image 20 Sep 2026, 13.19.50 (2).png", "portrait-standing.webp", 1200],
  ["ChatGPT Image 20 Sep 2026, 13.19.50 (4).png", "portrait-seated.webp", 1200],
  ["ChatGPT Image 20 Sep 2026, 13.19.50 (1).png", "portrait-hmi.webp", 1200],
  ["ChatGPT Image 20 Sep 2026, 13.19.50 (5).png", "gallery-01.webp", 1800],
  ["376962.jpg.jpeg", "gallery-02.webp", 1800],
  ["336394.jpg.jpeg", "gallery-03.webp", 1800],
  ["336396.jpg.jpeg", "gallery-04.webp", 1800],
  ["336398.jpg.jpeg", "gallery-05.webp", 1800],
  ["336408.jpg.jpeg", "gallery-06.webp", 1800],
] as const;

const stories = [
  "hmi-evidence-01-indonesia-v1.png",
  "hmi-evidence-02-kelahiran-hmi-v1.png",
  "hmi-evidence-03-perubahan-zaman-v1.png",
  "hmi-evidence-04-lingkaran-organisasi-v1.png",
  "hmi-evidence-05-berbasis-bukti-v1.png",
  "hmi-evidence-06-masa-depan-v1.png",
] as const;

async function convert(source: string, destination: string, width: number) {
  const result = await sharp(source)
    .autoOrient()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(destination);
  console.log(`${path.basename(destination)} ${result.width}x${result.height}`);
}

async function main() {
  const portraitDir = path.join(PUBLIC, "ahmad");
  const storyDir = path.join(PUBLIC, "scrollytelling");
  await mkdir(portraitDir, { recursive: true });
  await mkdir(storyDir, { recursive: true });

  for (const [from, to, width] of portraits) {
    await convert(path.join(SOURCE, from), path.join(portraitDir, to), width);
  }

  // Art-directed crops remove empty headroom and center the person, not the room.
  await sharp(path.join(SOURCE, "ChatGPT Image 20 Sep 2026, 13.19.50 (4).png"))
    .autoOrient().extract({ left: 0, top: 350, width: 800, height: 1000 })
    .webp({ quality: 88 }).toFile(path.join(portraitDir, "profile-centered.webp"));
  await sharp(path.join(SOURCE, "ChatGPT Image 20 Sep 2026, 13.19.50 (2).png"))
    .autoOrient().extract({ left: 40, top: 340, width: 720, height: 900 })
    .webp({ quality: 88 }).toFile(path.join(portraitDir, "standing-centered.webp"));

  for (const file of stories) {
    await convert(
      path.join(SOURCE, "scrollytelling", file),
      path.join(storyDir, file.replace(/\.png$/, ".webp")),
      2400,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
