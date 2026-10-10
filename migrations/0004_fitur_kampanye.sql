CREATE TABLE "kiriman_fitur" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"fitur" text NOT NULL,
	"komisariat" text,
	"cabang" text,
	"nama" text,
	"kontak" text,
	"kota" text,
	"provinsi" text,
	"data" jsonb NOT NULL,
	"kunci_ubah" text
);
--> statement-breakpoint
CREATE TABLE "seri" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nomor" integer NOT NULL,
	"judul" text NOT NULL,
	"subjudul" text,
	"penulis" text DEFAULT 'Ahmad Zulfikar' NOT NULL,
	"ringkasan" text,
	"isi" text DEFAULT '' NOT NULL,
	"gambar" text,
	"tautan_media" text,
	"nama_media" text,
	"diperbarui_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seri_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tanggapan" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"seri_slug" text NOT NULL,
	"komisariat" text NOT NULL,
	"cabang" text NOT NULL,
	"nama" text,
	"isi" text NOT NULL,
	"status" text DEFAULT 'baru' NOT NULL,
	"kota" text,
	"provinsi" text
);
--> statement-breakpoint
CREATE INDEX "kiriman_fitur_idx" ON "kiriman_fitur" USING btree ("fitur","created_at");--> statement-breakpoint
CREATE INDEX "tanggapan_seri_idx" ON "tanggapan" USING btree ("seri_slug","status");