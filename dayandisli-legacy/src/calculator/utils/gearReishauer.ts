// Reishauer profile-grinding calculator.
//
// Ported from CEHA-AndroidApp's GearReishauer.kt (domain layer), adapted to this app's
// number-based conventions (see gearHelical.ts) instead of Kotlin's Double/BigDecimal split.
// This is a distinct machine standard from Kucuk Azdirma / Helical Hobbing (gearHelical.ts) and
// does NOT alter that file's formulas or gear inventories. Reishauer uses its own single shared
// gear inventory (REISHAUER_GEAR_LIST, 25..127) for both Taksimat and Helis searches, its own
// Taksimat convention (24/Z, not Helical's 16/Z), and its own D,M,S,CS angle notation.

export type HelixDirection = "Sağ" | "Sol";

export interface GearCombination {
  a: number;
  b: number;
  c: number | null;
  d: number | null;
  ratio: number;
}

// ---------------------------------------------------------------------------------------------
// Decimal-safe rounding helpers (mirrors NumberFormatting.kt's roundToFixed/floorToFixed, which
// use java.math.BigDecimal(Double) + RoundingMode.HALF_UP / DOWN. BigDecimal(Double) reads the
// *exact* binary value of the double, so we replicate that by formatting with enough significant
// digits (17, always round-trip safe for a double) and rounding the resulting decimal string --
// this avoids the naive `Math.round(x * 10**n) / 10**n` pitfalls at magnitude/precision edges.)
// ---------------------------------------------------------------------------------------------

function roundDecimalString(value: number, digits: number, mode: "HALF_UP" | "DOWN"): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return value;
  const negative = value < 0;
  const abs = Math.abs(value);
  // 17 significant digits round-trips any double exactly back to itself.
  let s = abs.toPrecision(17);
  if (s.includes("e") || s.includes("E")) {
    // Extremely large/small magnitudes: fall back to a plain-notation expansion.
    s = abs.toFixed(Math.max(digits + 20, 20));
  }
  const [intPart, fracPartRaw] = s.split(".");
  let fracPart = fracPartRaw ?? "";
  while (fracPart.length <= digits) fracPart += "0";

  const keep = fracPart.slice(0, digits);
  const rest = fracPart.slice(digits);

  let digitsArr = (intPart + keep).split("").map(Number);
  let roundUp = false;
  if (mode === "HALF_UP") {
    roundUp = rest.length > 0 && rest[0] >= "5";
  }
  if (roundUp) {
    let i = digitsArr.length - 1;
    while (i >= 0) {
      digitsArr[i]++;
      if (digitsArr[i] === 10) {
        digitsArr[i] = 0;
        i--;
      } else {
        break;
      }
    }
    if (i < 0) digitsArr = [1, ...digitsArr];
  }

  const combined = digitsArr.join("");
  const newIntLen = combined.length - digits;
  const newIntPart = combined.slice(0, newIntLen) || "0";
  const newFracPart = combined.slice(newIntLen);
  const numStr = digits > 0 ? `${newIntPart}.${newFracPart}` : newIntPart;
  const result = Number(numStr);
  return negative && result !== 0 ? -result : result;
}

/** Rounds like JavaScript's Number.prototype.toFixed but returns a number, HALF_UP (round-half-
 * away-from-zero), matching Kotlin's roundToFixed. */
export function roundToFixed(value: number, digits: number): number {
  return roundDecimalString(value, digits, "HALF_UP");
}

/** Truncates toward zero at [digits] decimals (BigDecimal RoundingMode.DOWN), matching Kotlin's
 * floorToFixed. Named floorToFixed for parity even though it truncates rather than floors, since
 * all values it is used on in this module are non-negative. */
export function floorToFixed(value: number, digits: number): number {
  return roundDecimalString(value, digits, "DOWN");
}

// ---------------------------------------------------------------------------------------------
// D,M,S,CS angle parsing / formatting
// ---------------------------------------------------------------------------------------------

