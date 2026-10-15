import { describe, expect, it } from "vitest";
import {
  REISHAUER_GEAR_LIST,
  computeReishauerNominalDiameter,
  computeReishauerParams,
  findReishauerHelisCombinations,
  findReishauerTaksimatCombinations,
  normalizeReishauerAngleInput,
  normalizeReishauerAngleSeparator,
  parseReishauerAngle,
  rankReishauerCombinations,
  reishauerActualHelixAngle,
  validateReishauerInputs,
} from "./gearReishauer";

/**
 * Port of GearReishauerTest.kt (CEHA-AndroidApp domain layer). Expected values are taken directly
 * from the Kotlin test source, which is the ground truth for this module's formulas.
 */

describe("parseReishauerAngle (D,M,S,CS)", () => {
  it("parses a four-component angle with centiseconds", () => {
    const expected = 20.0 + 30.0 / 60.0 + 45.0 / 3600.0 + 25.0 / 360000.0;
    expect(parseReishauerAngle("20,30,45,25")).toBeCloseTo(expected, 9);
  });

  it("normalizes angle input to the Reishauer display notation", () => {
    expect(normalizeReishauerAngleInput("20.35,6,95")).toBe("20°35′06″95");
    expect(normalizeReishauerAngleInput("20 35 6 95")).toBe("20°35′06″95");
    expect(normalizeReishauerAngleInput("20 5 0")).toBe("20°05′00″00");
  });

  it("tolerates equivalent notations and resolves to the same normalized display", () => {
    const expected = "20°35′06″95";
    expect(normalizeReishauerAngleInput("20.35,6,95")).toBe(expected);
    expect(normalizeReishauerAngleInput("20 35 6 95")).toBe(expected);
    expect(normalizeReishauerAngleInput("20°35′06″95")).toBe(expected);
    // Legacy ASCII-quote notation this app used to emit must still normalize identically.
    expect(normalizeReishauerAngleInput("20°35'06''95'''")).toBe(expected);
    // Legacy " cs" suffix this app used to emit must also still normalize identically.
    expect(normalizeReishauerAngleInput("20°35′06″95 cs")).toBe(expected);
  });

  it("parses new notation and legacy ASCII quote notation to the same angle", () => {
    const expected = 20.0 + 35.0 / 60.0 + 6.0 / 3600.0 + 95.0 / 360000.0;
    expect(parseReishauerAngle("20°35′06″95")).toBeCloseTo(expected, 9);
    expect(parseReishauerAngle("20°35′06″95 cs")).toBeCloseTo(expected, 9);
    expect(parseReishauerAngle("20°35'06''95'''")).toBeCloseTo(expected, 9);
    expect(parseReishauerAngle("20.35,6,95")).toBeCloseTo(expected, 9);
    expect(parseReishauerAngle("20 35 6 95")).toBeCloseTo(expected, 9);
  });

  it("replaces angle separators immediately while typing", () => {
    expect(normalizeReishauerAngleSeparator("20 ")).toBe("20°");
    expect(normalizeReishauerAngleSeparator("20°5,")).toBe("20°05′");
    expect(normalizeReishauerAngleSeparator("20°05'6 ")).toBe("20°05′06″");
  });

  it("never contains ASCII quote characters or a cs suffix in its output", () => {
    const formatted = normalizeReishauerAngleInput("20,35,6,95");
    expect(formatted).not.toContain("'");
    expect(formatted).not.toContain("cs");
    expect(formatted).toBe("20°35′06″95");
    expect(formatted).toContain("′");
    expect(formatted).toContain("″");
  });

  it("treats zero centiseconds the same as plain D,M,S", () => {
    expect(parseReishauerAngle("20,30,0,0")).toBeCloseTo(20.5, 9);
  });

  it("returns null for too many components", () => {
    expect(parseReishauerAngle("20,30,45,25,1")).toBeNull();
  });

  it("treats missing components after degrees-only as zero", () => {
    expect(parseReishauerAngle("20")).toBeCloseTo(20.0, 9);
  });

  it("treats missing components after degrees+minutes as zero", () => {
    expect(parseReishauerAngle("20,30")).toBeCloseTo(20.5, 9);
  });

  it("treats missing centiseconds after D,M,S as zero", () => {
    const expected = 20.0 + 30.0 / 60.0 + 45.0 / 3600.0;
    expect(parseReishauerAngle("20,30,45")).toBeCloseTo(expected, 9);
  });

  it("treats an empty minutes component as zero", () => {
    const expected = 20.0 + 45.0 / 3600.0;
    expect(parseReishauerAngle("20,,45")).toBeCloseTo(expected, 9);
  });

  it("returns zero for an empty string", () => {
    expect(parseReishauerAngle("")).toBeCloseTo(0.0, 9);
  });

  it("returns null for a non-numeric component", () => {
    expect(parseReishauerAngle("a,30,45,25")).toBeNull();
  });

  it("returns null for an out-of-range minute", () => {
    expect(parseReishauerAngle("20,60")).toBeNull();
  });

  it("returns null for an out-of-range second", () => {
    expect(parseReishauerAngle("20,30,60")).toBeNull();
  });

  it("returns null for an out-of-range centisecond", () => {
    expect(parseReishauerAngle("20,30,45,100")).toBeNull();
  });

  it("accepts boundary-valid components", () => {
    // 59 minutes, 59 seconds, 99 centiseconds are the maximum valid values for each component.
    expect(parseReishauerAngle("20,59,59,99")).not.toBeNull();
  });
});

