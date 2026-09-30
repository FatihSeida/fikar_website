import type { NextFunction, Request, Response } from "express";

/**
 * Robot pelatihan AI dilarang di robots.txt, dan ditolak di server bila tetap
 * datang. Mesin pencari, termasuk pencarian AI (OAI-SearchBot, ChatGPT-User,
 * Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User), tetap boleh
 * supaya situs muncul saat orang bertanya ke asisten AI.
 */

// Robot yang mengumpulkan halaman untuk melatih model AI.
const robotPelatihan = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
  "FacebookBot",
  "Amazonbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Diffbot",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "ImagesiftBot",
  "omgili",
  "Timpibot",
  "Kangaroo Bot",
  "Webzio-Extended",
  "img2dataset",
];

// Hanya berlaku di robots.txt: robotnya sama dengan mesin pencari (Googlebot,
// Applebot), jadi tidak bisa dibedakan dan ditolak di server.
const tokenPelatihan = ["Google-Extended", "Applebot-Extended"];

export const isiRobotsTxt = [
  "# Konten situs ini tidak boleh dipakai untuk melatih model AI.",
  "# Mesin pencari, termasuk pencarian AI, tetap diizinkan.",
  ...[...robotPelatihan, ...tokenPelatihan].map((nama) => `User-agent: ${nama}`),
  "Disallow: /",
  "",
  "User-agent: *",
  "Content-Signal: search=yes, ai-input=yes, ai-train=no",
  "Allow: /",
  "",
].join("\n");

const polaPelatihan = new RegExp(robotPelatihan.map((nama) => nama.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")).join("|"), "i");

/** Menolak robot pelatihan AI yang mengabaikan robots.txt; robots.txt sendiri tetap boleh dibaca. */
export function tolakRobotPelatihan(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/robots.txt" || !polaPelatihan.test(req.get("user-agent") ?? "")) return next();
  res.setHeader("Cache-Control", "no-store");
  res.status(403).type("text/plain").send("Konten situs ini tidak boleh dipakai untuk melatih model AI.");
}
