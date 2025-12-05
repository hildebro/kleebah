CREATE TABLE posting_new
(
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    description TEXT,
    pubDate     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    visibility  TEXT NOT NULL
);
--> statement-breakpoint
INSERT INTO posting_new (id, title, content, description, pubDate, visibility)
SELECT id, title, content, description, pubDate, 'public'
FROM posting;
--> statement-breakpoint
DROP TABLE posting;
--> statement-breakpoint
ALTER TABLE posting_new RENAME TO posting;