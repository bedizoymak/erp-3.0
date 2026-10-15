import { describe, expect, it } from "vitest";
import { computeSpurParams, validateSpurInputs } from "./gearSpur";

/**
 * Numerical parity check against commit 0f71e8c2de417c5ebc9f6eb11c2bc66fa14a7a82
 * (the last commit before src/calculator/** was deleted in d5593ec, and the
 * exact source used to restore this file). Expected values below were derived
 * independently in Python from the documented formulas — not copied from this
 * module's own output — so a silent formula change here would fail these tests.
 */
describe("computeSpurParams numerical parity", () => {
  it("mn=2, z=20, alpha=20 (auto diameter, xFactor=0 branch)", () => {
    const r = computeSpurParams(2, 20, 20);
    expect(r.alphaRad).toBeCloseTo(0.3490658503988659, 12);
    expect(r.diameter).toBeCloseTo(44, 12);
    expect(r.autoCalculatedDiameter).toBeCloseTo(44, 12);
    expect(r.k).toBeCloseTo(2.7222222222222223, 12);
    expect(r.kFloor).toBe(2);
    expect(r.kCeil).toBe(3);
    expect(r.EW).toBeCloseTo(0.014904383867336446, 12);
    expect(r.xFactor).toBe(0);
    expect(r.wkFloor).toBeCloseTo(9.416615883780512, 9);
    expect(r.wkCeil).toBeCloseTo(15.32087875196761, 9);
    expect(r.taksimatRatio).toBeCloseTo(0.4, 12);
  });

  it("mn=1.5, z=30, alpha=14.5, diameter override=50 (xFactor active branch)", () => {
    const r = computeSpurParams(1.5, 30, 14.5, 50);
    expect(r.alphaRad).toBeCloseTo(0.2530727415391778, 12);
    expect(r.diameter).toBe(50);
    expect(r.autoCalculatedDiameter).toBeCloseTo(48.0, 12);
    expect(r.k).toBeCloseTo(2.9166666666666665, 12);
    expect(r.kFloor).toBe(2);
    expect(r.kCeil).toBe(3);
    expect(r.EW).toBeCloseTo(0.00554484281671247, 12);
    expect(r.xFactor).toBeCloseTo(0.5007600081088829, 9);
    expect(r.wkFloor).toBeCloseTo(7.585762607980779, 9);
    expect(r.wkCeil).toBeCloseTo(12.148050879884012, 9);
    expect(r.taksimatRatio).toBeCloseTo(0.26666666666666666, 12);
  });

  it("taksimatRatio is always 8/z", () => {
    expect(computeSpurParams(1, 16, 20).taksimatRatio).toBeCloseTo(0.5, 12);
    expect(computeSpurParams(1, 8, 20).taksimatRatio).toBeCloseTo(1, 12);
  });
});

describe("validateSpurInputs boundary parity", () => {
  it("accepts the documented valid ranges (mn 0.3-3.0, z>=6, diameter 8-250)", () => {
    expect(validateSpurInputs(0.3, 6, 8)).toEqual([]);
    expect(validateSpurInputs(3.0, 6, 250)).toEqual([]);
  });

  it("rejects module outside 0.3-3.0", () => {
    expect(validateSpurInputs(0.29, 20, 50)).toContain("Modül 0.3 ile 3.0 arasında olmalıdır");
    expect(validateSpurInputs(3.01, 20, 50)).toContain("Modül 0.3 ile 3.0 arasında olmalıdır");
  });

  it("rejects tooth count below 6", () => {
    expect(validateSpurInputs(1, 5, 50)).toContain("Diş sayısı en az 6 olmalıdır");
  });

  it("rejects diameter outside 8-250", () => {
    expect(validateSpurInputs(1, 20, 7.9)).toContain("Çap 8 ile 250 mm arasında olmalıdır");
    expect(validateSpurInputs(1, 20, 250.1)).toContain("Çap 8 ile 250 mm arasında olmalıdır");
  });
});
