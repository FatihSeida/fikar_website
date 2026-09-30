import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import multer from "multer";
import { isProduction, usesInMemoryStorage } from "./env";
import { pool } from "./db";
import { perlindunganBeban } from "./perlindungan";
import { isiRobotsTxt, tolakRobotPelatihan } from "./robotAi";

const app = express();
const httpServer = createServer(app);

app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; manifest-src 'self'; upgrade-insecure-requests",
    );
  }
  next();
});

app.get("/robots.txt", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.type("text/plain").send(isiRobotsTxt);
});
app.use(tolakRobotPelatihan);

// Paling awal, sebelum body parser: permintaan yang ditolak tidak sempat memakan CPU atau memori.
// Hanya di produksi; di pengembangan Vite menyajikan ratusan modul per halaman.
if (isProduction) app.use(perlindunganBeban());

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

app.use(
  express.json({
    limit: "256kb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "64kb", parameterLimit: 100 }));

if (isProduction) {
  app.set("trust proxy", 1);
}

/**
 * Session disimpan di PostgreSQL bila tersedia, sehingga admin tetap login
 * setelah server dimulai ulang. Tanpa database, express-session memakai
 * MemoryStore bawaannya — cukup untuk pengembangan lokal.
 */
const sessionStore = pool
  ? new (connectPgSimple(session))({ pool, createTableIfMissing: true })
  : undefined;

app.use(
  session({
    name: "ahmad.sid",
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "kunci-pengembangan-tidak-untuk-produksi",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
    },
  })
);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  if (usesInMemoryStorage) {
    log("DATABASE_URL kosong — memakai penyimpanan dalam memori.");
    log("Data akan hilang saat server dimatikan. Isi DATABASE_URL agar menetap.");
  }

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err instanceof multer.MulterError
      ? (err.code === "LIMIT_FILE_SIZE" ? 413 : 400)
      : err.status || err.statusCode || 500;
    const message = err instanceof multer.MulterError
      ? (err.code === "LIMIT_FILE_SIZE" ? "Ukuran gambar melebihi batas 5 MB" : "Berkas unggahan tidak valid")
      : status >= 500
        ? "Terjadi kesalahan pada server"
        : err.message || "Permintaan tidak dapat diproses";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (isProduction) {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Satu port melayani API sekaligus klien.
  //
  // Di produksi diikat ke 0.0.0.0 supaya reverse proxy bisa menjangkaunya.
  // Di pengembangan cukup localhost — mengikat ke semua antarmuka akan
  // memicu peringatan firewall Windows tanpa memberi manfaat apa pun.
  //
  // Opsi reusePort milik Replit dihapus: Windows menolaknya dengan ENOTSUP,
  // dan di VPS satu proses saja yang mengikat port ini.
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = isProduction ? "0.0.0.0" : "127.0.0.1";
  httpServer.requestTimeout = 15_000;
  httpServer.headersTimeout = 20_000;
  httpServer.keepAliveTimeout = 5_000;
  httpServer.maxHeadersCount = 100;
  httpServer.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();
