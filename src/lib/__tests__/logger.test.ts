import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../logger";

describe("logger", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logger.info writes to console.info with JSON payload", () => {
    logger.info("test message");
    expect(infoSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe("info");
    expect(payload.message).toBe("test message");
    expect(payload.ts).toBeDefined();
  });

  it("logger.warn writes to console.warn", () => {
    logger.warn("warning message");
    expect(warnSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe("warn");
    expect(payload.message).toBe("warning message");
  });

  it("logger.error writes to console.error", () => {
    logger.error("error message");
    expect(errorSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe("error");
    expect(payload.message).toBe("error message");
  });

  it("logger.info includes context when provided", () => {
    logger.info("with context", { userId: 1, action: "login" });
    const payload = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(payload.context).toEqual({ userId: 1, action: "login" });
  });

  it("logger.error serializes Error objects", () => {
    const err = new Error("something went wrong");
    logger.error("failure", err);
    const payload = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(payload.context.error.name).toBe("Error");
    expect(payload.context.error.message).toBe("something went wrong");
    expect(payload.context.error.stack).toBeDefined();
  });

  it("logger.error merges error and context", () => {
    const err = new Error("fail");
    logger.error("failure", err, { orderId: 42 });
    const payload = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(payload.context.orderId).toBe(42);
    expect(payload.context.error.message).toBe("fail");
  });

  it("handles bigint values in context", () => {
    logger.info("bigint test", { value: BigInt(123) });
    const payload = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(payload.context.value).toBe("123");
  });

  it("handles circular references gracefully", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    logger.info("circular test", { data: circular });
    const payload = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(payload.context).toEqual({ message: "context_not_serializable" });
  });
});
