CREATE TABLE "scenarios" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sites" jsonb NOT NULL,
	"landing_date_utc" timestamp with time zone NOT NULL,
	"duration_hours" integer NOT NULL,
	"weights" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
