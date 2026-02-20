import { isPlainObject } from "./validation";

export function extractApiErrorMessage(
  payload: unknown,
  fallback: string
): string {
  if (isPlainObject(payload)) {
    const message = payload.message;
    if (typeof message === "string" && message.trim()) return message;

    const error = payload.error;
    if (typeof error === "string" && error.trim()) return error;
  }

  if (typeof payload === "string" && payload.trim()) return payload;
  return fallback;
}

export async function readResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  const text = await res.text().catch(() => "");
  if (!text.trim()) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function parseApiResponse<T>(res: Response): Promise<T> {
  const payload = await readResponseBody(res);

  if (!res.ok) {
    const fallback = res.statusText || `HTTP ${res.status}`;
    throw new Error(extractApiErrorMessage(payload, fallback));
  }

  if (payload === null || payload === undefined || payload === "") {
    return {} as T;
  }

  return payload as T;
}
