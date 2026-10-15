import { describe, expect, it } from "vitest";
import { computeHelicalParams, validateHelicalInputs } from "./gearHelical";

/**
 * Numerical parity check against commit 0f71e8c2de417c5ebc9f6eb11c2bc66fa14a7a82
 * (the source this module was restored from). Expected values were derived
 * independently in Python from the documented formulas, not from this module.
 */
describe("computeHelicalParams numerical parity", () => {
  it("mn=2, z=25, alpha=20, beta=15, Sağ (unclamped kFloor/kCeil branch)", () => {
    const r = computeHelicalParams(2, 25, 20, 15, "Sağ");
    expect(r.alphaRad).toBeCloseTo(0.3490658503988659, 12);
    expect(r.betaRad).toBeCloseTo(0.2617993877991494, 12);
    expect(r.diameter).toBeCloseTo(55.76380902050415, 9);
    expect(r.k).toBeCloseTo(3.2777777777777777, 12);
    expect(r.kFloor).toBe(3);
    expect(r.kCeil).toBe(4);
    expect(r.EW).toBeCloseTo(0.016453389896665394, 12);
    expect(r.wkFloor).toBeCloseTo(15.533713624108241, 9);
    expect(r.wkCeil).toBeCloseTo(21.43797649229534, 9);
    expect(r.taksimatRatio).toBeCloseTo(0.64, 12);
    expect(r.helicalGearRatio).toBeCloseTo(0.741462, 6);
    expect(r.helixDirection).toBe("Sağ");
  });

  it("mn=1, z=6, alpha=5, beta=10, Sol (kFloor<2 and kCeil<3 clamp branch)", () => {
    const r = computeHelicalParams(1, 6, 5, 10, "Sol");
    expect(r.alphaRad).toBeCloseTo(0.08726646259971647, 12);
    expect(r.betaRad).toBeCloseTo(0.17453292519943295, 12);
    expect(r.diameter).toBeCloseTo(8.09255967131447, 9);
    expect(r.k).toBeCloseTo(0.6666666666666666, 12);
    // raw kFloor=0, kCeil=1 -> clamped to the documented floors of 2 and 3
    expect(r.kFloor).toBe(2);
    expect(r.kCeil).toBe(3);
    expect(r.EW).toBeCloseTo(0.00023261079869554835, 12);
    expect(r.wkFloor).toBeCloseTo(4.695847271471471, 9);
    expect(r.wkCeil).toBeCloseTo(7.8254852165416, 9);
    expect(r.taksimatRatio).toBeCloseTo(2.6666666666666665, 12);
    expect(r.helicalGearRatio).toBeCloseTo(0.994931, 6);
    expect(r.helixDirection).toBe("Sol");
  });

  it("taksimatRatio is always 16/z (double the spur 8/z)", () => {
    expect(computeHelicalParams(1, 16, 20, 10, "Sağ").taksimatRatio).toBeCloseTo(1, 12);
  });
});

describe("validateHelicalInputs boundary parity", () => {
  it("accepts the documented valid ranges (mn 0.3-3.0, z>=6, beta 0-45)", () => {
    expect(validateHelicalInputs(0.3, 6, 0)).toEqual([]);
    expect(validateHelicalInputs(3.0, 6, 45)).toEqual([]);
  });

  it("rejects helix angle outside 0-45", () => {
    expect(validateHelicalInputs(1, 20, -0.1)).toContain("Helis açısı 0 ile 45 derece arasında olmalıdır");
    expect(validateHelicalInputs(1, 20, 45.1)).toContain("Helis açısı 0 ile 45 derece arasında olmalıdır");
  });
});
