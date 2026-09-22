CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"caption" text NOT NULL,
	"col_span" text DEFAULT 'col-span-1'
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"tag" text NOT NULL,
	"date" text NOT NULL,
	"cover_image" text,
	"source_url" text,
	"source_name" text,
	CONSTRAINT "notes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