describe("computeReishauerParams: k1/k2/k3", () => {
  it("produces consecutive k1,k2,k3 for kRaw=3.8", () => {
    // alpha * z / 180 + 0.5 = 3.8  =>  alpha*z = 594; alpha=27, z=22 -> 27*22/180=3.3+0.5=3.8
    const mn = 2.5;
    const z = 22;
    const alpha = 27.0;
    const beta = 0.0;
    const nominal = computeReishauerNominalDiameter(mn, z, beta);

    const result = computeReishauerParams(mn, z, alpha, "27", beta, "0", "Sağ", nominal);

    expect(result.k1).toBe(3);
    expect(result.k2).toBe(4);
    expect(result.k3).toBe(5);
  });
});

describe("computeReishauerParams: Wk(k) for all three values", () => {
  it("is monotonically increasing with k", () => {
    const mn = 2.5;
    const z = 20;
    const alpha = 20.0;
    const beta = 15.0;
    const nominal = computeReishauerNominalDiameter(mn, z, beta);

    const result = computeReishauerParams(mn, z, alpha, "20", beta, "15", "Sağ", nominal);

    expect(result.k2).toBe(result.k1 + 1);
    expect(result.k3).toBe(result.k2 + 1);
    expect(result.wk1).toBeLessThan(result.wk2);
    expect(result.wk2).toBeLessThan(result.wk3);
  });
});

describe("computeReishauerParams: Helis Çark Oranı", () => {
  it("matches the stated example for beta=20, mn=2.5", () => {
    const mn = 2.5;
    const z = 20;
    const alpha = 20.0;
    const beta = 20.0;
    const nominal = computeReishauerNominalDiameter(mn, z, beta);

    const result = computeReishauerParams(mn, z, alpha, "20", beta, "20", "Sağ", nominal);

    expect(result.helixGearRatio).toBeCloseTo(0.62523082, 9);
  });

  it("matches the stated example for beta=15, mn=2.5", () => {
    const mn = 2.5;
    const z = 20;
    const alpha = 20.0;
    const beta = 15.0;
    const nominal = computeReishauerNominalDiameter(mn, z, beta);

    const result = computeReishauerParams(mn, z, alpha, "20", beta, "15", "Sağ", nominal);

    expect(result.helixGearRatio).toBeCloseTo(0.826220245, 9);
  });

  it("is zero-safe for beta=0", () => {
    const mn = 2.5;
    const z = 20;
    const alpha = 20.0;
    const beta = 0.0;
    const nominal = computeReishauerNominalDiameter(mn, z, beta);

    const result = computeReishauerParams(mn, z, alpha, "20", beta, "0", "Sağ", nominal);

    expect(result.helixGearRatio).toBe(0.0);
  });
});

