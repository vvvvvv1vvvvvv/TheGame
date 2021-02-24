CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."Map"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "player_id" uuid NOT NULL, "author_address" text NOT NULL, "name" text NOT NULL, "data" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON UPDATE restrict ON DELETE restrict);
