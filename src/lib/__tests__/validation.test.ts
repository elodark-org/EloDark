import { describe, it, expect } from "vitest";
import {
  parsePositiveInt,
  parseNonNegativeInt,
  parseBoundedNumber,
  parsePrice,
  parseRating,
  parseNonEmptyString,
  parseOptionalString,
  isPlainObject,
  sanitizeConfig,
  isValidServiceType,
  VALID_SERVICE_TYPES,
} from "../validation";

describe("parsePositiveInt", () => {
  it("returns number for valid positive integers", () => {
    expect(parsePositiveInt(1)).toBe(1);
    expect(parsePositiveInt(42)).toBe(42);
    expect(parsePositiveInt(999999)).toBe(999999);
  });

  it("returns number for valid string integers", () => {
    expect(parsePositiveInt("1")).toBe(1);
    expect(parsePositiveInt("42")).toBe(42);
    expect(parsePositiveInt(" 10 ")).toBe(10);
  });

  it("returns null for zero", () => {
    expect(parsePositiveInt(0)).toBeNull();
    expect(parsePositiveInt("0")).toBeNull();
  });

  it("returns null for negative numbers", () => {
    expect(parsePositiveInt(-1)).toBeNull();
    expect(parsePositiveInt(-100)).toBeNull();
  });

  it("returns null for floats", () => {
    expect(parsePositiveInt(1.5)).toBeNull();
    expect(parsePositiveInt(0.1)).toBeNull();
  });

  it("returns null for non-numeric strings", () => {
    expect(parsePositiveInt("abc")).toBeNull();
    expect(parsePositiveInt("12.5")).toBeNull();
    expect(parsePositiveInt("")).toBeNull();
    expect(parsePositiveInt(" ")).toBeNull();
    expect(parsePositiveInt("-1")).toBeNull();
  });

  it("returns null for non-string/non-number types", () => {
    expect(parsePositiveInt(null)).toBeNull();
    expect(parsePositiveInt(undefined)).toBeNull();
    expect(parsePositiveInt(true)).toBeNull();
    expect(parsePositiveInt({})).toBeNull();
    expect(parsePositiveInt([])).toBeNull();
  });

  it("returns null for unsafe integers", () => {
    expect(parsePositiveInt(Number.MAX_SAFE_INTEGER + 1)).toBeNull();
    expect(parsePositiveInt(Infinity)).toBeNull();
    expect(parsePositiveInt(NaN)).toBeNull();
  });
});

describe("parseNonNegativeInt", () => {
  it("returns number for valid non-negative integers", () => {
    expect(parseNonNegativeInt(0)).toBe(0);
    expect(parseNonNegativeInt(1)).toBe(1);
    expect(parseNonNegativeInt(100)).toBe(100);
  });

  it("returns number for valid string integers including zero", () => {
    expect(parseNonNegativeInt("0")).toBe(0);
    expect(parseNonNegativeInt("1")).toBe(1);
    expect(parseNonNegativeInt(" 5 ")).toBe(5);
  });

  it("returns null for negative numbers", () => {
    expect(parseNonNegativeInt(-1)).toBeNull();
    expect(parseNonNegativeInt(-100)).toBeNull();
  });

  it("returns null for floats", () => {
    expect(parseNonNegativeInt(1.5)).toBeNull();
  });

  it("returns null for invalid types", () => {
    expect(parseNonNegativeInt(null)).toBeNull();
    expect(parseNonNegativeInt(undefined)).toBeNull();
    expect(parseNonNegativeInt("abc")).toBeNull();
    expect(parseNonNegativeInt({})).toBeNull();
  });
});

describe("parseBoundedNumber", () => {
  it("returns number within bounds", () => {
    expect(parseBoundedNumber(5, 1, 10)).toBe(5);
    expect(parseBoundedNumber(1, 1, 10)).toBe(1);
    expect(parseBoundedNumber(10, 1, 10)).toBe(10);
  });

  it("parses string numbers within bounds", () => {
    expect(parseBoundedNumber("5", 1, 10)).toBe(5);
    expect(parseBoundedNumber("3.14", 0, 10)).toBe(3.14);
  });

  it("returns null for values outside bounds", () => {
    expect(parseBoundedNumber(0, 1, 10)).toBeNull();
    expect(parseBoundedNumber(11, 1, 10)).toBeNull();
    expect(parseBoundedNumber(-1, 0, 10)).toBeNull();
  });

  it("returns null for empty/null/undefined", () => {
    expect(parseBoundedNumber("", 0, 10)).toBeNull();
    expect(parseBoundedNumber("  ", 0, 10)).toBeNull();
    expect(parseBoundedNumber(null, 0, 10)).toBeNull();
    expect(parseBoundedNumber(undefined, 0, 10)).toBeNull();
  });

  it("returns null for non-finite numbers", () => {
    expect(parseBoundedNumber(Infinity, 0, 10)).toBeNull();
    expect(parseBoundedNumber(-Infinity, -10, 10)).toBeNull();
    expect(parseBoundedNumber(NaN, 0, 10)).toBeNull();
    expect(parseBoundedNumber("NaN", 0, 10)).toBeNull();
  });
});

