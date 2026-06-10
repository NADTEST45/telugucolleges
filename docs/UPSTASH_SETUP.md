# Upstash Redis setup (rate limiter)

## Why this is needed

The Next.js middleware rate-limits requests against the API and admin
routes. Without a shared store, that limiter falls back to an in-memory
implementation that resets per Vercel serverless instance — which means
on Vercel's fleet it's effectively unbounded. From `.env.example`:

> If unset, middleware falls back to an in-memory limiter that is per-instance
> and ineffective across Vercel's serverless fleet.

Upstash Redis is the recommended shared store. Free tier is plenty for
this site's traffic.

## Steps (5 minutes)

I can't create the Upstash account for you — account creation is not
something I'm allowed to do. The rest I can wire up once you have the
two values.

1. Go to https://console.upstash.com → **Sign up** (Google / GitHub login
   works) → **Create database**.

2. Settings:
   - **Name**: `telugucolleges-ratelimit`
   - **Type**: Regional
   - **Region**: `ap-south-1` (Mumbai) — closest to most users
   - **Plan**: Free (10k commands/day is fine for rate-limit usage)

3. After creation, scroll to **REST API** section. Copy these two values:
   - `UPSTASH_REDIS_REST_URL` (looks like `https://us1-abc-12345.upstash.io`)
   - `UPSTASH_REDIS_REST_TOKEN` (long base64 string)

4. Paste them into `.env.local`:
   ```
   UPSTASH_REDIS_REST_URL=<paste-url>
   UPSTASH_REDIS_REST_TOKEN=<paste-token>
   ```

5. Add the same two variables in Vercel:
   - Vercel → telugucolleges → Settings → Environment Variables
   - **Add Environment Variable** → key/value, scope to Production + Preview
   - Mark `UPSTASH_REDIS_REST_TOKEN` as **Sensitive**

6. Redeploy production from Vercel (or just push the next commit).

Once those vars are set in production, the middleware will switch to the
distributed limiter automatically — no code change needed.
