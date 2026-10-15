// Shared jsPDF drawing helpers for the Spur / Helical / Reishauer production-receipt PDFs.
//
// This translates the visual design of the Android PdfReceiptGenerator.kt (a native
// PdfDocument/Canvas generator) into jsPDF's imperative doc.text()/doc.line()/doc.rect() API.
// It is presentation-only: callers pass already-computed values, nothing here recomputes any
// gear formula.
//
// jsPDF works in millimeters by default for an A4 page (210 x 297mm), unlike Android's PDF which
// works in points at 72dpi (595 x 842). All geometry below is in mm.

import { jsPDF } from "jspdf";

export const PAGE_WIDTH = 210;
export const PAGE_HEIGHT = 297;
export const MARGIN = 14;
export const FOOTER_HEIGHT = 12;
export const CONTENT_BOTTOM = PAGE_HEIGHT - MARGIN - FOOTER_HEIGHT;

export const BLUE_ACCENT: [number, number, number] = [37, 99, 235];
export const PURPLE_ACCENT: [number, number, number] = [147, 51, 234];

const NAVY: [number, number, number] = [15, 23, 42];
const NAVY_LIGHT: [number, number, number] = [30, 41, 59];
const INK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [100, 116, 139];
const LINE: [number, number, number] = [203, 213, 225];
const PANEL_BG: [number, number, number] = [248, 250, 252];
const GREEN: [number, number, number] = [16, 185, 129];
const GREEN_DARK: [number, number, number] = [5, 150, 105];
const WHITE: [number, number, number] = [255, 255, 255];
const HEADER_META: [number, number, number] = [203, 213, 225];

export interface HighlightItem {
  label: string;
  value: string;
  unit: string;
}

export interface KeyValueRow {
  label: string;
  value: string;
  unit: string;
}

export interface WkCard {
  k: number;
  wk: number;
  unit: string;
}

export interface GearComboLike {
  a: number;
  b: number;
  c: number | null;
  d: number | null;
  ratio: number;
}

export interface ComboCardExtra {
  realizedAngle?: string;
  deviation?: string;
  isPerfectMatch?: boolean;
}

function setFont(doc: jsPDF, weight: "normal" | "bold" | "italic") {
  if (weight === "italic") {
    doc.setFont("Roboto", "normal");
  } else {
    doc.setFont("Roboto", weight);
  }
}

export class ReceiptPainter {
  doc: jsPDF;
  private accent: [number, number, number];
  private moduleLabel: string;
  private machineName: string;
  private docNumber: string;
  private generatedAt: string;
  private logoDataUrl: string | null;
  private logoAspect: number;
  private y = MARGIN;
  private currentSectionLabel: string | null = null;
  private pageStarted = false;

