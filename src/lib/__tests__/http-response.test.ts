import { describe, it, expect } from "vitest";
import { extractApiErrorMessage, readResponseBody, parseApiResponse } from "../http-response";

describe("extractApiErrorMessage", () => {
  it("extracts message from object with message field", () => {
    expect(extractApiErrorMessage({ message: "Not found" }, "fallback")).toBe("Not found");
  });

  it("extracts error from object with error field", () => {
    expect(extractApiErrorMessage({ error: "Unauthorized" }, "fallback")).toBe("Unauthorized");
  });

  it("prefers message over error field", () => {
    expect(extractApiErrorMessage({ message: "msg", error: "err" }, "fallback")).toBe("msg");
  });

  it("returns string payload directly", () => {
    expect(extractApiErrorMessage("Server error", "fallback")).toBe("Server error");
  });

  it("returns fallback for non-object non-string", () => {
    expect(extractApiErrorMessage(42, "fallback")).toBe("fallback");
    expect(extractApiErrorMessage(null, "fallback")).toBe("fallback");
    expect(extractApiErrorMessage(undefined, "fallback")).toBe("fallback");
  });

  it("returns fallback for empty message/error fields", () => {
    expect(extractApiErrorMessage({ message: "" }, "fallback")).toBe("fallback");
    expect(extractApiErrorMessage({ message: "   " }, "fallback")).toBe("fallback");
    expect(extractApiErrorMessage({ error: "" }, "fallback")).toBe("fallback");
  });

  it("returns fallback for empty string payload", () => {
    expect(extractApiErrorMessage("", "fallback")).toBe("fallback");
    expect(extractApiErrorMessage("   ", "fallback")).toBe("fallback");
  });

  it("returns fallback for object with non-string fields", () => {
    expect(extractApiErrorMessage({ message: 123 }, "fallback")).toBe("fallback");
    expect(extractApiErrorMessage({ error: true }, "fallback")).toBe("fallback");
  });
});

describe("readResponseBody", () => {
  function makeResponse(body: string, contentType: string, status = 200): Response {
    return new Response(body, {
      status,
      headers: { "content-type": contentType },
    });
  }

  it("parses JSON response", async () => {
    const res = makeResponse('{"key":"value"}', "application/json");
    const result = await readResponseBody(res);
    expect(result).toEqual({ key: "value" });
  });

  it("returns null for invalid JSON with application/json content-type", async () => {
    const res = makeResponse("not json", "application/json");
    const result = await readResponseBody(res);
    expect(result).toBeNull();
  });

  it("parses text that is valid JSON", async () => {
    const res = makeResponse('{"key":"value"}', "text/plain");
    const result = await readResponseBody(res);
    expect(result).toEqual({ key: "value" });
  });

  it("returns plain text for non-JSON text response", async () => {
    const res = makeResponse("plain text", "text/plain");
    const result = await readResponseBody(res);
    expect(result).toBe("plain text");
  });

  it("returns null for empty text response", async () => {
    const res = makeResponse("", "text/plain");
    const result = await readResponseBody(res);
    expect(result).toBeNull();
  });

  it("returns null for whitespace-only text response", async () => {
    const res = makeResponse("   ", "text/plain");
    const result = await readResponseBody(res);
    expect(result).toBeNull();
  });
});

describe("parseApiResponse", () => {
  function makeResponse(body: string, status: number, statusText = ""): Response {
    return new Response(body, {
      status,
      statusText,
      headers: { "content-type": "application/json" },
    });
  }

  it("returns parsed JSON for successful response", async () => {
    const res = makeResponse('{"data":"test"}', 200);
    const result = await parseApiResponse<{ data: string }>(res);
    expect(result).toEqual({ data: "test" });
  });

  it("throws error with message from error response", async () => {
    const res = makeResponse('{"error":"Not found"}', 404, "Not Found");
    await expect(parseApiResponse(res)).rejects.toThrow("Not found");
  });

  it("throws error with statusText as fallback", async () => {
    const res = makeResponse("{}", 500, "Internal Server Error");
    await expect(parseApiResponse(res)).rejects.toThrow("Internal Server Error");
  });

  it("throws error with HTTP status code when no statusText", async () => {
    const res = makeResponse("{}", 500, "");
    await expect(parseApiResponse(res)).rejects.toThrow("HTTP 500");
  });

  it("returns empty object for empty body on success", async () => {
    const res = new Response("", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
    const result = await parseApiResponse(res);
    expect(result).toEqual({});
  });
});
