# Pip by Pip

A private, plain-English study site for the [BabyPips School of Pipsology](https://www.babypips.com/learn/forex).

The course structure is BabyPips': the same 11 courses, the same grades, the same 456 lesson titles, in the same
order, nothing added or removed. Every explanation is written from scratch here, in layman's terms, built around a
picture rather than a wall of text. Each lesson links back to the original as its source.

Not affiliated with BabyPips. Educational material, not financial advice.

## What it does

- All 456 lessons, navigable, in the original order.
- Each written lesson opens with the single core idea, leads with a diagram or interactive widget, uses an everyday
  comparison, works through real numbers, and ends with four quick questions and a jargon box.
- Private: the whole site sits behind a short sign-in code. Each learner has their own.
- Progress, quiz answers and your place in the course are stored server-side, so they follow you from phone to laptop.
- A `Together` page showing both learners side by side, plus a quiet weekly recap on the home page.
- Light and dark mode. Designed phone-first.

## Running it locally

Requires Node 22 or newer.

```bash
npm install
npm run setup     # creates the local database, generates codes, loads them
npm run dev       # http://localhost:41720
```

`npm run setup` prints the sign-in codes once. Write them down; only hashes are stored.

To choose your own codes instead of generated ones:

```bash
node scripts/make-codes.mjs "Dheepan:harbour-lamp-17" "Wife:paper-kite-23"
npm run db:seed:local
```

Codes are compared case-insensitively and ignore spaces and dashes, so `Harbour Lamp 17` and `harbour-lamp-17` are the
same code. A third `Recovery` code is always generated as a way back in if a code is forgotten.

## Deploying to Cloudflare

The app is a Cloudflare Worker (Astro SSR + static assets) with a D1 database named `pip-by-pip`. `wrangler.toml` already has the database id.

From a machine that is logged in to Wrangler (`npx wrangler login`, or `CLOUDFLARE_API_TOKEN` plus `CLOUDFLARE_ACCOUNT_ID`):

```bash
npx wrangler d1 execute pip-by-pip --remote --file=./schema.sql
npx wrangler d1 execute pip-by-pip --remote --file=./scripts/seed-learners.sql
npx wrangler secret put AUTH_SALT
npx wrangler secret put SESSION_SECRET
npm run deploy
```

`AUTH_SALT` must match the salt used for the hashes in `scripts/seed-learners.sql` (the local default is `pip-by-pip-dev-salt`). Without those secrets the Worker falls back to development defaults, which is not fine in production.

CI: connect the GitHub repo to Workers Builds. Build command `npm run build`, deploy command `npx wrangler deploy`.

## How the content is organised

| Path                       | What it holds                                                        |
| -------------------------- | -------------------------------------------------------------------- |
| `src/data/syllabus.json`   | The 456 lesson titles, grades and source links, in order              |
| `src/data/blurbs.ts`       | Our own descriptions of each course and section                       |
| `src/content/lessons/`     | One MDX file per written lesson, `<course>/<lesson>.mdx`              |
| `src/components/mdx/`      | The diagram and widget kit lessons are built from                     |
| `scripts/parse-syllabus.py`| Regenerates `syllabus.json` from the BabyPips course pages            |

A lesson file carries its own metadata: the one core idea, reading time, jargon terms, and exactly four questions.
Lessons that have not been written yet still appear in the navigation and link to the original.

## Stack

Astro on Cloudflare Workers, Cloudflare D1 for progress, Tailwind for styling, and no UI framework. The interactive
widgets are plain JavaScript, which keeps a lesson page light on a phone.
