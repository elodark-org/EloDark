import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const TEST_SECRET = "test-jwt-secret-key";

function makeRequest(authHeader?: string): NextRequest {
  const headers = new Headers();
  if (authHeader) {
    headers.set("authorization", authHeader);
  }
  return new NextRequest("http://localhost:3000/api/test", { headers });
}

function signToken(payload: Record<string, unknown>, secret = TEST_SECRET) {
  return jwt.sign(payload, secret);
}

describe("verifyToken", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", TEST_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns payload for a valid token", async () => {
    const { verifyToken } = await import("../auth");
    const token = signToken({ id: 1, name: "Test", email: "test@test.com", role: "user" });
    const req = makeRequest(`Bearer ${token}`);
    const result = verifyToken(req);
    expect(result).toMatchObject({ id: 1, name: "Test", email: "test@test.com", role: "user" });
  });

  it("returns null when no authorization header", async () => {
    const { verifyToken } = await import("../auth");
    const req = makeRequest();
    expect(verifyToken(req)).toBeNull();
  });

  it("returns null when header does not start with Bearer", async () => {
    const { verifyToken } = await import("../auth");
    const req = makeRequest("Basic abc123");
    expect(verifyToken(req)).toBeNull();
  });

  it("returns null for an invalid token", async () => {
    const { verifyToken } = await import("../auth");
    const req = makeRequest("Bearer invalid.token.here");
    expect(verifyToken(req)).toBeNull();
  });

  it("returns null for a token signed with wrong secret", async () => {
    const { verifyToken } = await import("../auth");
    const token = signToken({ id: 1, name: "Test", email: "test@test.com", role: "user" }, "wrong-secret");
    const req = makeRequest(`Bearer ${token}`);
    expect(verifyToken(req)).toBeNull();
  });

  it("returns null when JWT_SECRET is not configured", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const { verifyToken } = await import("../auth");
    const token = signToken({ id: 1, name: "Test", email: "test@test.com", role: "user" });
    const req = makeRequest(`Bearer ${token}`);
    expect(verifyToken(req)).toBeNull();
  });
});

describe("requireAuth", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", TEST_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns user payload for valid token", async () => {
    const { requireAuth } = await import("../auth");
    const token = signToken({ id: 1, name: "Test", email: "test@test.com", role: "user" });
    const req = makeRequest(`Bearer ${token}`);
    const result = requireAuth(req);
    expect(result).toMatchObject({ id: 1, role: "user" });
  });

  it("returns 401 response when token is missing", async () => {
    const { requireAuth } = await import("../auth");
    const req = makeRequest();
    const result = requireAuth(req);
    expect(result).toHaveProperty("status", 401);
  });

  it("returns 401 response when token is invalid", async () => {
    const { requireAuth } = await import("../auth");
    const req = makeRequest("Bearer bad-token");
    const result = requireAuth(req);
    expect(result).toHaveProperty("status", 401);
  });
});

describe("requireRole", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", TEST_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns user payload when role matches", async () => {
    const { requireRole } = await import("../auth");
    const token = signToken({ id: 1, name: "Admin", email: "admin@test.com", role: "admin" });
    const req = makeRequest(`Bearer ${token}`);
    const result = requireRole(req, "admin");
    expect(result).toMatchObject({ id: 1, role: "admin" });
  });

  it("returns user payload when role is in allowed list", async () => {
    const { requireRole } = await import("../auth");
    const token = signToken({ id: 2, name: "Booster", email: "booster@test.com", role: "booster" });
    const req = makeRequest(`Bearer ${token}`);
    const result = requireRole(req, "admin", "booster");
    expect(result).toMatchObject({ id: 2, role: "booster" });
  });

  it("returns 403 when role does not match", async () => {
    const { requireRole } = await import("../auth");
    const token = signToken({ id: 1, name: "User", email: "user@test.com", role: "user" });
    const req = makeRequest(`Bearer ${token}`);
    const result = requireRole(req, "admin");
    expect(result).toHaveProperty("status", 403);
  });

  it("returns 401 when no token provided", async () => {
    const { requireRole } = await import("../auth");
    const req = makeRequest();
    const result = requireRole(req, "admin");
    expect(result).toHaveProperty("status", 401);
  });
});

describe("isUser", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", TEST_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns true for user payload", async () => {
    const { requireAuth, isUser } = await import("../auth");
    const token = signToken({ id: 1, name: "Test", email: "test@test.com", role: "user" });
    const req = makeRequest(`Bearer ${token}`);
    const result = requireAuth(req);
    expect(isUser(result)).toBe(true);
  });

  it("returns false for NextResponse (error)", async () => {
    const { requireAuth, isUser } = await import("../auth");
    const req = makeRequest();
    const result = requireAuth(req);
    expect(isUser(result)).toBe(false);
  });
});