describe("computeReishauerParams: Taksimat Oranı", () => {
  it("is 24/z, not 16/z", () => {
    const mn = 2.5;
    const z = 20;
    const alpha = 20.0;
    const beta = 15.0;
    const nominal = computeReishauerNominalDiameter(mn, z, beta);

    const result = computeReishauerParams(mn, z, alpha, "20", beta, "15", "Sağ", nominal);

    expect(result.taksimatRatio).toBeCloseTo(24.0 / 20.0, 9);
  });
});

describe("computeReishauerParams: manual diameter correction", () => {
  it("produces an unshifted Wk when manual diameter equals nominal", () => {
    const mn = 2.5;
    const z = 20;
    const alpha = 20.0;
    const beta = 15.0;
    const nominal = computeReishauerNominalDiameter(mn, z, beta);

    const withoutManual = computeReishauerParams(mn, z, alpha, "20", beta, "15", "Sağ", nominal);
    const diff = 1.2345;
    const withManual = computeReishauerParams(mn, z, alpha, "20", beta, "15", "Sağ", nominal + diff);

    const expectedShift = diff * Math.sin((alpha * Math.PI) / 180);
    expect(withManual.wk1 - withoutManual.wk1).toBeCloseTo(expectedShift, 3);
    expect(withManual.wk2 - withoutManual.wk2).toBeCloseTo(expectedShift, 3);
    expect(withManual.wk3 - withoutManual.wk3).toBeCloseTo(expectedShift, 3);
  });
});

describe("validateReishauerInputs", () => {
  it("returns no errors for all-valid inputs", () => {
    expect(validateReishauerInputs(1.5, 20, 50.0, 20.0, 15.0)).toHaveLength(0);
  });

  it("returns an error for module out of range", () => {
    expect(validateReishauerInputs(0.1, 20, 50.0, 20.0, 15.0).length).toBeGreaterThan(0);
  });

  it("returns an error for teeth below minimum", () => {
    expect(validateReishauerInputs(1.5, 5, 50.0, 20.0, 15.0).length).toBeGreaterThan(0);
  });

  it("returns an error for diameter out of range", () => {
    expect(validateReishauerInputs(1.5, 20, 300.0, 20.0, 15.0).length).toBeGreaterThan(0);
  });

  it("returns an error for an unparsed angle", () => {
    expect(validateReishauerInputs(1.5, 20, 50.0, null, 15.0).length).toBeGreaterThan(0);
    expect(validateReishauerInputs(1.5, 20, 50.0, 20.0, null).length).toBeGreaterThan(0);
  });
});

