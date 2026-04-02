ALTER TABLE "documents" ADD COLUMN "total_pages" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "page_number" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "pages_document_id_page_number_uidx" ON "pages" USING btree ("document_id","page_number");