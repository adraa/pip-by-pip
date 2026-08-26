-- Pip by Pip · Cloudflare D1 schema
-- Apply locally:  npm run db:local
-- Apply remotely: npm run db:remote

CREATE TABLE IF NOT EXISTS learners (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  code_hash   TEXT NOT NULL,
  is_recovery INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS learners_code_hash ON learners (code_hash);

CREATE TABLE IF NOT EXISTS progress (
  learner_id   TEXT NOT NULL,
  lesson_slug  TEXT NOT NULL,
  completed_at INTEGER NOT NULL,
  PRIMARY KEY (learner_id, lesson_slug)
);

CREATE INDEX IF NOT EXISTS progress_by_time ON progress (learner_id, completed_at DESC);

CREATE TABLE IF NOT EXISTS quiz_answers (
  learner_id  TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  question    INTEGER NOT NULL,
  choice      INTEGER NOT NULL,
  correct     INTEGER NOT NULL,
  answered_at INTEGER NOT NULL,
  PRIMARY KEY (learner_id, lesson_slug, question)
);

CREATE INDEX IF NOT EXISTS quiz_by_time ON quiz_answers (learner_id, answered_at DESC);

-- Where each learner last was, so "continue reading" is instant.
CREATE TABLE IF NOT EXISTS bookmarks (
  learner_id  TEXT PRIMARY KEY,
  lesson_slug TEXT NOT NULL,
  seen_at     INTEGER NOT NULL
);
