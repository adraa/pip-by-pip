#!/usr/bin/env node
/**
 * Validates every written lesson against the syllabus and the content schema,
 * without needing a dev server. Run it with `npm run check:lessons`.
 *
 * Checks:
 *   - the file's folder and name match a real course and lesson slug
 *   - the frontmatter is valid YAML
 *   - oneThing is present, terms are well formed
 *   - there are exactly four questions, each with a valid answer index
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const root = new URL('..', import.meta.url).pathname;
const syllabus = JSON.parse(readFileSync(join(root, 'src/data/syllabus.json'), 'utf8'));
const lessonsDir = join(root, 'src/content/lessons');

const known = new Map();
for (const course of syllabus) {
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      known.set(`${course.slug}/${lesson.slug}`, lesson.title);
    }
  }
}

const problems = [];
let checked = 0;

if (!existsSync(lessonsDir)) {
  console.log('No lessons written yet.');
  process.exit(0);
}

for (const courseSlug of readdirSync(lessonsDir)) {
  for (const file of readdirSync(join(lessonsDir, courseSlug))) {
    if (!file.endsWith('.mdx')) continue;

    const id = `${courseSlug}/${file.replace(/\.mdx$/, '')}`;
    const raw = readFileSync(join(lessonsDir, courseSlug, file), 'utf8');
    checked += 1;

    if (!known.has(id)) {
      problems.push(`${id}: not a lesson in the syllabus. Check the slug against src/data/syllabus.json.`);
      continue;
    }

    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      problems.push(`${id}: no frontmatter block.`);
      continue;
    }

    let data;
    try {
      data = parse(match[1]);
    } catch (error) {
      problems.push(`${id}: frontmatter is not valid YAML. ${error.message.split('\n')[0]}`);
      continue;
    }

    if (typeof data.oneThing !== 'string' || data.oneThing.length < 10) {
      problems.push(`${id}: oneThing is missing or too short.`);
    }

    if (data.minutes !== undefined && (data.minutes < 1 || data.minutes > 9)) {
      problems.push(`${id}: minutes should be between 1 and 9.`);
    }

    for (const [index, term] of (data.terms ?? []).entries()) {
      if (!term?.term || !term?.plain) problems.push(`${id}: term ${index} needs both "term" and "plain".`);
    }

    const quiz = data.quiz ?? [];
    if (quiz.length !== 4) {
      problems.push(`${id}: expected exactly 4 questions, found ${quiz.length}.`);
    }

    for (const [index, question] of quiz.entries()) {
      if (!question?.question) problems.push(`${id}: question ${index} has no text.`);
      if (!Array.isArray(question?.choices) || question.choices.length < 2) {
        problems.push(`${id}: question ${index} needs at least 2 choices.`);
      } else if (question.choices.some((choice) => typeof choice !== 'string')) {
        // YAML silently turns 2015 and 1.0750 into numbers, which fails the schema.
        problems.push(`${id}: question ${index} has a non-text choice. Wrap numeric choices in quotes.`);
      } else if (
        typeof question.answer !== 'number' ||
        question.answer < 0 ||
        question.answer >= question.choices.length
      ) {
        problems.push(`${id}: question ${index} has an answer index outside its choices.`);
      }
      if (!question?.because) problems.push(`${id}: question ${index} has no explanation.`);
    }
  }
}

const written = checked - problems.length;
console.log(`Checked ${checked} lesson files against ${known.size} syllabus lessons.`);

if (problems.length === 0) {
  console.log(`All good. ${written} lessons valid.`);
  process.exit(0);
}

console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
for (const problem of problems) console.error(`  ${problem}`);
process.exit(1);
