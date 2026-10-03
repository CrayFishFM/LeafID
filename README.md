# LeafID

A web app for learning to identify Ontario tree species by their leaves. It covers the 26 species on the Ontario tree ID list (Mh, Mr, Ms, Mm, Mp, Or, Ow, Ob, Be, Iw, Bw, By, Al, Ew, Bd, Aw, Ab, Elderberry, Am, Bn, Wb, Staghorn sumac, Pl, Pt, Pb, Pd).

- **Learn** – field guide per species: key leaf features, field clues, look-alikes with "how to tell them apart" tips, and photos.
- **Practice** – photo quiz in 10-question rounds. Species you get wrong (or haven't seen) come up more often, wrong options are drawn from look-alikes and your own past mix-ups, and every answer is explained. Up to three progressive hints per question.
- **Progress** – accuracy, mastery per species and group, most-confused pairs, and personalised suggestions for what to study next.
- **Community** – upload your own leaf photos. Other users identify them blind (before seeing your claim). A photo is verified once at least 3 other people have voted and 70% of all IDs (including the uploader's) agree; verified photos join everyone's quiz.

Mobile-first, with light and dark themes (follows the device by default; toggle in the header).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, server actions)
- [Better Auth](https://better-auth.com) – email + password accounts
- SQLite via `better-sqlite3` – one file at `data/leafid.db`; uploaded photos in `data/uploads/`

Database tables (Better Auth's and the app's) are created automatically on server start (`src/instrumentation.ts`).

## Getting started

```bash
npm install
cp .env.example .env.local   # then set BETTER_AUTH_SECRET (command in the file)
npm run dev
```

Open http://localhost:3000 and create an account.

For production: `npm run build && npm start`, and set `BETTER_AUTH_URL` to the public URL. The app needs a persistent disk for `data/` (set `DATA_DIR` to move it), so host it on a VPS, Railway, Fly.io or similar — not a serverless platform with an ephemeral filesystem.

## Project layout

| Path | What |
| --- | --- |
| `src/data/species.ts` | All species content: codes, traits, key features, look-alike tips |
| `src/data/image-credits.json` | Attribution for every library photo |
| `public/leaves/<code>/` | Library photos (Wikimedia Commons, CC/PD licensed) |
| `src/lib/quiz.ts` | Adaptive question selection and hints |
| `src/lib/progress.ts` | Attempt history → mastery, confusions, streaks |
| `src/lib/suggestions.ts` | "How to improve" suggestions |
| `src/lib/community.ts` | Uploads, voting and consensus rules |
| `scripts/fetch-images.mjs` | Downloads/attributes photos from Wikimedia Commons |

## Photos

Library photos come from Wikimedia Commons; each photo's author and license are shown under it in the field guide and quiz. To add more:

```bash
node scripts/fetch-images.mjs --add Pt "File:Some photo.jpg"   # add specific Commons files
node scripts/fetch-images.mjs --prune                          # after deleting files, drop their credits
```