  constructor(opts: {
    doc: jsPDF;
    accent: [number, number, number];
    moduleLabel: string;
    machineName: string;
    logoDataUrl?: string | null;
    logoAspect?: number;
  }) {
    this.doc = opts.doc;
    this.accent = opts.accent;
    this.moduleLabel = opts.moduleLabel;
    this.machineName = opts.machineName;
    this.logoDataUrl = opts.logoDataUrl ?? null;
    this.logoAspect = opts.logoAspect ?? 1;
    this.docNumber = `DY-${Date.now().toString().slice(-8)}`;
    this.generatedAt = new Date().toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // -- Pagination -------------------------------------------------------------------------------

  private startNewPage() {
    if (this.pageStarted) {
      this.doc.addPage();
    }
    this.pageStarted = true;
    this.y = MARGIN;
  }

  private drawContinuationHeader() {
    const doc = this.doc;
    doc.setFillColor(...NAVY_LIGHT);
    doc.rect(0, 0, PAGE_WIDTH, 9, "F");
    setFont(doc, "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...WHITE);
    const label = this.currentSectionLabel ? `${this.currentSectionLabel} (devam)` : "DAYAN Dişli Sanayi (devam)";
    doc.text(label, MARGIN, 6);
    setFont(doc, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...HEADER_META);
    doc.text(this.moduleLabel, PAGE_WIDTH - MARGIN, 6, { align: "right" });
    doc.setFillColor(...this.accent);
    doc.rect(0, 9, PAGE_WIDTH, 1, "F");
    this.y = 10 + 6;
  }

  private newPage() {
    this.startNewPage();
    this.drawContinuationHeader();
  }

  private ensureSpace(height: number) {
    if (this.y + height > CONTENT_BOTTOM) {
      this.newPage();
    }
  }

  /** Draws the footer ("Sayfa N / total") on every page. Call once, after all content is drawn. */
  finalizeFooters() {
    const doc = this.doc;
    const total = (doc as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      const footerTop = PAGE_HEIGHT - MARGIN - FOOTER_HEIGHT + 3;
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.25);
      doc.line(MARGIN, footerTop, PAGE_WIDTH - MARGIN, footerTop);

      setFont(doc, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text("DAYAN Dişli Sanayi", MARGIN, footerTop + 5);

      setFont(doc, "normal");
      doc.setFontSize(7.5);
      doc.text(`Bu belge hesaplama çıktısıdır.  •  Oluşturulma: ${this.generatedAt}`, MARGIN, footerTop + 9);

      setFont(doc, "bold");
      doc.setFontSize(8.5);
      doc.text(`Sayfa ${i} / ${total}`, PAGE_WIDTH - MARGIN, footerTop + 5, { align: "right" });
    }
  }

  // -- Header -------------------------------------------------------------------------------------

  drawDocumentHeader() {
    this.startNewPage();
    const doc = this.doc;
    const headerHeight = 32;

    doc.setFillColor(...NAVY);
    doc.rect(0, 0, PAGE_WIDTH, headerHeight, "F");

    let textStartX = MARGIN;
    let logoBottomY = 7;
    if (this.logoDataUrl) {
      const targetH = 10;
      const targetW = targetH * this.logoAspect;
      try {
        doc.addImage(this.logoDataUrl, "PNG", MARGIN, 6, targetW, targetH);
        logoBottomY = 6 + targetH + 3;
      } catch {
        logoBottomY = 7;
      }
      textStartX = MARGIN;
    }

    setFont(doc, "bold");
    doc.setFontSize(15);
    doc.setTextColor(...WHITE);
    doc.text("ÜRETİM REÇETESİ", PAGE_WIDTH - MARGIN, 11, { align: "right" });

    setFont(doc, "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...this.accent);
    doc.text(this.moduleLabel, PAGE_WIDTH - MARGIN, 16, { align: "right" });

    setFont(doc, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...HEADER_META);
    doc.text(`Makine: ${this.machineName}`, textStartX, logoBottomY);
    doc.text(`Tarih: ${this.generatedAt}`, textStartX, logoBottomY + 4.5);

    // Anchored below the module-label accent line (y=16), independent of logo presence, so it
    // never collides with the title even when the logo fails to load and logoBottomY stays small.
    const belgeNoY = Math.max(logoBottomY + 4.5, 21);
    setFont(doc, "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...WHITE);
    doc.text(`Belge No: ${this.docNumber}`, PAGE_WIDTH - MARGIN, belgeNoY, { align: "right" });

    doc.setFillColor(...this.accent);
    doc.rect(0, headerHeight, PAGE_WIDTH, 1.1, "F");

    this.y = headerHeight + 1.1 + 6;
  }

  // -- Section title --------------------------------------------------------------------------

  drawSectionTitle(text: string) {
    this.currentSectionLabel = text;
    this.ensureSpace(10);
    this.y += 2;
    const doc = this.doc;
    doc.setFillColor(...this.accent);
    doc.rect(MARGIN, this.y, 1.4, 5.2, "F");
    setFont(doc, "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(text, MARGIN + 3.5, this.y + 4.2);
    this.y += 9;
  }

  // -- Highlight strip -------------------------------------------------------------------------

  drawHighlightStrip(items: HighlightItem[]) {
    this.ensureSpace(20);
    const doc = this.doc;
    const width = PAGE_WIDTH - 2 * MARGIN;
    const colWidth = width / items.length;
    const top = this.y;
    const height = 18;

    doc.setFillColor(...PANEL_BG);
    doc.rect(MARGIN, top, width, height, "F");
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.25);
    doc.rect(MARGIN, top, width, height, "S");

    items.forEach((item, i) => {
      const cx = MARGIN + colWidth * i + colWidth / 2;
      setFont(doc, "bold");
      doc.setFontSize(6.6);
      doc.setTextColor(...MUTED);
      doc.text(item.label, cx, top + 5, { align: "center" });

      // Shrink value font until value+unit fits the column.
      const maxValueWidth = colWidth - 4;
      let valueSize = 12;
      setFont(doc, "bold");
      const measure = (size: number) => {
        doc.setFontSize(size);
        const vw = doc.getTextWidth(item.value);
        setFont(doc, "normal");
        doc.setFontSize(size * (7.5 / 12));
        const uw = item.unit ? doc.getTextWidth(` ${item.unit}`) : 0;
        setFont(doc, "bold");
        return vw + uw;
      };
      while (valueSize > 6.5 && measure(valueSize) > maxValueWidth) {
        valueSize -= 0.5;
      }
      setFont(doc, "bold");
      doc.setFontSize(valueSize);
      doc.setTextColor(...this.accent);
      const valueWidth = doc.getTextWidth(item.value);
      setFont(doc, "normal");
      const unitSize = Math.max(valueSize * (7.5 / 12), 5.5);
      doc.setFontSize(unitSize);
      const unitWidth = item.unit ? doc.getTextWidth(` ${item.unit}`) : 0;
      const startX = cx - (valueWidth + unitWidth) / 2;
      setFont(doc, "bold");
      doc.setFontSize(valueSize);
      doc.setTextColor(...this.accent);
      doc.text(item.value, startX, top + 11.5);
      if (item.unit) {
        setFont(doc, "normal");
        doc.setFontSize(unitSize);
        doc.setTextColor(...MUTED);
        doc.text(` ${item.unit}`, startX + valueWidth, top + 11.5);
      }

      if (i > 0) {
        doc.setDrawColor(...LINE);
        doc.setLineWidth(0.2);
        doc.line(MARGIN + colWidth * i, top + 2, MARGIN + colWidth * i, top + height - 2);
      }
    });

    this.y = top + height + 7;
  }

  // -- Key/value table -------------------------------------------------------------------------

  drawKeyValueTable(rows: KeyValueRow[]) {
    const doc = this.doc;
    const width = PAGE_WIDTH - 2 * MARGIN;
    const rowHeight = 6.4;

    rows.forEach((row, index) => {
      this.ensureSpace(rowHeight);
      const baseline = this.y + rowHeight / 2 + 1.2;
      setFont(doc, "normal");
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text(row.label, MARGIN, baseline);

      const rightEdge = MARGIN + width;
      setFont(doc, "normal");
      doc.setFontSize(7.5);
      const unitWidth = row.unit ? doc.getTextWidth(` ${row.unit}`) : 0;

      setFont(doc, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      const valueWidth = doc.getTextWidth(row.value);
      const startX = rightEdge - unitWidth - valueWidth;
      doc.text(row.value, startX, baseline);
      if (row.unit) {
        setFont(doc, "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...MUTED);
        doc.text(` ${row.unit}`, startX + valueWidth, baseline);
      }

      if (index < rows.length - 1) {
        doc.setDrawColor(...LINE);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, this.y + rowHeight, MARGIN + width, this.y + rowHeight);
      }
      this.y += rowHeight;
    });
    this.y += 6;
  }

  // -- Wk cards --------------------------------------------------------------------------------

  drawWkCards(values: WkCard[], reishauerStyle = false) {
    this.ensureSpace(22);
    const doc = this.doc;
    const width = PAGE_WIDTH - 2 * MARGIN;
    const gap = 3.5;
    const cardWidth = (width - gap * (values.length - 1)) / values.length;
    const cardHeight = 20;
    const top = this.y;

    values.forEach((v, i) => {
      const left = MARGIN + i * (cardWidth + gap);
      const bg: [number, number, number] = reishauerStyle ? [250, 245, 255] : [239, 246, 255];
      doc.setFillColor(...bg);
      doc.roundedRect(left, top, cardWidth, cardHeight, 2, 2, "F");
      doc.setDrawColor(...this.accent);
      doc.setLineWidth(0.3);
      doc.roundedRect(left, top, cardWidth, cardHeight, 2, 2, "S");

      const cx = left + cardWidth / 2;
      setFont(doc, "bold");
      doc.setFontSize(8);
      doc.setTextColor(...this.accent);
      doc.text(`k = ${v.k}`, cx, top + 6, { align: "center" });

      setFont(doc, "bold");
      doc.setFontSize(11.5);
      doc.setTextColor(...INK);
      doc.text(v.wk.toFixed(4), cx, top + 13, { align: "center" });

      setFont(doc, "normal");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(v.unit, cx, top + 17.5, { align: "center" });
    });

    this.y = top + cardHeight + 7;
  }

  // -- Combination cards -----------------------------------------------------------------------

  drawEmptyCombinationsNote() {
    this.ensureSpace(9);
    const doc = this.doc;
    setFont(doc, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text("Uygun kombinasyon bulunamadı.", MARGIN, this.y + 4);
    this.y += 9;
  }

  drawCombinationCards(
    combinations: GearComboLike[],
    targetRatio: number,
    sectionLabel: string,
    extraFor?: (combo: GearComboLike, index: number) => ComboCardExtra | undefined
  ) {
    this.currentSectionLabel = sectionLabel;
    if (combinations.length === 0) {
      this.drawEmptyCombinationsNote();
      return;
    }
    combinations.forEach((combo, index) => {
      const error = Math.abs(combo.ratio - targetRatio);
      const extra = extraFor?.(combo, index);
      this.drawOneCombinationCard(index + 1, combo, targetRatio, error, extra);
    });
    this.y += 1;
  }

  private drawOneCombinationCard(
    index: number,
    combo: GearComboLike,
    targetRatio: number,
    error: number,
    extra?: ComboCardExtra
  ) {
    const doc = this.doc;
    const isFourGear = combo.c != null && combo.d != null;
    const metricLines: [string, string][] = [
      ["Çark Oranı", combo.ratio.toFixed(6)],
      ["Hedef Oran", targetRatio.toFixed(6)],
      ["Hata", error.toFixed(9)],
    ];
    if (extra?.realizedAngle != null) {
      metricLines.push(["Gerçekleşen Helis Açısı", extra.realizedAngle]);
      if (extra.deviation != null) metricLines.push(["Fark (β)", extra.deviation]);
    }
    const metricsHeight = metricLines.length * 4.6;
    const cardHeight = 7 /* header row */ + 14 /* fraction row */ + metricsHeight + 6;

    this.ensureSpace(cardHeight + 2.5);
    const width = PAGE_WIDTH - 2 * MARGIN;
    const top = this.y;

    doc.setFillColor(...WHITE);
    doc.roundedRect(MARGIN, top, width, cardHeight, 1.7, 1.7, "F");
    const isPerfectMatch = !!extra?.isPerfectMatch;
    doc.setDrawColor(...(isPerfectMatch ? GREEN : LINE));
    doc.setLineWidth(isPerfectMatch ? 0.55 : 0.3);
    doc.roundedRect(MARGIN, top, width, cardHeight, 1.7, 1.7, "S");

    let cy = top + 3;

    setFont(doc, "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(`#${String(index).padStart(2, "0")}`, MARGIN + 3, cy + 2);

    const chipText = isFourGear ? "4 ÇARK" : "2 ÇARK";
    setFont(doc, "bold");
    doc.setFontSize(7);
    doc.setTextColor(...this.accent);
    let chipRight = MARGIN + width - 3;
    doc.text(chipText, chipRight, cy + 2, { align: "right" });
    if (isPerfectMatch) {
      doc.setTextColor(...GREEN_DARK);
      const chipWidth = doc.getTextWidth(chipText);
      chipRight -= chipWidth + 5;
      doc.text("TAM EŞLEŞME", chipRight, cy + 2, { align: "right" });
    }
    cy += 6;

    this.drawFractionRow(MARGIN + 5, cy, combo, isFourGear);
    cy += 13;

    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN + 3, cy, MARGIN + width - 3, cy);
    cy += 4;

    setFont(doc, "normal");
    doc.setFontSize(7.5);
    const colLeft = MARGIN + 3;
    const colRight = MARGIN + 3 + (width / 2 - 3);
    metricLines.forEach(([label, value], i) => {
      const rowY = cy + i * 4.6;
      setFont(doc, "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      doc.text(label, colLeft, rowY);
      setFont(doc, "bold");
      doc.setTextColor(...INK);
      doc.text(value, colRight + (width / 2 - 6), rowY, { align: "right" });
    });

    this.y = top + cardHeight + 2.5;
  }

  private drawFractionRow(startX: number, top: number, combo: GearComboLike, isFourGear: boolean) {
    const doc = this.doc;
    const lineY = top + 6.3;
    let x = startX;

    x += this.drawFraction(x, top, lineY, "A", "B", MUTED, 3.9, true) + 1.5;
    if (isFourGear) {
      setFont(doc, "normal");
      doc.setFontSize(3.9);
      doc.setTextColor(...MUTED);
      doc.text(" × ", x, lineY + 1);
      x += doc.getTextWidth(" × ") + 1.5;
      x += this.drawFraction(x, top, lineY, "C", "D", MUTED, 3.9, true) + 1.5;
    }
    x += 3;
    setFont(doc, "bold");
    doc.setFontSize(4.6);
    doc.setTextColor(...MUTED);
    doc.text("=", x, lineY + 1.4);
    x += doc.getTextWidth("=") + 5;

    x += this.drawFraction(x, top, lineY, String(combo.a), String(combo.b), this.accent, 4.6, false) + 1.5;
    if (isFourGear && combo.c != null && combo.d != null) {
      setFont(doc, "normal");
      doc.setFontSize(3.9);
      doc.setTextColor(...MUTED);
      doc.text(" × ", x, lineY + 1);
      x += doc.getTextWidth(" × ") + 1.5;
      this.drawFraction(x, top, lineY, String(combo.c), String(combo.d), this.accent, 4.6, false);
    }
  }

  /** Draws a stacked numerator / bar / denominator fraction; returns width consumed. */
  private drawFraction(
    startX: number,
    numeratorBaseline: number,
    lineY: number,
    numerator: string,
    denominator: string,
    color: [number, number, number],
    size: number,
    italic: boolean
  ): number {
    const doc = this.doc;
    setFont(doc, italic ? "italic" : "bold");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    if (italic) doc.setFont("Roboto", "normal");
    const width = Math.max(doc.getTextWidth(numerator), doc.getTextWidth(denominator)) + 1.5;
    const cx = startX + width / 2;
    doc.text(numerator, cx, numeratorBaseline + 3.2, { align: "center" });
    doc.setDrawColor(...color);
    doc.setLineWidth(0.25);
    doc.line(cx - width / 2, lineY, cx + width / 2, lineY);
    doc.text(denominator, cx, lineY + 4.3, { align: "center" });
    return width;
  }
}

/** Loads public/logo-header.png as a data URL + aspect ratio for embedding via doc.addImage. */
export async function loadLogoDataUrl(): Promise<{ dataUrl: string; aspect: number } | null> {
  try {
    const res = await fetch("/logo-header.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const aspect: number = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img.width / img.height);
      img.onerror = reject;
      img.src = dataUrl;
    });
    return { dataUrl, aspect };
  } catch {
    return null;
  }
}
