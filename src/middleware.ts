import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, readSessionToken } from './lib/auth';
import { findLearnerById, getEnv, sessionSecret } from './lib/db';

/** Everything else on the site sits behind the code. */
const OPEN_PATHS = new Set(['/enter', '/api/enter', '/api/leave', '/favicon.svg', '/robots.txt']);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith('/_') || pathname.startsWith('/fonts/')) {
    return next();
  }

  let env;
  try {
    env = getEnv(context.locals);
  } catch {
    // Without a database there is nothing to authenticate against. Let the page
    // render so the error is legible instead of a blank 500.
    context.locals.learner = null;
    return next();
  }

  const token = context.cookies.get(SESSION_COOKIE)?.value;
  const learnerId = token ? await readSessionToken(token, sessionSecret(env)) : null;
  const learner = learnerId ? await findLearnerById(env.DB, learnerId) : null;

  context.locals.learner = learner;

  if (!learner && !OPEN_PATHS.has(pathname)) {
    const target = pathname === '/' ? '/enter' : `/enter?next=${encodeURIComponent(pathname + context.url.search)}`;
    return context.redirect(target, 302);
  }

  if (learner && pathname === '/enter') {
    return context.redirect('/', 302);
  }

  return next();
});
