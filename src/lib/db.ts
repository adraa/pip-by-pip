import { env as workerEnv } from 'cloudflare:workers';
import type { Learner } from './auth';

export type Env = {
  DB: D1Database;
  AUTH_SALT?: string;
  SESSION_SECRET?: string;
};

/**
 * Dev-only fallbacks. In production both values come from Cloudflare secrets;
 * see README. They are constants here so a local `npm run dev` works with no
 * setup at all.
 */
export const DEV_AUTH_SALT = 'pip-by-pip-dev-salt';
export const DEV_SESSION_SECRET = 'pip-by-pip-dev-session-secret';

/**
 * Bindings come from the Worker environment. `locals` is accepted so call sites
 * read naturally, but Astro v6 removed `locals.runtime.env`.
 */
export function getEnv(_locals?: App.Locals): Env {
  const bindings = workerEnv as unknown as Env;
  if (!bindings?.DB) {
    throw new Error('D1 binding "DB" is not available. Run `npm run db:local` once, then `npm run dev`.');
  }
  return bindings;
}

export function authSalt(env: Env): string {
  return env.AUTH_SALT ?? DEV_AUTH_SALT;
}

export function sessionSecret(env: Env): string {
  return env.SESSION_SECRET ?? DEV_SESSION_SECRET;
}

type LearnerRow = { id: string; name: string; is_recovery: number };

export async function findLearnerByCodeHash(db: D1Database, codeHash: string): Promise<Learner | null> {
  const row = await db
    .prepare('SELECT id, name, is_recovery FROM learners WHERE code_hash = ?1')
    .bind(codeHash)
    .first<LearnerRow>();
  return row ? { id: row.id, name: row.name, isRecovery: row.is_recovery === 1 } : null;
}

export async function findLearnerById(db: D1Database, id: string): Promise<Learner | null> {
  const row = await db
    .prepare('SELECT id, name, is_recovery FROM learners WHERE id = ?1')
    .bind(id)
    .first<LearnerRow>();
  return row ? { id: row.id, name: row.name, isRecovery: row.is_recovery === 1 } : null;
}

export async function listLearners(db: D1Database): Promise<Learner[]> {
  const { results } = await db
    .prepare('SELECT id, name, is_recovery FROM learners WHERE is_recovery = 0 ORDER BY created_at ASC')
    .all<LearnerRow>();
  return results.map((row) => ({ id: row.id, name: row.name, isRecovery: row.is_recovery === 1 }));
}

export async function getCompletedSlugs(db: D1Database, learnerId: string): Promise<Set<string>> {
  const { results } = await db
    .prepare('SELECT lesson_slug FROM progress WHERE learner_id = ?1')
    .bind(learnerId)
    .all<{ lesson_slug: string }>();
  return new Set(results.map((row) => row.lesson_slug));
}

export async function setLessonComplete(
  db: D1Database,
  learnerId: string,
  lessonSlug: string,
  complete: boolean,
): Promise<void> {
  if (complete) {
    await db
      .prepare('INSERT OR REPLACE INTO progress (learner_id, lesson_slug, completed_at) VALUES (?1, ?2, ?3)')
      .bind(learnerId, lessonSlug, Date.now())
      .run();
  } else {
    await db
      .prepare('DELETE FROM progress WHERE learner_id = ?1 AND lesson_slug = ?2')
      .bind(learnerId, lessonSlug)
      .run();
  }
}

export async function recordBookmark(db: D1Database, learnerId: string, lessonSlug: string): Promise<void> {
  await db
    .prepare('INSERT OR REPLACE INTO bookmarks (learner_id, lesson_slug, seen_at) VALUES (?1, ?2, ?3)')
    .bind(learnerId, lessonSlug, Date.now())
    .run();
}

export async function getBookmark(db: D1Database, learnerId: string): Promise<string | null> {
  const row = await db
    .prepare('SELECT lesson_slug FROM bookmarks WHERE learner_id = ?1')
    .bind(learnerId)
    .first<{ lesson_slug: string }>();
  return row?.lesson_slug ?? null;
}

export type StoredAnswer = { question: number; choice: number; correct: boolean };

export async function getQuizAnswers(
  db: D1Database,
  learnerId: string,
  lessonSlug: string,
): Promise<StoredAnswer[]> {
  const { results } = await db
    .prepare('SELECT question, choice, correct FROM quiz_answers WHERE learner_id = ?1 AND lesson_slug = ?2')
    .bind(learnerId, lessonSlug)
    .all<{ question: number; choice: number; correct: number }>();
  return results.map((row) => ({ question: row.question, choice: row.choice, correct: row.correct === 1 }));
}

export async function saveQuizAnswer(
  db: D1Database,
  learnerId: string,
  lessonSlug: string,
  question: number,
  choice: number,
  correct: boolean,
): Promise<void> {
  await db
    .prepare(
      'INSERT OR REPLACE INTO quiz_answers (learner_id, lesson_slug, question, choice, correct, answered_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
    )
    .bind(learnerId, lessonSlug, question, choice, correct ? 1 : 0, Date.now())
    .run();
}

export type WeekSummary = {
  lessonsFinished: number;
  questionsAnswered: number;
  questionsCorrect: number;
  since: number;
};

export async function getWeekSummary(db: D1Database, learnerId: string): Promise<WeekSummary> {
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const lessons = await db
    .prepare('SELECT COUNT(*) AS n FROM progress WHERE learner_id = ?1 AND completed_at >= ?2')
    .bind(learnerId, since)
    .first<{ n: number }>();

  const quiz = await db
    .prepare(
      'SELECT COUNT(*) AS n, SUM(correct) AS right FROM quiz_answers WHERE learner_id = ?1 AND answered_at >= ?2',
    )
    .bind(learnerId, since)
    .first<{ n: number; right: number | null }>();

  return {
    lessonsFinished: lessons?.n ?? 0,
    questionsAnswered: quiz?.n ?? 0,
    questionsCorrect: quiz?.right ?? 0,
    since,
  };
}

export async function getShakyLessons(db: D1Database, learnerId: string, limit = 6): Promise<string[]> {
  const { results } = await db
    .prepare(
      `SELECT lesson_slug, SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS misses
       FROM quiz_answers WHERE learner_id = ?1
       GROUP BY lesson_slug HAVING misses > 0
       ORDER BY misses DESC, MAX(answered_at) DESC LIMIT ?2`,
    )
    .bind(learnerId, limit)
    .all<{ lesson_slug: string }>();
  return results.map((row) => row.lesson_slug);
}
