import "dotenv/config";

/**
 * Titik tunggal pembacaan variabel lingkungan.
 *
 * Modul ini sengaja diimpor paling awal oleh ./db, sehingga dotenv sudah
 * termuat dan pemeriksaan produksi di bawah sudah berjalan sebelum modul
 * lain menyentuh process.env.
 */

export const isProduction = process.env.NODE_ENV === "production";

export const databaseUrl = process.env.DATABASE_URL;

/**
 * Di produksi seluruh nilai ini wajib ada. Tanpa penjagaan ini server akan
 * berjalan memakai password admin bawaan dan kunci session yang bisa ditebak.
 */
if (isProduction) {
  for (const nama of ["SESSION_SECRET", "ADMIN_PASSWORD", "DATABASE_URL"]) {
    if (!process.env[nama]) {
      throw new Error(
        `${nama} wajib diatur di produksi. Atur variabel lingkungan di hosting sebelum menjalankan npm start.`,
      );
    }
  }
}

/**
 * Tanpa DATABASE_URL, pengembangan lokal memakai penyimpanan dalam memori
 * supaya situs bisa langsung dijalankan tanpa memasang PostgreSQL. Data
 * hilang setiap server dimatikan. Isi DATABASE_URL bila ingin data menetap.
 */
export const usesInMemoryStorage = !databaseUrl;
