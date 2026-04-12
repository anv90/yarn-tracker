-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "brand_lookup" (
	"brand_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yarn_products" (
	"product_id" bigint NOT NULL,
	"brand_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"weight_id" bigint NOT NULL,
	"fiber_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weight_lookup" (
	"weight_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fiber_lookup" (
	"fiber_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yarn_stash" (
	"yarn_id" bigint NOT NULL,
	"product_id" bigint NOT NULL,
	"color" varchar(255) NOT NULL,
	"yards" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patterns" (
	"pattern_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"link" varchar(2048) NOT NULL,
	"recommended_weight_id" bigint NOT NULL,
	"yardage" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finished_projects" (
	"finished_project_id" bigint NOT NULL,
	"yarn_id" bigint NOT NULL,
	"pattern_id" bigint NOT NULL,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "yarn_products" ADD CONSTRAINT "fk_yarn_products_brand" FOREIGN KEY ("brand_id") REFERENCES "public"."brand_lookup"("brand_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yarn_products" ADD CONSTRAINT "fk_yarn_products_weight" FOREIGN KEY ("weight_id") REFERENCES "public"."weight_lookup"("weight_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yarn_products" ADD CONSTRAINT "fk_yarn_products_fiber" FOREIGN KEY ("fiber_id") REFERENCES "public"."fiber_lookup"("fiber_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yarn_stash" ADD CONSTRAINT "fk_yarn_stash_product" FOREIGN KEY ("product_id") REFERENCES "public"."yarn_products"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patterns" ADD CONSTRAINT "fk_patterns_recommended_weight" FOREIGN KEY ("recommended_weight_id") REFERENCES "public"."weight_lookup"("weight_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finished_projects" ADD CONSTRAINT "fk_finished_projects_yarn" FOREIGN KEY ("yarn_id") REFERENCES "public"."yarn_stash"("yarn_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finished_projects" ADD CONSTRAINT "fk_finished_projects_pattern" FOREIGN KEY ("pattern_id") REFERENCES "public"."patterns"("pattern_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_yarn_products_brand_id" ON "yarn_products" USING btree ("brand_id" int8_ops);--> statement-breakpoint
CREATE INDEX "ix_yarn_products_fiber_id" ON "yarn_products" USING btree ("fiber_id" int8_ops);--> statement-breakpoint
CREATE INDEX "ix_yarn_products_weight_id" ON "yarn_products" USING btree ("weight_id" int8_ops);--> statement-breakpoint
CREATE INDEX "ix_yarn_stash_product_id" ON "yarn_stash" USING btree ("product_id" int8_ops);--> statement-breakpoint
CREATE INDEX "ix_patterns_recommended_weight_id" ON "patterns" USING btree ("recommended_weight_id" int8_ops);--> statement-breakpoint
CREATE INDEX "ix_finished_projects_pattern_id" ON "finished_projects" USING btree ("pattern_id" int8_ops);--> statement-breakpoint
CREATE INDEX "ix_finished_projects_yarn_id" ON "finished_projects" USING btree ("yarn_id" int8_ops);
*/