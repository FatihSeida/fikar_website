CREATE TABLE "hasil_kuis" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"skor" integer NOT NULL,
	"jawaban" text NOT NULL,
	"komisariat" text,
	"cabang" text,
	"peserta_lk1" integer,
	"aktif_lk1" integer,
	"program_rencana" integer,
	"program_terlaksana" integer
);
--> statement-breakpoint
CREATE TABLE "masalah_komisariat" (
	"id" serial PRIMARY KEY NOT NULL,
	"cabang" text NOT NULL,
	"komisariat" text NOT NULL,
	"kelompok" text,
	"masalah" text NOT NULL,
	"nama" text,
	"kontak" text,
	"boleh_dikutip" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'baru' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"hasil_kuis_id" integer
);
--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "tata" text DEFAULT 'lebar' NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "posisi" text;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "gambar_penuh" text;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "urutan" integer DEFAULT 0 NOT NULL;