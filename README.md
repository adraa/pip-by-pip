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

1. Create the database, once:

   ```bash
   npx wrangler d1 create pip-by-pip
   ```

   Put the returned `database_id` into `wrangler.toml`.

2. Create the schema and load the codes:

   ```bash
   npm run db:remote
   npm run db:seed:remote
   ```

3. Set the two secrets. `AUTH_SALT` must match the one used when generating codes:

   ```bash
   npx wrangler pages secret put AUTH_SALT
   npx wrangler pages secret put SESSION_SECRET
   ```

4. Connect the GitHub repository in the Cloudflare dashboard (Workers & Pages, then Pages). Build command
   `npm run build`, output directory `dist`. Every push to `main` then deploys automatically.

Without those secrets the app falls back to development defaults, which is fine locally and not fine in production.

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

Astro on Cloudflare Pages, Cloudflare D1 for progress, Tailwind for styling, and no UI framework. The interactive
widgets are plain JavaScript, which keeps a lesson page light on a phone.