function canonicalizeReishauerAngleSeparators(input: string): string {
  return input
    .replace(/\s*cs\b/gi, "")
    .replace(/'''/g, ",")
    .replace(/''/g, ",")
    .replace(/′/g, ",")
    .replace(/″/g, ",")
    .replace(/'/g, ",")
    .replace(/"/g, ",")
    .replace(/°/g, ",")
    .replace(/(?<=\d)[\s.]+(?=\d)/g, ",");
}

/**
 * Formats a permissively entered D,M,S,CS angle into the fixed shop-floor notation used by the
 * Reishauer form. For example, `20.35,6,95` and `20 35 6 95` become `20°35′06″95`.
 */
export function normalizeReishauerAngleInput(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) return "";
  const parts = canonicalizeReishauerAngleSeparators(trimmed)
    .split(/[,.\s]+/)
    .filter((p) => p.length > 0);
  if (parts.length === 0 || parts.length > 4 || parts.some((p) => !isPlainInt(p))) return trimmed;

  const values = parts.map((p) => parseInt(p, 10));
  while (values.length < 4) values.push(0);
  return `${values[0]}°${pad2(values[1])}′${pad2(values[2])}″${pad2(values[3])}`;
}

/**
 * Keeps angle entry fluid while typing: when the user types a dot, comma, or whitespace after a
 * component, it is immediately replaced with the next engineering angle symbol. The remaining
 * component stays editable, while [normalizeReishauerAngleInput] fills its trailing zeros once
 * entry is complete.
 */
export function normalizeReishauerAngleSeparator(input: string): string {
  if (input.length === 0) return input;
  const last = input[input.length - 1];
  if (!(/\s/.test(last) || last === "." || last === ",")) return input;

  const withoutTrailingSeparators = input.replace(/[\s.,]+$/, "");
  const parts = canonicalizeReishauerAngleSeparators(withoutTrailingSeparators)
    .split(/[,.\s]+/)
    .filter((p) => p.length > 0);
  if (parts.length === 0 || parts.length > 4 || parts.some((p) => !isPlainInt(p))) return input;

  const values = parts.map((p) => parseInt(p, 10));
  let out = `${values[0]}°`;
  if (values.length >= 2) out += `${pad2(values[1])}′`;
  if (values.length >= 3) out += `${pad2(values[2])}″`;
  if (values.length >= 4) out += `${pad2(values[3])}`;
  return out;
}

function isPlainInt(s: string): boolean {
  return /^[+-]?\d+$/.test(s);
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * D,M,S,CS (Derece,Dakika,Saniye,Salise) angle parser. Missing/empty trailing components are
 * zero; more than 4 comma-separated components or any non-numeric component is rejected. Each
 * physical component is also range-checked (minute/second 0..59, centisecond 0..99) so malformed
 * input like "20,60" or "20,30,45,100" is rejected rather than silently accepted as a valid but
 * out-of-range angle. Also tolerates legacy ASCII-quote notation (', '', ''') and a trailing " cs"
 * suffix, canonicalized away before parsing.
 */
export function parseReishauerAngle(input: string): number | null {
  const canonical = canonicalizeReishauerAngleSeparators(input.trim())
    .replace(/[.\s]+/g, ",")
    .replace(/^,+|,+$/g, "");
  const parts = canonical.split(",").map((p) => p.trim());
  if (parts.length > 4) return null;

  const components: number[] = [];
  for (const part of parts) {
    if (part.length === 0) {
      components.push(0);
    } else {
      if (!isNumericToken(part)) return null;
      const n = Number(part);
      if (Number.isNaN(n)) return null;
      components.push(n);
    }
  }
  while (components.length < 4) components.push(0);

  const [degrees, minutes, seconds, centiseconds] = components;
  if (minutes < 0 || minutes > 59) return null;
  if (seconds < 0 || seconds > 59) return null;
  if (centiseconds < 0 || centiseconds > 99) return null;

  return degrees + minutes / 60 + seconds / 3600 + centiseconds / 360000;
}

function isNumericToken(s: string): boolean {
  // Matches Kotlin's String.toDoubleOrNull() acceptance for the plain numeric tokens this parser
  // sees post-canonicalization (integers or decimals, optionally signed).
  return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(s);
}

// ---------------------------------------------------------------------------------------------
// D,M,S,CS display formatting for computed angles (actual helix angle, deviation)
// ---------------------------------------------------------------------------------------------

interface Dmscs {
  degrees: number;
  minutes: number;
  seconds: number;
  centiseconds: number;
}

function dmscsOf(magnitudeDegrees: number): Dmscs {
  const totalCentiseconds = Math.round(Math.abs(magnitudeDegrees) * 360000);
  let remaining = totalCentiseconds;
  const centiseconds = remaining % 100;
  remaining = Math.floor(remaining / 100);
  const seconds = remaining % 60;
  remaining = Math.floor(remaining / 60);
  const minutes = remaining % 60;
  const degrees = Math.floor(remaining / 60);
  return { degrees, minutes, seconds, centiseconds };
}

function dmscsToString(v: Dmscs): string {
  return `${v.degrees}° ${pad2(v.minutes)}′ ${pad2(v.seconds)}″ ${pad2(v.centiseconds)}`;
}

/**
 * Formats a decimal-degree value as an unsigned D° M′ S″ CS magnitude, e.g. `19° 59′ 59″ 95`. Any
 * sign on the input is ignored -- use [toDmscsSigned] where a +/- sign must be shown.
 */
export function toDmscs(value: number): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) return "-";
  return dmscsToString(dmscsOf(value));
}

