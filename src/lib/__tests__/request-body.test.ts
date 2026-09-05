import { describe, expect, it, vi } from "vitest";
import { readJsonObject } from "../request-body";

function request(body: string, headers: Record<string, string> = {}) {
  return new Request("https://example.com/api/report", {
    method: "POST", headers: { "content-type": "application/json", ...headers }, body,
  });
}

describe("anonymous JSON submission limits", () => {
  it("accepts an object but rejects malformed, null and array bodies as client errors", async () => {
    await expect(readJsonObject(request('{"message":"hello"}'))).resolves.toEqual({ message: "hello" });
    for (const body of ["{", "null", "[]", '"text"', "123"]) {
      await expect(readJsonObject(request(body))).rejects.toMatchObject({ status: 400 });
    }
    await expect(readJsonObject(request("{}", { "content-type": "text/plain" }))).rejects.toMatchObject({ status: 415 });
  });

  it("enforces actual byte size even without a reliable Content-Length", async () => {
    for (const headers of [{}, { "content-length": "1" }] as Record<string, string>[]) {
      await expect(readJsonObject(request('{"value":"తెలుగు"}', headers), 20)).rejects.toMatchObject({ status: 413 });
    }
    await expect(readJsonObject(request("{}", { "content-length": "20000" }))).rejects.toMatchObject({ status: 413 });
  });

  it("cancels an oversized streamed request without reading it to completion", async () => {
    const cancel = vi.fn();
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) { controller.enqueue(new Uint8Array(100)); }, cancel,
    });
    const req = new Request("https://example.com", {
      method: "POST", body: stream, headers: { "content-type": "application/json" }, duplex: "half",
    } as RequestInit);
    await expect(readJsonObject(req, 10)).rejects.toMatchObject({ status: 413 });
    expect(cancel).toHaveBeenCalledOnce();
  });
});
