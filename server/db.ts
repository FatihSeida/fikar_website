import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { databaseUrl } from "./env";

const { Pool } = pg;

/**
 * Keduanya null bila DATABASE_URL tidak diatur — kondisi yang hanya mungkin
 * terjadi di pengembangan, karena ./env sudah menggagalkan boot produksi
 * tanpa DATABASE_URL. Lihat ./storage untuk penyimpanan penggantinya.
 */
export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : null;

export type Db = ReturnType<typeof drizzle<typeof schema>>;

export const db: Db | null = pool ? drizzle(pool, { schema }) : null;