/**
 * Formats a decimal-degree value as a D° M′ S″ CS magnitude with a mandatory leading sign, e.g.
 * `+0° 00′ 00″ 15` or `-0° 00′ 00″ 15`. Intended for signed differences (e.g. deviationDeg).
 */
export function toDmscsSigned(value: number): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) return "-";
  const sign = value < 0 ? "-" : "+";
  return `${sign}${dmscsToString(dmscsOf(value))}`;
}

// ---------------------------------------------------------------------------------------------
// Core Reishauer computation
// ---------------------------------------------------------------------------------------------

export interface ReishauerResult {
  mn: number;
  z: number;
  alphaDeg: number;
  alphaRaw: string;
  betaDeg: number;
  betaRaw: string;
  helixDirection: HelixDirection;
  nominalDiameter: number;
  diameter: number;
  k1: number;
  wk1: number;
  k2: number;
  wk2: number;
  k3: number;
  wk3: number;
  taksimatRatio: number;
  helixGearRatio: number;
  /** Full-precision helis ratio (mn / (11.6909 * sin(beta))), before the display-only floor-to-9-
   * decimals rounding applied to helixGearRatio. Combination search must rank candidates against
   * this value, not the rounded display value. */
  helixGearRatioFullPrecision: number;
}

export function validateReishauerInputs(
  mn: number | null | undefined,
  z: number | null | undefined,
  manualDiameter: number | null | undefined,
  alphaDeg: number | null | undefined,
  betaDeg: number | null | undefined
): string[] {
  const errors: string[] = [];
  if (mn == null || mn < 0.3 || mn > 3.0) errors.push("Modül 0.3 ile 3.0 arasında olmalıdır");
  if (z == null || z < 6) errors.push("Diş sayısı en az 6 olmalıdır");
  if (manualDiameter == null || manualDiameter < 8.0 || manualDiameter > 250.0) {
    errors.push("Çap (ø) 8 ile 250 mm arasında olmalıdır");
  }
  if (alphaDeg == null) errors.push("Kavrama açısı (α) formatı geçersiz (Derece,Dakika,Saniye,Salise)");
  if (betaDeg == null) errors.push("Helis açısı (β) formatı geçersiz (Derece,Dakika,Saniye,Salise)");
  return errors;
}

export function computeReishauerNominalDiameter(mn: number, z: number, betaDeg: number): number {
  const betaRad = (betaDeg * Math.PI) / 180;
  const cosBeta = Math.cos(betaRad);
  if (cosBeta === 0) return 0;
  return (mn / cosBeta) * z + 2 * mn;
}

