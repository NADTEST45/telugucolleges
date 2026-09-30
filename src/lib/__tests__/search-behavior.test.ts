import { afterEach, describe, expect, it, vi } from "vitest";
import { createDebouncer, createQueryTracker } from "../debounce";
import { filterCollegeSearchIndex, loadCollegeSearchIndex, type SearchIndexEntry } from "../useCollegeSearch";

const entry: SearchIndexEntry = { id: 1, code: "CBIT", slug: "cbit", name: "Chaitanya Bharathi", district: "Hyderabad", state: "Telangana", type: "Private" };
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("search recovery and cancelled filter work", () => {
  it("cancels stale search navigation when cleared or unmounted", () => {
    vi.useFakeTimers();
    const debouncer = createDebouncer(200);
    const navigate = vi.fn();
    debouncer.schedule(navigate);
    debouncer.cancel();
    vi.advanceTimersByTime(500);
    expect(navigate).not.toHaveBeenCalled();
    debouncer.schedule(() => navigate("old"));
    debouncer.schedule(() => navigate("latest"));
    vi.advanceTimersByTime(200);
    expect(navigate).toHaveBeenCalledExactlyOnceWith("latest");
  });
  it("does not let an older URL response erase newer typing", () => {
    const query = createQueryTracker("");
    query.edit("cb");
    query.submit("cb");
    query.edit("cbit");
    expect(query.acknowledge("cb")).toBe(false);
    expect(query.current).toBe("cbit");
    query.submit("cbit");
    expect(query.acknowledge("cbit")).toBe(true);
    query.reset(); // Browser Back/Forward is external navigation.
    expect(query.acknowledge("cb")).toBe(true);
    expect(query.current).toBe("cb");
  });
  it("trims search and returns an empty set for unmatched queries", () => {
    expect(filterCollegeSearchIndex([entry], "  cbit  ")).toEqual([entry]);
    expect(filterCollegeSearchIndex([entry], "unmatched")).toEqual([]);
    expect(filterCollegeSearchIndex([entry], " ")).toEqual([]);
  });
  it("rejects HTTP failures so a subsequent attempt can recover", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response("Unavailable", { status: 503 }))
      .mockResolvedValueOnce(Response.json({ colleges: [entry] }));
    vi.stubGlobal("fetch", fetch);
    await expect(loadCollegeSearchIndex()).rejects.toThrow("unavailable");
    await expect(loadCollegeSearchIndex()).resolves.toEqual([entry]);
  });
  it("rejects a malformed index instead of treating it as a cached empty result", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ colleges: {} })));
    await expect(loadCollegeSearchIndex()).rejects.toThrow("Invalid search index");
  });
});
