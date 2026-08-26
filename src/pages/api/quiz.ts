import type { APIRoute } from 'astro';
import { getEnv, saveQuizAnswer } from '../../lib/db';
import { getLesson } from '../../lib/syllabus';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const learner = locals.learner;
  if (!learner) return new Response('Not signed in', { status: 401 });

  const body = (await request.json()) as {
    lesson?: string;
    question?: number;
    choice?: number;
    correct?: boolean;
  };

  if (!body.lesson || !getLesson(body.lesson) || typeof body.question !== 'number' || typeof body.choice !== 'number') {
    return new Response('Bad answer', { status: 400 });
  }

  const env = getEnv(locals);
  await saveQuizAnswer(env.DB, learner.id, body.lesson, body.question, body.choice, body.correct === true);

  return Response.json({ ok: true });
};