export function computeReishauerParams(
  mn: number,
  z: number,
  alphaDeg: number,
  alphaRaw: string,
  betaDeg: number,
  betaRaw: string,
  helixDirection: HelixDirection,
  manualDiameter: number
): ReishauerResult {
  const alphaRad = (alphaDeg * Math.PI) / 180;
  const betaRad = (betaDeg * Math.PI) / 180;

  const nominalDiameter = roundToFixed(computeReishauerNominalDiameter(mn, z, betaDeg), 4);
  const manualDiameterRounded = roundToFixed(manualDiameter, 4);

  // Transformed pressure angle / helicalEw (identical formula to Helical Hobbing).
  const xRad = Math.atan(Math.tan(alphaRad) / Math.cos(betaRad));
  const xDeg = (xRad * 180) / Math.PI;
  const y = (xDeg * Math.PI) / 180;
  const ew = Math.abs(y - Math.tan(xRad));

  // Three consecutive k values.
  const kRaw = (alphaDeg * z) / 180 + 0.5;
  const k1 = Math.floor(kRaw);
  const k2 = k1 + 1;
  const k3 = k1 + 2;

  const cosAlpha = Math.cos(alphaRad);
  const wk = (k: number) => mn * cosAlpha * ((k - 0.5) * Math.PI + z * ew);

  const correction = (manualDiameterRounded - nominalDiameter) * Math.sin(alphaRad);

  const wk1 = roundToFixed(wk(k1) + correction, 4);
  const wk2 = roundToFixed(wk(k2) + correction, 4);
  const wk3 = roundToFixed(wk(k3) + correction, 4);

  const sinBeta = Math.sin(betaRad);
  const helixGearRatioFullPrecision = sinBeta === 0 ? 0 : mn / (11.6909 * sinBeta);
  const helixGearRatio = sinBeta === 0 ? 0 : floorToFixed(helixGearRatioFullPrecision, 9);

  // Taksimat Orani: 24 / Z (Reishauer-specific target-ratio convention; distinct from Kucuk
  // Azdirma / Helical Hobbing's 16 / Z used in gearHelical.ts, which must not change).
  const taksimatRatio = z !== 0 ? 24.0 / z : 0;

  return {
    mn,
    z,
    alphaDeg,
    alphaRaw,
    betaDeg,
    betaRaw,
    helixDirection,
    nominalDiameter,
    diameter: manualDiameterRounded,
    k1,
    wk1,
    k2,
    wk2,
    k3,
    wk3,
    taksimatRatio,
    helixGearRatio,
    helixGearRatioFullPrecision,
  };
}

// ---------------------------------------------------------------------------------------------
// Gear-selection combination search
// ---------------------------------------------------------------------------------------------

/** Reishauer's single shared physical gear inventory, used for both Taksimat and Helis
 * combination searches (25..127 inclusive, 103 unique integers). */
export const REISHAUER_GEAR_LIST: number[] = Array.from({ length: 127 - 25 + 1 }, (_, i) => i + 25);

const TRIVIAL_RATIO_EPSILON = 1e-9;

function isTrivialRatio(value: number): boolean {
  return Math.abs(value - 1.0) <= TRIVIAL_RATIO_EPSILON;
}

/** Rejects a 2-gear candidate whose tooth counts are equal or whose ratio is effectively 1. */
function isValidTwoGear(a: number, b: number, ratio: number): boolean {
  if (a === b) return false;
  if (isTrivialRatio(ratio)) return false;
  return true;
}

/** Rejects a 4-gear candidate when any two of its tooth-count values are equal, when either
 * stage (A/B or C/D) is effectively a 1:1 ratio, or when the full train (A/B)*(C/D) is
 * effectively 1:1 -- including cross-paired duplicates like A=23,D=23, not just same-stage ones. */
function isValidFourGear(a: number, b: number, c: number, d: number, ratio: number): boolean {
  if (a === b || a === c || a === d || b === c || b === d || c === d) return false;
  if (isTrivialRatio(a / b)) return false;
  if (isTrivialRatio(c / d)) return false;
  if (isTrivialRatio(ratio)) return false;
  return true;
}

