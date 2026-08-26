import type { APIRoute } from 'astro';
import { SESSION_COOKIE, createSessionToken, hashCode } from '../../lib/auth';
import { authSalt, findLearnerByCodeHash, getEnv, sessionSecret } from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, locals, url }) => {
  const form = await request.formData();
  const code = String(form.get('code') ?? '');
  const next = String(form.get('next') ?? '');

  if (!code.trim()) {
    return redirect('/enter?error=1', 303);
  }

  const env = getEnv(locals);
  const learner = await findLearnerByCodeHash(env.DB, await hashCode(code, authSalt(env)));

  if (!learner) {
    // Slow failed attempts down a little so the code cannot be brute-forced quickly.
    await new Promise((resolve) => setTimeout(resolve, 600));
    const suffix = next ? `&next=${encodeURIComponent(next)}` : '';
    return redirect(`/enter?error=1${suffix}`, 303);
  }

  cookies.set(SESSION_COOKIE, await createSessionToken(learner.id, sessionSecret(env)), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    maxAge: 365 * 24 * 60 * 60,
  });

  const destination = next.startsWith('/') ? next : '/';
  return redirect(destination, 303);
};