describe("gear-selection combination search", () => {
  it("REISHAUER_GEAR_LIST starts at 25, ends at 127, and contains 103 unique gears", () => {
    expect(REISHAUER_GEAR_LIST[0]).toBe(25);
    expect(REISHAUER_GEAR_LIST[REISHAUER_GEAR_LIST.length - 1]).toBe(127);
    expect(REISHAUER_GEAR_LIST.length).toBe(103);
    expect(new Set(REISHAUER_GEAR_LIST).size).toBe(103);
  });

  it("findReishauerTaksimatCombinations returns at most five results", () => {
    const results = findReishauerTaksimatCombinations(20);
    expect(results.length).toBeLessThanOrEqual(5);
    results.forEach((c) => {
      expect(REISHAUER_GEAR_LIST).toContain(c.a);
      expect(REISHAUER_GEAR_LIST).toContain(c.b);
    });
  });

  it("findReishauerHelisCombinations returns at most twenty results", () => {
    const results = findReishauerHelisCombinations(2.5, 15.0, 0.826220245);
    expect(results.length).toBeLessThanOrEqual(20);
  });

  it("every returned Helis candidate has a valid actual angle", () => {
    // The final list must only ever contain candidates whose actual helix angle is computable
    // (asin input in [-1, 1]) - invalid candidates must be filtered out, not merely hidden.
    const mn = 2.5;
    const results = findReishauerHelisCombinations(mn, 15.0, 0.826220245);
    expect(results.length).toBeGreaterThan(0);
    results.forEach((c) => {
      expect(reishauerActualHelixAngle(mn, c.combination.ratio)).not.toBeNull();
    });
  });

  it("orders Helis candidates by ascending absolute error", () => {
    const mn = 2.5;
    const target = 0.826220245;
    const results = findReishauerHelisCombinations(mn, 15.0, target);
    const errors = results.map((r) => r.absoluteError);
    const sorted = [...errors].sort((a, b) => a - b);
    expect(errors).toEqual(sorted);
  });

  it("returns no duplicate gear arrangements", () => {
    const mn = 2.5;
    const results = findReishauerHelisCombinations(mn, 15.0, 0.826220245);
    const arrangements = results.map((r) => `${r.combination.a}/${r.combination.b}/${r.combination.c}/${r.combination.d}`);
    expect(new Set(arrangements).size).toBe(arrangements.length);
  });

  it("deviationDeg is actual minus requested", () => {
    const mn = 2.5;
    const betaRequested = 15.0;
    const results = findReishauerHelisCombinations(mn, betaRequested, 0.826220245);
    expect(results.length).toBeGreaterThan(0);
    results.forEach((c) => {
      expect(c.deviationDeg).toBeCloseTo(c.actualHelixAngleDeg - betaRequested, 9);
    });
  });

  it("ratio is rounded down to nine decimals, not HALF_UP", () => {
    const mn = 2.5;
    const results = findReishauerHelisCombinations(mn, 15.0, 0.826220245);
    expect(results.length).toBeGreaterThan(0);
    results.forEach((c) => {
      const raw =
        c.combination.c != null && c.combination.d != null
          ? (c.combination.a * c.combination.c) / (c.combination.b * c.combination.d)
          : c.combination.a / c.combination.b;
      expect(Math.abs(raw - c.combination.ratio)).toBeLessThan(1e-8);
      expect(c.combination.ratio).toBeLessThanOrEqual(raw);
    });
  });

  it("prefers 2-gear over 4-gear when enough two-gear matches exist", () => {
    // z=32 -> target 24/32=0.75, and e.g. 75/100 (both within [25,127]) matches exactly, so the
    // 2-gear search should be able to satisfy results without falling back to 4-gear.
    const results = findReishauerTaksimatCombinations(32);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((c) => c.c == null && c.d == null)).toBe(true);
  });
});

describe("rankReishauerCombinations: global ranking, 4-gear can outrank 2-gear", () => {
  it("a better 4-gear candidate outranks a weaker 2-gear one", () => {
    // Small synthetic gear list (ascending, distinct): 2-gear ratios are 2/3=.667, 2/5=.4,
    // 2/7=.286, 3/5=.6, 3/7=.429, 5/7=.714. The only 4-gear combination (2,3,5,7) has ratio
    // (2/3)*(5/7) = 10/21 = .47619. Target .476 is far closer to the 4-gear combination
    // (error ~1.9e-4) than to any 2-gear candidate (closest is 3/7=.4286, error ~.047), so the
    // top-ranked (lowest-error) result must be the 4-gear one.
    const gearList = [2, 3, 5, 7];
    const target = 0.476;

    const ranked = rankReishauerCombinations(gearList, target, 10);

    expect(ranked.length).toBeGreaterThan(0);
    const best = ranked[0];
    expect(best.c).not.toBeNull();
    expect(best.d).not.toBeNull();
    expect([best.a, best.b, best.c, best.d]).toEqual([2, 3, 5, 7]);
    // Ranking must be by ascending absolute error against the target.
    const errors = ranked.map((r) => Math.abs(r.ratio - target));
    const sorted = [...errors].sort((a, b) => a - b);
    expect(errors).toEqual(sorted);
  });
});

