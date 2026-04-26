#!/usr/bin/env node
/*
 * IndexNow batch submitter.
 *
 * IndexNow is a free protocol supported by Bing, Yandex, Naver, Seznam,
 * and Yep. One POST per call, up to 10,000 URLs per batch. Bing and
 * Yandex typically index URLs within 24h.
 *
 * Google does not currently support IndexNow — for Google we rely on:
 *   - The sitemap (auto-fetched), and
 *   - Manual GSC URL Inspection (limited to ~10/day).
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs           # submits everything
 *   node scripts/indexnow-submit.mjs --new     # only the new SEO surfaces
 *
 * Requirements:
 *   - public/<KEY>.txt must exist and be served at https://<HOST>/<KEY>.txt
 *     (it's already committed in this repo for our key)
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFile } from "fs/promises";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = "telugucolleges.com";
const KEY = "c153314b7546b33a6566a06402fd1965";
// We serve the key from a Next.js route handler instead of public/<KEY>.txt
// because Vercel's standalone-output deploy was caching 404s for the
// static asset path. The route handler is contractually equivalent for
// IndexNow — same host, text/plain, body is the key.
const KEY_LOCATION = `https://${HOST}/${KEY}-indexnow`;
const BASE = `https://${HOST}`;

/**
 * Build the URL list. We keep this self-contained (re-implements slug
 * generation) instead of importing the TS modules so the script works
 * standalone without a TS toolchain. The slugs match the canonical
 * generators on the server side.
 */
async function buildUrlList(filterMode) {
  const urls = new Set();

  // 1. Top-level pages — always include
  const TOP_LEVEL = [
    "/", "/colleges", "/branches", "/universities", "/eapcet",
    "/news", "/compare", "/best-colleges", "/about", "/contact",
    "/privacy", "/terms", "/programs",
  ];
  TOP_LEVEL.forEach(p => urls.add(`${BASE}${p}`));

  // 2. Rank-band pages — read directly from rank-band-data
  const RANK_BANDS = [1000, 2500, 5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000];
  const BRANCHES = ["cse", "ece", "eee", "mech", "civil"];
  const STATES = ["telangana", "andhra-pradesh"];
  for (const r of RANK_BANDS) {
    for (const b of BRANCHES) {
      for (const s of STATES) {
        urls.add(`${BASE}/eapcet/rank/${r}-${b}-${s}`);
      }
    }
  }

  // 3. News permalinks — read NEWS_ITEMS ids from the source
  // We just grep the slugs; cheaper than importing the TS module.
  try {
    const newsSrc = await readFile(join(__dirname, "..", "src", "lib", "news.ts"), "utf8");
    const ids = [...newsSrc.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map(m => m[1]);
    for (const id of ids) urls.add(`${BASE}/news/${id}`);
  } catch (err) {
    console.warn("Could not read news.ts:", err.message);
  }

  // 4. Comparison pairs and college pages: there are ~600 + ~860 of them.
  // Include them all in --full mode; in --new mode skip and rely on
  // sitemap discovery (most of these were already submitted earlier).
  if (filterMode !== "new") {
    try {
      const collegesSrc = await readFile(join(__dirname, "..", "src", "lib", "colleges.ts"), "utf8");
      const slugs = [...collegesSrc.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
      for (const s of slugs) {
        urls.add(`${BASE}/colleges/${s}`);
        urls.add(`${BASE}/colleges/${s}/fees`);
        urls.add(`${BASE}/colleges/${s}/cutoff`);
        urls.add(`${BASE}/colleges/${s}/placement`);
        urls.add(`${BASE}/colleges/${s}/admission`);
      }
    } catch (err) {
      console.warn("Could not read colleges.ts:", err.message);
    }
  }

  return [...urls];
}

async function submitBatch(urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return { status: res.status, body: await res.text() };
}

async function main() {
  const filterMode = process.argv.includes("--new") ? "new" : "full";
  console.log(`IndexNow submission — mode: ${filterMode}`);
  console.log(`Endpoint: https://api.indexnow.org/indexnow`);
  console.log(`Host: ${HOST}, key: ${KEY.slice(0, 8)}…`);

  const urls = await buildUrlList(filterMode);
  console.log(`Total URLs to submit: ${urls.length}`);

  // IndexNow caps at 10,000 URLs per call. We're well under that, but
  // batch in case the corpus grows.
  const BATCH_SIZE = 5000;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    process.stdout.write(`  Submitting batch ${i / BATCH_SIZE + 1} (${batch.length} URLs)... `);
    const { status, body } = await submitBatch(batch);
    console.log(`HTTP ${status}${body ? ` — ${body.slice(0, 200)}` : ""}`);
    if (status !== 200 && status !== 202) {
      console.error(`  Non-success status. Stopping.`);
      process.exit(1);
    }
  }
  console.log("Done.");
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
