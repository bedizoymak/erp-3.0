import { describe, expect, it } from "vitest";
import {
  GEAR_LIST_TAKSIMAT,
  GEAR_LIST_HELICAL,
  findSpurCombinations,
  findTaksimatCombinations,
  findHelicalCombinations,
  isValidTwoGear,
  isValidFourGear,
} from "./gearCombinations";

/**
 * Numerical parity check against commit 0f71e8c2de417c5ebc9f6eb11c2bc66fa14a7a82.
 * The gear inventories and the expected matches below were derived independently
 * (brute-force in Python over the same two arrays), not from this module's output.
 */
describe("gear inventories are the exact restored lists", () => {
  it("GEAR_LIST_TAKSIMAT has the documented 41 entries", () => {
    expect(GEAR_LIST_TAKSIMAT).toEqual([
      24, 25, 30, 30, 32, 33, 34, 36, 40, 41, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
      63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 75, 76, 80, 85, 90, 90, 94, 96,
    ]);
  });

  it("GEAR_LIST_HELICAL has the documented 31 entries", () => {
    expect(GEAR_LIST_HELICAL).toEqual([
      22, 23, 23, 24, 25, 28, 30, 32, 35, 36, 38, 40, 42, 42, 44, 45, 46, 47, 47, 49, 50, 52, 53,
      54, 55, 58, 60, 69, 75, 80, 89,
    ]);
  });
});

function combinationRatio(c: { a: number; b: number; c: number | null; d: number | null }) {
  return c.c !== null && c.d !== null ? (c.a * c.c) / (c.b * c.d) : c.a / c.b;
}

describe("findSpurCombinations numerical parity (target ratio 8/z)", () => {
  it("z=20 -> target 0.4: exactly 5 two-gear matches (24/60, 30/75, 32/80, 34/85, 36/90), padded with 4-gear matches to maxResults", () => {
    const combos = findSpurCombinations(20);
    const twoGear = combos.filter((c) => c.c === null && c.d === null);
    const pairs = twoGear.map((c) => [c.a, c.b]);
    expect(pairs).toEqual([
      [24, 60],
      [30, 75],
      [32, 80],
      [34, 85],
      [36, 90],
    ]);
    // fewer than maxResults(10) two-gear matches -> the rest are 4-gear fallback combinations
    expect(combos.length).toBe(10);
    for (const c of combos) {
      expect(combinationRatio(c)).toBeCloseTo(0.4, 9);
    }
  });
});

describe("findTaksimatCombinations numerical parity (target ratio 16/z)", () => {
  it("z=16 -> target 1.0: the trivial 1:1 pairs (30/30, 90/90) are rejected by isValidTwoGear, and any surviving 4-gear match must not be a trivial 1:1 train either (matches GearCombinations.kt's isValidTwoGear/isValidFourGear)", () => {
    const combos = findTaksimatCombinations(16);
    const twoGear = combos.filter((c) => c.c === null && c.d === null);
    // 30/30 and 90/90 are rejected as trivially 1:1 (a === b), so no 2-gear match remains
    // at this target ratio within the source inventory.
    expect(twoGear).toEqual([]);
    for (const c of combos) {
      expect(combinationRatio(c)).toBeCloseTo(1.0, 9);
      expect(c.a).not.toBe(c.b);
      if (c.c !== null && c.d !== null) {
        expect(c.c).not.toBe(c.d);
        expect(c.a).not.toBe(c.c);
        expect(c.a).not.toBe(c.d);
        expect(c.b).not.toBe(c.c);
        expect(c.b).not.toBe(c.d);
      }
    }
  });
});

describe("invalid-combination filtering (isValidTwoGear / isValidFourGear)", () => {
  it("isValidTwoGear rejects equal tooth counts and trivial 1:1 ratios", () => {
    expect(isValidTwoGear(30, 30, 1)).toBe(false);
    expect(isValidTwoGear(24, 60, 0.4)).toBe(true);
  });

  it("isValidFourGear rejects any repeated tooth-count value (including cross-paired) and any trivial stage or overall ratio", () => {
    expect(isValidFourGear(23, 60, 89, 23, (23 * 89) / (60 * 23))).toBe(false); // A === D
    expect(isValidFourGear(30, 30, 40, 50, (30 * 40) / (30 * 50))).toBe(false); // A === B (trivial stage)
    expect(isValidFourGear(24, 60, 32, 80, (24 * 32) / (60 * 80))).toBe(true);
  });
});

describe("findHelicalCombinations numerical parity", () => {
  it("every returned combination's ratio is within the 0.001 tolerance of the target", () => {
    const target = 0.741462; // matches the ratio from the gearHelical parity case (mn=2,z=25,alpha=20,beta=15)
    const combos = findHelicalCombinations(target);
    expect(combos.length).toBeGreaterThan(0);
    for (const c of combos) {
      const ratio = c.c !== null && c.d !== null ? (c.a * c.c) / (c.b * c.d) : c.a / c.b;
      expect(Math.abs(ratio - target)).toBeLessThanOrEqual(0.001);
    }
  });
});
