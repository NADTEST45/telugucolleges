/**
 * GET /api/search-index — slim, CDN-cacheable college list for the header
 * SearchBar. Exists so the global layout's search never bundles the full
 * COLLEGES dataset (~320 KB) into every page's client JS: the client fetches
 * this on first focus instead. Only the fields the search UI renders.
 */
import { NextResponse } from "next/server";
import { COLLEGES } from "@/lib/colleges";

export interface SearchIndexEntry {
  id: number;
  slug: string;
  name: string;
  code: string;
  district: string;
  state: string;
  type: string;
}

export async function GET() {
  const index: SearchIndexEntry[] = COLLEGES.map(c => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    code: c.code,
    district: c.district,
    state: c.state,
    type: c.type,
  }));
  return NextResponse.json(
    { colleges: index },
    {
      headers: {
        // Static data — cache hard at the CDN; a deploy invalidates it.
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
