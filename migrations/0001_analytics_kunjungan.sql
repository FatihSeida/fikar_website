CREATE TABLE "kunjungan" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"path" text NOT NULL,
	"referrer" text,
	"sumber" text,
	"kota" text,
	"provinsi" text,
	"perangkat" text NOT NULL,
	"pengunjung" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "kunjungan_created_at_idx" ON "kunjungan" USING btree ("created_at");