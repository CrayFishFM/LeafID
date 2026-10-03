# LeafID

A web app for learning to identify Ontario tree species by their leaves. It covers the 26 species on the Ontario tree ID list (Mh, Mr, Ms, Mm, Mp, Or, Ow, Ob, Be, Iw, Bw, By, Al, Ew, Bd, Aw, Ab, Elderberry, Am, Bn, Wb, Staghorn sumac, Pl, Pt, Pb, Pd).

- **Learn** – field guide per species: key leaf features, field clues, look-alikes with "how to tell them apart" tips, and photos.
- **Practice** – photo quiz in 10-question rounds. Species you get wrong (or haven't seen) come up more often, wrong options are drawn from look-alikes and your own past mix-ups, and every answer is explained. Up to three progressive hints per question.
- **Progress** – accuracy, mastery per species and group, most-confused pairs, and personalised suggestions for what to study next.
- **Community** – upload your own leaf photos. Other users identify them blind (before seeing your claim). A photo is verified as soon as one other person agrees with the uploader (if people disagree, it waits until 70% of all IDs, including the uploader's, match); verified photos join everyone's quiz. Admins can approve their own uploads immediately.
- **Admin dashboard** (`/admin`) – activity chart and stats, hardest species and most common mix-ups across all learners, user management (make/remove admin, ban with reason, delete with all data), photo moderation (approve as a species, reject, reset votes, delete — admin decisions are final), and email status with a test-send button.
- **No account needed** – visitors get a guest session automatically and can use everything: practice, progress, uploads and votes. Signing up or signing in later (email or Discord) moves all of it to the account. Guests whose session ended without uploading or voting are cleaned up daily.
- **Accounts** – email + password (with verification and password reset by email) or Discord login.
- **Account page** (`/account`) – change display name and email, change or set a password, link/unlink Discord, see signed-in devices and sign them out, and delete the account with all its data.

Mobile-first, with light and dark themes (follows the device by default; toggle in the header).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, server actions)
- [Better Auth](https://better-auth.com) – email + password accounts, admin plugin for roles and bans
- [Hostinger Mail API SDK](https://github.com/hostinger/mail-api-typescript-sdk) (`@hostinger/mail-sdk`) – verification and password-reset emails
- MySQL / MariaDB via `mysql2` – connection set with `MYSQL_*` in `.env.local`; uploaded photos are files in `data/uploads/`

Database tables (Better Auth's and the app's) are created automatically on server start (`src/instrumentation.ts`).

## Getting started

```bash
npm install
cp .env.example .env.local   # then set BETTER_AUTH_SECRET and the MYSQL_* connection
npm run dev
```

Open http://localhost:3000 and create an account.

### Becoming an admin

Put your email in `ADMIN_EMAILS` in `.env.local` (comma-separate several) and restart. Matching accounts are promoted on server start, and new sign-ups with those emails become admins automatically. Admins see an **Admin** button in the header; from the dashboard they can promote other users.

### Discord login

1. Create an application at https://discord.com/developers/applications and open **OAuth2**.
2. Add the redirect `<BETTER_AUTH_URL>/api/auth/callback/discord` (e.g. `http://localhost:3000/api/auth/callback/discord` locally, and your real domain in production).
3. Copy the client ID and secret into `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` in `.env.local` and restart. The "Continue with Discord" button appears once both are set.

### Email (Hostinger)

1. In Hostinger's email panel, create a Mail API token for the mailbox to send from (e.g. `no-reply@yourdomain`).
2. Set `HOSTINGER_MAIL_TOKEN` in `.env.local`. `HOSTINGER_MAILBOX_ID` is optional — without it the first mailbox the token can manage is used. `MAIL_FROM_NAME` sets the sender name.
3. Set `BETTER_AUTH_URL` to the public site URL so links in emails work.
4. Restart, then use **Admin → Email → Send me a test email**.

With a token set, new accounts must confirm their email before they can sign in. Without one (local development), verification is not required and emails are printed to the server log instead — copy reset links from there.

For production: `npm run build && npm start`, and set `BETTER_AUTH_URL` to the public URL. The database must already exist (tables are created on first start). The app also needs a persistent disk for uploaded photos in `data/` (set `DATA_DIR` to move it), so host it on a VPS, Railway, Fly.io or similar — not a serverless platform with an ephemeral filesystem.

## Project layout

| Path | What |
| --- | --- |
| `src/data/species.ts` | All species content: codes, traits, key features, look-alike tips |
| `src/data/image-credits.json` | Attribution for every library photo |
| `public/leaves/<code>/` | Library photos (Wikimedia Commons, CC/PD licensed) |
| `src/lib/quiz.ts` | Adaptive question selection and hints |
| `src/lib/progress.ts` | Attempt history → mastery, confusions, streaks |
| `src/lib/suggestions.ts` | "How to improve" suggestions |
| `src/lib/community.ts` | Uploads, voting, consensus rules and moderation |
| `src/lib/mail.ts` | Hostinger Mail sending and email templates |
| `src/lib/admin.ts` | Dashboard stats and user listing |
| `src/lib/guests.ts` | Moving guest data to a new account; guest cleanup |
| `src/app/admin/` | Admin dashboard pages and server actions |
| `scripts/fetch-images.mjs` | Downloads/attributes photos from Wikimedia Commons |

## Photos

Library photos come from Wikimedia Commons; each photo's author and license are shown under it in the field guide and quiz. To add more:

```bash
node scripts/fetch-images.mjs --add Pt "File:Some photo.jpg"   # add specific Commons files
node scripts/fetch-images.mjs --prune                          # after deleting files, drop their credits
```
