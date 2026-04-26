import { NextResponse } from "next/server";

/*
 * IndexNow key verification endpoint.
 *
 * The IndexNow protocol (Bing, Yandex, Naver, Seznam, Yep) requires the
 * site to host a small text file whose body equals the key, reachable
 * at a stable URL on the same host. Search engines fetch this file to
 * verify the submitter owns the domain.
 *
 * We tried the recommended `public/<KEY>.txt` location first, but our
 * Vercel deploy with `output: "standalone"` returned cached 404s for
 * the static asset path. A route handler is contractually equivalent
 * for IndexNow's purposes and isn't subject to that caching path.
 *
 * Behaviour:
 *   - If the URL key matches the configured key → 200 text/plain with
 *     the key as the body (exactly what IndexNow expects).
 *   - Otherwise → 404. We do not leak the configured key from this
 *     endpoint; the caller must already know it.
 */

const INDEXNOW_KEY = "c153314b7546b33a6566a06402fd1965";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  if (key !== INDEXNOW_KEY) {
    return new NextResponse("Not Found", { status: 404 });
  }
  // IndexNow's key check is strict: body must equal the key exactly, no
  // trailing newline. The earlier `${KEY}\n` form caused a 422 from
  // api.indexnow.org with errorCode "InvalidRequestParameters".
  return new NextResponse(INDEXNOW_KEY, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