function reishauerTwoGear(
  gearList: number[],
  targetRatio: number,
  tolerance: number,
  maxResults: number
): GearCombination[] {
  const results: GearCombination[] = [];
  const seen = new Set<string>();
  outer: for (let i = 0; i < gearList.length; i++) {
    for (let j = i + 1; j < gearList.length; j++) {
      const a = gearList[i];
      const b = gearList[j];
      let ratio: number;
      let ga: number;
      let gb: number;
      if (targetRatio >= 1) {
        ratio = b / a;
        ga = b;
        gb = a;
      } else {
        ratio = a / b;
        ga = a;
        gb = b;
      }
      if (Math.abs(ratio - targetRatio) <= tolerance) {
        const key = `${ga}/${gb}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ a: ga, b: gb, c: null, d: null, ratio });
        }
      }
      if (results.length >= maxResults) break outer;
    }
  }
  return results;
}

function reishauerFourGear(
  gearList: number[],
  targetRatio: number,
  tolerance: number,
  maxResults: number
): GearCombination[] {
  const results: GearCombination[] = [];
  const seen = new Set<string>();
  const n = gearList.length;
  outer: for (let i = 0; i < n - 3; i++) {
    for (let j = i + 1; j < n - 2; j++) {
      for (let k = j + 1; k < n - 1; k++) {
        for (let l = k + 1; l < n; l++) {
          const a = gearList[i];
          const b = gearList[j];
          const c = gearList[k];
          const d = gearList[l];
          let ratio: number;
          let ga: number, gb: number, gc: number, gd: number;
          if (targetRatio >= 1) {
            ratio = (b / a) * (d / c);
            ga = b; gb = a; gc = d; gd = c;
          } else {
            ratio = (a / b) * (c / d);
            ga = a; gb = b; gc = c; gd = d;
          }
          if (Math.abs(ratio - targetRatio) <= tolerance) {
            const key = `${ga}/${gb}*${gc}/${gd}`;
            if (!seen.has(key)) {
              seen.add(key);
              results.push({ a: ga, b: gb, c: gc, d: gd, ratio });
            }
          }
          if (results.length >= maxResults) break outer;
        }
      }
    }
  }
  return results;
}

/** 2-gear combinations first; 4-gear combinations only if fewer than 5 valid 2-gear results
 * exist; max 5 results overall. Shared by both Taksimat and Helis searches. */
function findReishauerCombinations(targetRatio: number, tolerance: number, maxResults = 5): GearCombination[] {
  const twoGear = reishauerTwoGear(REISHAUER_GEAR_LIST, targetRatio, tolerance, maxResults);
  if (twoGear.length >= 5) return twoGear.slice(0, maxResults);
  const fourGear = reishauerFourGear(REISHAUER_GEAR_LIST, targetRatio, tolerance, maxResults);
  return [...twoGear, ...fourGear].slice(0, maxResults);
}

export function findReishauerTaksimatCombinations(z: number): GearCombination[] {
  const targetRatio = z !== 0 ? 24.0 / z : 0;
  return findReishauerCombinations(targetRatio, 1e-9);
}

/** Number of best-by-error candidates displayed on the Helis Çark Kombinasyonları card list. */
const HELIS_DISPLAY_COUNT = 20;

/** Internal ranked-candidate buffer size, larger than HELIS_DISPLAY_COUNT so candidates excluded
 * by the actual-angle asin-validity filter can still be backfilled from the ranked pool instead
 * of shrinking the final displayed list below its intended size. */
const HELIS_INTERNAL_CANDIDATE_COUNT = 40;

interface RankedCombo {
  a: number;
  b: number;
  c: number | null;
  d: number | null;
  ratio: number;
  error: number;
}

/**
 * Ranks every feasible 2-gear and 4-gear combination from [gearList] against the full-precision
 * [targetRatio] by ascending absolute error and returns the [maxResults] best. This is an
 * exhaustive search: no tolerance cutoff, and it never stops early after finding some number of
 * 2-gear matches, so a genuinely closer 4-gear combination can never be shadowed by an earlier,
 * less accurate 2-gear one. A bounded retained-best array (capacity maxResults, kept sorted
 * ascending by error) is used so the O(n^4) 4-gear scan never has to materialize or sort the full
 * candidate space. Invalid candidates (repeated tooth-count values, a trivial 1:1 stage ratio, or
 * a trivial 1:1 overall train ratio) are rejected before ever being considered for retention,
 * exactly as isValidTwoGear/isValidFourGear do for Spur/Helical.
 */
export function rankReishauerCombinations(
  gearList: number[],
  targetRatio: number,
  maxResults: number
): GearCombination[] {
  const best: RankedCombo[] = [];

  const considerAndMaybeInsert = (a: number, b: number, c: number | null, d: number | null, ratio: number) => {
    const error = Math.abs(ratio - targetRatio);
    if (best.length < maxResults) {
      best.push({ a, b, c, d, ratio, error });
      best.sort((x, y) => x.error - y.error);
    } else if (error < best[best.length - 1].error) {
      best[best.length - 1] = { a, b, c, d, ratio, error };
      best.sort((x, y) => x.error - y.error);
    }
  };

  for (let i = 0; i < gearList.length; i++) {
    for (let j = i + 1; j < gearList.length; j++) {
      const a = gearList[i];
      const b = gearList[j];
      let ratio: number;
      let ga: number, gb: number;
      if (targetRatio >= 1) {
        ratio = b / a;
        ga = b; gb = a;
      } else {
        ratio = a / b;
        ga = a; gb = b;
      }
      if (!isValidTwoGear(ga, gb, ratio)) continue;
      considerAndMaybeInsert(ga, gb, null, null, ratio);
    }
  }

  const n = gearList.length;
  for (let i = 0; i < n - 3; i++) {
    for (let j = i + 1; j < n - 2; j++) {
      for (let k = j + 1; k < n - 1; k++) {
        for (let l = k + 1; l < n; l++) {
          const a = gearList[i];
          const b = gearList[j];
          const c = gearList[k];
          const d = gearList[l];
          let ratio: number;
          let ga: number, gb: number, gc: number, gd: number;
          if (targetRatio >= 1) {
            ratio = (b / a) * (d / c);
            ga = b; gb = a; gc = d; gd = c;
          } else {
            ratio = (a / b) * (c / d);
            ga = a; gb = b; gc = c; gd = d;
          }
          if (!isValidFourGear(ga, gb, gc, gd, ratio)) continue;
          considerAndMaybeInsert(ga, gb, gc, gd, ratio);
        }
      }
    }
  }

  return best
    .slice()
    .sort((x, y) => x.error - y.error)
    .map((c) => ({ a: c.a, b: c.b, c: c.c, d: c.d, ratio: c.ratio }));
}

/** The actual helix angle (degrees) a given combination ratio would produce:
 * betaActual = asin(mn / (11.6909 * ratio)). Returns null if the denominator or ratio is zero, or
 * if the asin input is out of [-1, 1]. */
export function reishauerActualHelixAngle(mn: number, combinationRatio: number): number | null {
  if (combinationRatio === 0) return null;
  const denominator = 11.6909 * combinationRatio;
  if (denominator === 0) return null;
  const asinInput = mn / denominator;
  if (asinInput < -1.0 || asinInput > 1.0) return null;
  return (Math.asin(asinInput) * 180) / Math.PI;
}

/**
 * A single Helis Çark Kombinasyonları candidate, enriched with everything the receipt card needs
 * to render: [combination] (whose `ratio` is the display value, floored to 9 decimals), the
 * [absoluteError] against the full-precision target ratio, the actual helix angle this
 * combination produces, its deviation from the requested beta, and whether it is a genuinely
 * exact (zero-error) mathematical match.
 */
export interface ReishauerHelisCombination {
  combination: GearCombination;
  absoluteError: number;
  actualHelixAngleDeg: number;
  deviationDeg: number;
  isPerfectMatch: boolean;
}

/**
 * Helis Çark Kombinasyonları: exhaustive search against the full-precision
 * targetRatioFullPrecision (never the display-rounded ReishauerResult.helixGearRatio), 2-gear and
 * 4-gear candidates ranked together by ascending absolute error -- never cut off after a fixed
 * number of preliminary/2-gear matches, so a closer 4-gear result always outranks a weaker 2-gear
 * one. A buffer beyond maxResults is requested internally so a candidate excluded because its
 * actual helix angle falls outside the valid asin domain can still be backfilled from the ranked
 * pool instead of shrinking the final list. Each surviving candidate is enriched into a
 * ReishauerHelisCombination (actual angle, deviation from betaRequestedDeg, and exact-match flag).
 */
export function findReishauerHelisCombinations(
  mn: number,
  betaRequestedDeg: number,
  targetRatioFullPrecision: number,
  maxResults: number = HELIS_DISPLAY_COUNT,
  internalBufferSize: number = HELIS_INTERNAL_CANDIDATE_COUNT
): ReishauerHelisCombination[] {
  const ranked = rankReishauerCombinations(REISHAUER_GEAR_LIST, targetRatioFullPrecision, internalBufferSize);
  const out: ReishauerHelisCombination[] = [];
  for (const combo of ranked) {
    const actualAngle = reishauerActualHelixAngle(mn, combo.ratio);
    if (actualAngle == null) continue;
    const error = Math.abs(combo.ratio - targetRatioFullPrecision);
    out.push({
      combination: { ...combo, ratio: floorToFixed(combo.ratio, 9) },
      absoluteError: error,
      actualHelixAngleDeg: actualAngle,
      deviationDeg: actualAngle - betaRequestedDeg,
      isPerfectMatch: error === 0,
    });
    if (out.length >= maxResults) break;
  }
  return out;
}
