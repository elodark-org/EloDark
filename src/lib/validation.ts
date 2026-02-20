export const VALID_SERVICE_TYPES = [
  "elo-boost",
  "duo-boost",
  "md10",
  "wins",
  "coach",
] as const;

export type ServiceType = (typeof VALID_SERVICE_TYPES)[number];

const INTEGER_PATTERN = /^\d+$/;

export function parsePositiveInt(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value <= 0) return null;
    return value;
  }

  if (typeof value !== "string") return null;

  const normalized = value.trim();
  if (!INTEGER_PATTERN.test(normalized)) return null;

  const parsed = Number(normalized);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

export function parseNonNegativeInt(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value < 0) return null;
    return value;
  }

  if (typeof value !== "string") return null;

  const normalized = value.trim();
  if (!INTEGER_PATTERN.test(normalized)) return null;

  const parsed = Number(normalized);
  if (!Number.isSafeInteger(parsed) || parsed < 0) return null;
  return parsed;
}

export function parseBoundedNumber(
  value: unknown,
  min: number,
  max: number
): number | null {
  if (typeof value === "string" && value.trim() === "") return null;
  if (value === null || value === undefined) return null;

  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < min || parsed > max) return null;
  return parsed;
}

export function parsePrice(value: unknown): number | null {
  const parsed = parseBoundedNumber(value, 0.01, 50000);
  if (parsed === null) return null;
  return Math.round((parsed + Number.EPSILON) * 100) / 100;
}

export function parseRating(value: unknown): number | null {
  const parsed = parsePositiveInt(value);
  if (parsed === null || parsed < 1 || parsed > 5) return null;
  return parsed;
}

export function parseNonEmptyString(
  value: unknown,
  options?: { minLength?: number; maxLength?: number }
): string | null {
  if (typeof value !== "string") return null;
  const minLength = options?.minLength ?? 1;
  const maxLength = options?.maxLength;
  const normalized = value.trim();
  if (normalized.length < minLength) return null;
  if (typeof maxLength === "number" && normalized.length > maxLength) return null;
  return normalized;
}

export function parseOptionalString(
  value: unknown,
  options?: { maxLength?: number }
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  if (
    typeof options?.maxLength === "number" &&
    normalized.length > options.maxLength
  ) {
    return null;
  }
  return normalized;
}

export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function sanitizeConfig(value: unknown): Record<string, unknown> {
  return isPlainObject(value) ? value : {};
}

export function isValidServiceType(value: unknown): value is ServiceType {
  return (
    typeof value === "string" &&
    (VALID_SERVICE_TYPES as readonly string[]).includes(value)
  );
}
