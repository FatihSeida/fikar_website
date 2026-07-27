import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { isProduction, usesInMemoryStorage } from "./env";
import { pool } from "./db";

const app = express();
const httpServer = createServer(app);

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
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

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
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "kunci-pengembangan-tidak-untuk-produksi",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
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
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
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
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

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
  httpServer.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();