describe("parsePrice", () => {
  it("returns rounded price for valid values", () => {
    expect(parsePrice(9.99)).toBe(9.99);
    expect(parsePrice(100)).toBe(100);
    expect(parsePrice(0.01)).toBe(0.01);
    expect(parsePrice("49.99")).toBe(49.99);
  });

  it("rounds to 2 decimal places", () => {
    expect(parsePrice(9.999)).toBe(10);
    expect(parsePrice(1.005)).toBe(1.01);
    expect(parsePrice(19.994)).toBe(19.99);
  });

  it("returns null for out-of-range values", () => {
    expect(parsePrice(0)).toBeNull();
    expect(parsePrice(0.001)).toBeNull();
    expect(parsePrice(50001)).toBeNull();
    expect(parsePrice(-10)).toBeNull();
  });

  it("returns null for invalid input", () => {
    expect(parsePrice("abc")).toBeNull();
    expect(parsePrice(null)).toBeNull();
    expect(parsePrice(undefined)).toBeNull();
  });
});

describe("parseRating", () => {
  it("returns rating for valid values 1-5", () => {
    expect(parseRating(1)).toBe(1);
    expect(parseRating(3)).toBe(3);
    expect(parseRating(5)).toBe(5);
    expect(parseRating("4")).toBe(4);
  });

  it("returns null for out-of-range values", () => {
    expect(parseRating(0)).toBeNull();
    expect(parseRating(6)).toBeNull();
    expect(parseRating(-1)).toBeNull();
  });

  it("returns null for non-integer values", () => {
    expect(parseRating(3.5)).toBeNull();
    expect(parseRating("2.5")).toBeNull();
  });

  it("returns null for invalid input", () => {
    expect(parseRating(null)).toBeNull();
    expect(parseRating("abc")).toBeNull();
  });
});

describe("parseNonEmptyString", () => {
  it("returns trimmed string for valid input", () => {
    expect(parseNonEmptyString("hello")).toBe("hello");
    expect(parseNonEmptyString("  hello  ")).toBe("hello");
  });

  it("returns null for empty or whitespace-only strings", () => {
    expect(parseNonEmptyString("")).toBeNull();
    expect(parseNonEmptyString("   ")).toBeNull();
  });

  it("returns null for non-string types", () => {
    expect(parseNonEmptyString(123)).toBeNull();
    expect(parseNonEmptyString(null)).toBeNull();
    expect(parseNonEmptyString(undefined)).toBeNull();
    expect(parseNonEmptyString({})).toBeNull();
  });

  it("respects minLength option", () => {
    expect(parseNonEmptyString("ab", { minLength: 3 })).toBeNull();
    expect(parseNonEmptyString("abc", { minLength: 3 })).toBe("abc");
  });

  it("respects maxLength option", () => {
    expect(parseNonEmptyString("hello", { maxLength: 3 })).toBeNull();
    expect(parseNonEmptyString("hi", { maxLength: 3 })).toBe("hi");
  });

  it("respects both minLength and maxLength", () => {
    expect(parseNonEmptyString("ab", { minLength: 3, maxLength: 5 })).toBeNull();
    expect(parseNonEmptyString("abc", { minLength: 3, maxLength: 5 })).toBe("abc");
    expect(parseNonEmptyString("abcdef", { minLength: 3, maxLength: 5 })).toBeNull();
  });
});

describe("parseOptionalString", () => {
  it("returns trimmed string for valid input", () => {
    expect(parseOptionalString("hello")).toBe("hello");
    expect(parseOptionalString("  hello  ")).toBe("hello");
  });

  it("returns null for null/undefined", () => {
    expect(parseOptionalString(null)).toBeNull();
    expect(parseOptionalString(undefined)).toBeNull();
  });

  it("returns null for empty or whitespace strings", () => {
    expect(parseOptionalString("")).toBeNull();
    expect(parseOptionalString("   ")).toBeNull();
  });

  it("returns null for non-string types", () => {
    expect(parseOptionalString(123)).toBeNull();
    expect(parseOptionalString({})).toBeNull();
  });

  it("respects maxLength option", () => {
    expect(parseOptionalString("hello", { maxLength: 3 })).toBeNull();
    expect(parseOptionalString("hi", { maxLength: 3 })).toBe("hi");
  });
});

describe("isPlainObject", () => {
  it("returns true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ key: "value" })).toBe(true);
  });

  it("returns false for arrays", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });
});

describe("sanitizeConfig", () => {
  it("returns the object if input is a plain object", () => {
    const config = { mode: "ranked" };
    expect(sanitizeConfig(config)).toBe(config);
  });

  it("returns empty object for non-object input", () => {
    expect(sanitizeConfig(null)).toEqual({});
    expect(sanitizeConfig("string")).toEqual({});
    expect(sanitizeConfig(42)).toEqual({});
    expect(sanitizeConfig([])).toEqual({});
    expect(sanitizeConfig(undefined)).toEqual({});
  });
});

describe("isValidServiceType", () => {
  it("returns true for all valid service types", () => {
    for (const type of VALID_SERVICE_TYPES) {
      expect(isValidServiceType(type)).toBe(true);
    }
  });

  it("returns false for invalid service types", () => {
    expect(isValidServiceType("invalid")).toBe(false);
    expect(isValidServiceType("")).toBe(false);
    expect(isValidServiceType("ELO-BOOST")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidServiceType(null)).toBe(false);
    expect(isValidServiceType(123)).toBe(false);
    expect(isValidServiceType(undefined)).toBe(false);
  });
});
