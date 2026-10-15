import { describe, expect, it } from "vitest";
import { computeWeight, MATERIAL_DENSITIES } from "./weight";

/**
 * Numerical parity check against commit 0f71e8c2de417c5ebc9f6eb11c2bc66fa14a7a82.
 * Expected values were derived independently in Python from the documented
 * solid-cylinder formula (V = π·r²·h), not from this module's own output.
 *
 * Note: computeWeight covers the solid-cylinder case only. WeightCalculation.tsx
 * (the page component) reimplements this same formula inline plus the pipe and
 * flat-bar formulas directly in its own calculateVolume() — see
 * WeightCalculation.render.test.tsx for parity coverage of those two geometries
 * and of computeWeight's live on-screen equivalent.
 */
describe("computeWeight numerical parity (solid cylinder)", () => {
  it("d=50mm, l=100mm, steel density=7.85 g/cm³", () => {
    const r = computeWeight(50, 100, 7.85);
    expect(r.volumeMm3).toBeCloseTo(196349.54084936206, 6);
    expect(r.volumeCm3).toBeCloseTo(196.34954084936206, 9);
    expect(r.weightGrams).toBeCloseTo(1541.343895667492, 9);
    expect(r.weightKg).toBeCloseTo(1.541343895667492, 9);
  });
});

describe("MATERIAL_DENSITIES parity", () => {
  it("matches the documented density table (g/cm³)", () => {
    expect(MATERIAL_DENSITIES).toEqual({
      steel: 7.85,
      stainlessSteel: 8.0,
      aluminum: 2.7,
      brass: 8.5,
      bronze: 8.8,
      copper: 8.96,
      cast_iron: 7.2,
      titanium: 4.5,
    });
  });
});
