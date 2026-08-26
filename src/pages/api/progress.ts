import type { APIRoute } from 'astro';
import { getEnv, setLessonComplete } from '../../lib/db';
import { getLesson } from '../../lib/syllabus';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const learner = locals.learner;
  if (!learner) return new Response('Not signed in', { status: 401 });

  const body = (await request.json()) as { lesson?: string; complete?: boolean };
  if (!body.lesson || !getLesson(body.lesson)) {
    return new Response('Unknown lesson', { status: 400 });
  }

  const env = getEnv(locals);
  await setLessonComplete(env.DB, learner.id, body.lesson, body.complete !== false);

  return Response.json({ ok: true, complete: body.complete !== false });
};
