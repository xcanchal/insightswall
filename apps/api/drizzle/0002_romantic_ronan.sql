CREATE TABLE "activity_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"actor_user_id" text,
	"event_type" text NOT NULL,
	"object_id" uuid,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decision_alternatives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"decision_object_id" uuid NOT NULL,
	"title" text NOT NULL,
	"disposition" text NOT NULL,
	"rejection_reason" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "decision_alternatives_decision_sort_unique" UNIQUE("decision_object_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "decisions" (
	"object_id" uuid PRIMARY KEY NOT NULL,
	"kind" text DEFAULT 'DECISION' NOT NULL,
	"question" text NOT NULL,
	"outcome" text,
	"rationale" text NOT NULL,
	"decided_at" timestamp with time zone,
	CONSTRAINT "decisions_kind_check" CHECK ("decisions"."kind" = 'DECISION')
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"object_id" uuid PRIMARY KEY NOT NULL,
	"kind" text DEFAULT 'EVIDENCE' NOT NULL,
	"evidence_type" text NOT NULL,
	"original_content" text NOT NULL,
	"observed_at" timestamp with time zone,
	"source_label" text,
	"source_author" text,
	"source_url" text,
	CONSTRAINT "evidence_kind_check" CHECK ("evidence"."kind" = 'EVIDENCE')
);
--> statement-breakpoint
CREATE TABLE "object_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"from_object_id" uuid NOT NULL,
	"to_object_id" uuid NOT NULL,
	"relationship_type" text NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "object_links_distinct_objects_check" CHECK ("object_links"."from_object_id" <> "object_links"."to_object_id"),
	CONSTRAINT "object_links_relationship_type_check" CHECK ("object_links"."relationship_type" in ('SUPPORTS', 'LED_TO', 'SELECTS', 'ADDRESSES', 'MEASURED_BY', 'SUPERSEDES'))
);
--> statement-breakpoint
CREATE TABLE "outcomes" (
	"object_id" uuid PRIMARY KEY NOT NULL,
	"kind" text DEFAULT 'OUTCOME' NOT NULL,
	"result" text NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"numeric_value" numeric(18, 4),
	"unit" text,
	"source_label" text,
	"source_url" text,
	CONSTRAINT "outcomes_kind_check" CHECK ("outcomes"."kind" = 'OUTCOME'),
	CONSTRAINT "outcomes_numeric_unit_check" CHECK (("outcomes"."numeric_value" is null and "outcomes"."unit" is null) or ("outcomes"."numeric_value" is not null and "outcomes"."unit" is not null))
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"object_id" uuid PRIMARY KEY NOT NULL,
	"kind" text DEFAULT 'PROBLEM' NOT NULL,
	CONSTRAINT "problems_kind_check" CHECK ("problems"."kind" = 'PROBLEM')
);
--> statement-breakpoint
CREATE TABLE "product_object_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"object_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"changed_by" text,
	"change_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_object_versions_object_version_unique" UNIQUE("object_id","version"),
	CONSTRAINT "product_object_versions_positive_version_check" CHECK ("product_object_versions"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "product_objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"status" text NOT NULL,
	"origin" text DEFAULT 'MANUAL' NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "product_objects_product_id_id_unique" UNIQUE("project_id","id"),
	CONSTRAINT "product_objects_id_kind_unique" UNIQUE("id","kind"),
	CONSTRAINT "product_objects_kind_check" CHECK ("product_objects"."kind" in ('PROBLEM', 'EVIDENCE', 'DECISION', 'SOLUTION', 'OUTCOME')),
	CONSTRAINT "product_objects_kind_status_check" CHECK (("product_objects"."kind" = 'PROBLEM' and "product_objects"."status" in ('EMERGING', 'VALIDATED', 'ARCHIVED'))
				or ("product_objects"."kind" = 'EVIDENCE' and "product_objects"."status" in ('ACTIVE', 'ARCHIVED'))
				or ("product_objects"."kind" = 'DECISION' and "product_objects"."status" in ('PROPOSED', 'ACCEPTED', 'REJECTED', 'SUPERSEDED'))
				or ("product_objects"."kind" = 'SOLUTION' and "product_objects"."status" in ('PROPOSED', 'IN_PROGRESS', 'SHIPPED', 'ABANDONED'))
				or ("product_objects"."kind" = 'OUTCOME' and "product_objects"."status" = 'RECORDED'))
);
--> statement-breakpoint
CREATE TABLE "solutions" (
	"object_id" uuid PRIMARY KEY NOT NULL,
	"kind" text DEFAULT 'SOLUTION' NOT NULL,
	"hypothesis" text,
	"shipped_at" timestamp with time zone,
	CONSTRAINT "solutions_kind_check" CHECK ("solutions"."kind" = 'SOLUTION')
);
--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_product_object_fk" FOREIGN KEY ("project_id","object_id") REFERENCES "public"."product_objects"("project_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_alternatives" ADD CONSTRAINT "decision_alternatives_decision_object_id_decisions_object_id_fk" FOREIGN KEY ("decision_object_id") REFERENCES "public"."decisions"("object_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_object_kind_fk" FOREIGN KEY ("object_id","kind") REFERENCES "public"."product_objects"("id","kind") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_object_kind_fk" FOREIGN KEY ("object_id","kind") REFERENCES "public"."product_objects"("id","kind") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object_links" ADD CONSTRAINT "object_links_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object_links" ADD CONSTRAINT "object_links_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object_links" ADD CONSTRAINT "object_links_from_product_object_fk" FOREIGN KEY ("project_id","from_object_id") REFERENCES "public"."product_objects"("project_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object_links" ADD CONSTRAINT "object_links_to_product_object_fk" FOREIGN KEY ("project_id","to_object_id") REFERENCES "public"."product_objects"("project_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcomes" ADD CONSTRAINT "outcomes_object_kind_fk" FOREIGN KEY ("object_id","kind") REFERENCES "public"."product_objects"("id","kind") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_object_kind_fk" FOREIGN KEY ("object_id","kind") REFERENCES "public"."product_objects"("id","kind") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_object_versions" ADD CONSTRAINT "product_object_versions_object_id_product_objects_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."product_objects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_object_versions" ADD CONSTRAINT "product_object_versions_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_objects" ADD CONSTRAINT "product_objects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_objects" ADD CONSTRAINT "product_objects_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_object_kind_fk" FOREIGN KEY ("object_id","kind") REFERENCES "public"."product_objects"("id","kind") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_events_product_occurred_idx" ON "activity_events" USING btree ("project_id","occurred_at");--> statement-breakpoint
CREATE INDEX "activity_events_object_occurred_idx" ON "activity_events" USING btree ("object_id","occurred_at");--> statement-breakpoint
CREATE INDEX "decision_alternatives_decision_idx" ON "decision_alternatives" USING btree ("decision_object_id");--> statement-breakpoint
CREATE UNIQUE INDEX "object_links_active_unique" ON "object_links" USING btree ("from_object_id","to_object_id","relationship_type") WHERE "object_links"."archived_at" is null;--> statement-breakpoint
CREATE INDEX "object_links_from_idx" ON "object_links" USING btree ("project_id","from_object_id","relationship_type");--> statement-breakpoint
CREATE INDEX "object_links_to_idx" ON "object_links" USING btree ("project_id","to_object_id","relationship_type");--> statement-breakpoint
CREATE INDEX "product_object_versions_object_idx" ON "product_object_versions" USING btree ("object_id","version");--> statement-breakpoint
CREATE INDEX "product_objects_product_kind_status_idx" ON "product_objects" USING btree ("project_id","kind","status");--> statement-breakpoint
CREATE INDEX "product_objects_product_archived_idx" ON "product_objects" USING btree ("project_id","archived_at");