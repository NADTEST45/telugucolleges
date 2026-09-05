/** Bound anonymous JSON submissions before buffering or touching the database. */
export class RequestBodyError extends Error {
  constructor(message: string, public status: 400 | 413 | 415) {
    super(message);
  }
}

export async function readJsonObject(request: Request, maxBytes = 16_384): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new RequestBodyError("Content-Type must be application/json", 415);
  }
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && Number(declaredLength) > maxBytes) {
    throw new RequestBodyError("Request body is too large", 413);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new RequestBodyError("A JSON object is required", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new RequestBodyError("Request body is too large", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let value: unknown;
  try {
    value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new RequestBodyError("Invalid JSON body", 400);
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new RequestBodyError("A JSON object is required", 400);
  }
  return value as Record<string, unknown>;
}