describe("reishauerActualHelixAngle", () => {
  it("matches the requested beta for an exact ratio", () => {
    const mn = 2.5;
    const beta = 20.0;
    const ratio = mn / (11.6909 * Math.sin((beta * Math.PI) / 180));

    const actual = reishauerActualHelixAngle(mn, ratio);

    expect(actual).not.toBeNull();
    expect(actual as number).toBeCloseTo(beta, 6);
  });

  it("returns null for an out-of-range asin input", () => {
    expect(reishauerActualHelixAngle(2.5, 0.01)).toBeNull();
  });

  it("returns null for a zero ratio", () => {
    expect(reishauerActualHelixAngle(2.5, 0.0)).toBeNull();
  });
});

describe("findReishauerHelisCombinations: out-of-range asin backfill", () => {
  it("excludes out-of-range asin candidates but backfills from the buffer", () => {
    // A deliberately large mn relative to the target ratio pushes asinInput = mn / (11.6909 *
    // ratio) past 1 for most/all of the closest raw-ranked candidates, so the raw ranked pool
    // must contain excluded candidates...
    const mn = 50.0;
    const target = 0.4;
    const ranked = rankReishauerCombinations(REISHAUER_GEAR_LIST, target, 40);
    const invalidCount = ranked.filter((r) => reishauerActualHelixAngle(mn, r.ratio) == null).length;
    expect(invalidCount).toBeGreaterThan(0);

    // ...but the public function must still only surface valid candidates, backfilled from the
    // larger internal buffer rather than just truncating the raw ranked list.
    const results = findReishauerHelisCombinations(mn, 20.0, target, 5, 40);
    results.forEach((c) => {
      expect(reishauerActualHelixAngle(mn, c.combination.ratio)).not.toBeNull();
    });
  });
});

describe("findReishauerHelisCombinations: perfect-match flag", () => {
  it("marks a genuinely exact-ratio result as isPerfectMatch", () => {
    const mn = 2.5;
    const betaRequested = 20.0;
    const exactRatio = mn / (11.6909 * Math.sin((betaRequested * Math.PI) / 180));
    const ranked = rankReishauerCombinations(REISHAUER_GEAR_LIST, exactRatio, 40);
    expect(ranked.length).toBeGreaterThan(0);

    const results = findReishauerHelisCombinations(mn, betaRequested, exactRatio, 20, 40);
    expect(results.length).toBeGreaterThan(0);
    // Whatever the best candidate is, its perfect-match flag must be true only when its error
    // is genuinely exact zero, and false otherwise - never a "near enough" approximation.
    results.forEach((c) => {
      expect(c.isPerfectMatch).toBe(c.absoluteError === 0.0);
    });
  });
});

describe("acceptance scenario: mn=2.5, Z=48, alpha=20, beta=20, Sol", () => {
  it("matches all documented computed values", () => {
    const mn = 2.5;
    const z = 48;
    const alpha = 20.0;
    const beta = 20.0;
    const nominal = computeReishauerNominalDiameter(mn, z, beta);

    const result = computeReishauerParams(mn, z, alpha, "20", beta, "20", "Sol", nominal);

    expect(result.taksimatRatio).toBeCloseTo(0.5, 9);
    expect(result.helixGearRatio).toBeCloseTo(0.62523082, 9);
    expect(result.k1).toBe(5);
    expect(result.k2).toBe(6);
    expect(result.k3).toBe(7);
    expect(result.nominalDiameter).toBeCloseTo(132.7013, 3);
    // Manual diameter left at the auto-calculated nominal value -> zero Wk correction.
    expect(result.diameter).toBeCloseTo(result.nominalDiameter, 9);
    const unshifted = computeReishauerParams(mn, z, alpha, "20", beta, "20", "Sol", nominal + 1.0);
    const shift = unshifted.wk1 - result.wk1;
    expect(shift).toBeCloseTo(1.0 * Math.sin((alpha * Math.PI) / 180), 3);
  });
});
