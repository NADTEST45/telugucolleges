import { NextResponse } from "next/server";

/*
 * IndexNow key verification — fixed-path route handler.
 *
 * The dynamic [key] route at /indexnow-key/[key] returned 404 in the
 * Vercel deploy (suspected interaction with output:"standalone" + dynamic
 * route handlers). A non-parameterised route handler at a unique path
 * avoids that and always returns the key as text/plain.
 */
export async function GET() {
  return new NextResponse("c153314b7546b33a6566a06402fd1965\n", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
