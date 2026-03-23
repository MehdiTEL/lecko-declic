/**
 * DECLIC Premium PDF Report Generator — v2 (cursor-based layout engine)
 *
 * Every drawing function receives a PdfCursor and updates it.
 * No function uses hardcoded Y positions — all coordinates flow
 * through the cursor so pages break cleanly without overlaps.
 *
 * Uses jsPDF programmatic drawing (no html2canvas).
 */
import jsPDF from "jspdf";
import type {
  AnalysisResult,
  AnalysisTask,
  AnalysisSource,
  TaskCategory,
} from "@/types/analysis";
import type {
  TeamAnalysisResult,
  QuickWin,
  TeamJobResult,
} from "@/types/team";
import { DECLIC_PHASES } from "@/types/declic";

// =============================================================================
// TYPES
// =============================================================================

export interface PdfReportData {
  result: AnalysisResult;
  source: AnalysisSource;
  hourlyRate: number;
  nbPeople: number;
}

export interface TeamPdfReportData {
  team: TeamAnalysisResult;
  quickWins: QuickWin[];
  hourlyRates: Record<string, number>; // member.id -> rate
}

type RGB = readonly [number, number, number];

// =============================================================================
// CONSTANTS
// =============================================================================

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_LEFT = 18;
const MARGIN_RIGHT = 18;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 25;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;
const LINE_HEIGHT = 4.5; // for 10pt text

const C = {
  blue: [37, 99, 235] as RGB,
  orange: [245, 158, 11] as RGB,
  emerald: [5, 150, 105] as RGB,
  black: [17, 24, 39] as RGB,
  darkGrey: [55, 65, 81] as RGB,
  grey: [107, 114, 128] as RGB,
  lightBg: [238, 242, 255] as RGB,
  white: [255, 255, 255] as RGB,
  lightGrey: [243, 244, 246] as RGB,
  violet: [124, 58, 237] as RGB,
  amber: [217, 119, 6] as RGB,
};

// Category display order and config
const CAT_ORDER: TaskCategory[] = [
  "automatisable",
  "partiellement_automatisable",
  "difficilement_automatisable",
];
const CAT_CONFIG: Record<TaskCategory, { label: string; color: RGB }> = {
  automatisable: { label: "Automatisable", color: C.emerald },
  partiellement_automatisable: {
    label: "Partiellement automatisable",
    color: C.orange,
  },
  difficilement_automatisable: {
    label: "Difficilement automatisable",
    color: C.grey,
  },
};

// =============================================================================
// CURSOR-BASED LAYOUT ENGINE
// =============================================================================

class PdfCursor {
  pdf: jsPDF;
  y: number;
  pageNum: number;
  totalPages: number;

  constructor(pdf: jsPDF) {
    this.pdf = pdf;
    this.y = MARGIN_TOP;
    this.pageNum = 1;
    this.totalPages = 0;
  }

  /** Check if we have enough vertical space; if not, add a new page */
  ensureSpace(needed: number): void {
    if (this.y + needed > PAGE_H - MARGIN_BOTTOM) {
      this.newPage();
    }
  }

  /** Add a new page and reset cursor to top */
  newPage(): void {
    this.pdf.addPage();
    this.pageNum++;
    this.y = MARGIN_TOP;
  }

  /** Move cursor down by dy mm */
  move(dy: number): void {
    this.y += dy;
  }
}

// =============================================================================
// LOW-LEVEL DRAWING HELPERS
// =============================================================================

function setFill(pdf: jsPDF, c: RGB) {
  pdf.setFillColor(c[0], c[1], c[2]);
}
function setDraw(pdf: jsPDF, c: RGB) {
  pdf.setDrawColor(c[0], c[1], c[2]);
}
function setTextColor(pdf: jsPDF, c: RGB) {
  pdf.setTextColor(c[0], c[1], c[2]);
}

function drawRoundedRect(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill?: RGB,
  stroke?: RGB
) {
  if (fill) setFill(pdf, fill);
  if (stroke) {
    setDraw(pdf, stroke);
    pdf.setLineWidth(0.3);
  }
  pdf.roundedRect(
    x,
    y,
    w,
    h,
    r,
    r,
    fill && stroke ? "FD" : fill ? "F" : "S"
  );
}

function drawLine(
  pdf: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  c: RGB,
  width = 0.5
) {
  setDraw(pdf, c);
  pdf.setLineWidth(width);
  pdf.line(x1, y1, x2, y2);
}

// =============================================================================
// TEXT MEASUREMENT & DRAWING (cursor-safe)
// =============================================================================

/** Convert font size in pt to line height in mm (with 1.3x spacing) */
function lineH(fontSize: number): number {
  return fontSize * 0.3528 * 1.3;
}

/** Measure the height of wrapped text BEFORE drawing */
function measureText(
  pdf: jsPDF,
  text: string,
  maxWidth: number,
  fontSize: number
): { lines: string[]; height: number } {
  pdf.setFontSize(fontSize);
  const lines: string[] = pdf.splitTextToSize(text, maxWidth);
  return { lines, height: lines.length * lineH(fontSize) };
}

/** Draw text and move cursor. Always measures first and calls ensureSpace. */
function drawText(
  cursor: PdfCursor,
  text: string,
  opts: {
    fontSize?: number;
    fontStyle?: string;
    color?: RGB;
    align?: string;
    maxWidth?: number;
    x?: number;
    extraSpaceAfter?: number;
  } = {}
): void {
  const pdf = cursor.pdf;
  const fs = opts.fontSize ?? 10;
  const mw = opts.maxWidth ?? CONTENT_W;
  const x = opts.x ?? MARGIN_LEFT;

  pdf.setFont("helvetica", opts.fontStyle ?? "normal");
  pdf.setFontSize(fs);
  setTextColor(pdf, opts.color ?? C.black);

  const { lines, height } = measureText(pdf, text, mw, fs);
  cursor.ensureSpace(height + 2);

  if (opts.align === "center") {
    pdf.text(lines, x, cursor.y, { align: "center" });
  } else if (opts.align === "right") {
    pdf.text(lines, x, cursor.y, { align: "right" });
  } else {
    pdf.text(lines, x, cursor.y);
  }
  cursor.move(height + (opts.extraSpaceAfter ?? 0));
}

// =============================================================================
// PAGE DECORATIONS (applied after all content is drawn)
// =============================================================================

/** Blue line at top of content pages */
function drawPageHeader(pdf: jsPDF) {
  drawLine(pdf, MARGIN_LEFT, 12, PAGE_W - MARGIN_RIGHT, 12, C.blue, 0.6);
}

/** Footer: "Lecko — Diagnostic DECLIC" left + "Page X / Y" right */
function drawPageFooter(
  pdf: jsPDF,
  pageNum: number,
  totalPages: number
) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  setTextColor(pdf, C.grey);
  pdf.text("Lecko \u2014 Diagnostic D\u00c9CLIC", MARGIN_LEFT, PAGE_H - 14);
  pdf.text(
    `Page ${pageNum} / ${totalPages}`,
    PAGE_W - MARGIN_RIGHT,
    PAGE_H - 14,
    { align: "right" }
  );
}

/** Orange square decoration bottom-left (on every page except cover) */
function drawOrangeDecoration(pdf: jsPDF) {
  drawRoundedRect(pdf, MARGIN_LEFT, PAGE_H - 24, 12, 12, 2, C.orange);
}

/** Section title with blue left bar. Uses and moves cursor. */
function drawSectionTitle(cursor: PdfCursor, title: string): void {
  cursor.ensureSpace(18);
  const pdf = cursor.pdf;
  drawRoundedRect(pdf, MARGIN_LEFT, cursor.y, 3, 10, 1, C.blue);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  setTextColor(pdf, C.black);
  pdf.text(title, MARGIN_LEFT + 8, cursor.y + 7.5);
  cursor.move(16);
}

// =============================================================================
// SCORE CIRCLE (donut arc)
// =============================================================================

function drawCircleScore(
  pdf: jsPDF,
  cx: number,
  cy: number,
  radius: number,
  score: number,
  color: RGB
) {
  const bgColor: RGB = [229, 231, 235];
  const lineW = 3;
  const steps = 72;

  // Background circle
  setDraw(pdf, bgColor);
  pdf.setLineWidth(lineW);
  pdf.circle(cx, cy, radius, "S");

  // Score arc
  if (score > 0) {
    setDraw(pdf, color);
    pdf.setLineWidth(lineW);
    const startAngle = -Math.PI / 2;
    const endAngle =
      startAngle + (2 * Math.PI * Math.min(score, 100)) / 100;
    const segCount = Math.max(1, Math.round(steps * (score / 100)));
    const angleStep = (endAngle - startAngle) / segCount;

    for (let i = 0; i < segCount; i++) {
      const a1 = startAngle + i * angleStep;
      const a2 = startAngle + (i + 1) * angleStep;
      pdf.line(
        cx + radius * Math.cos(a1),
        cy + radius * Math.sin(a1),
        cx + radius * Math.cos(a2),
        cy + radius * Math.sin(a2)
      );
    }
  }

  // Center text
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(42);
  setTextColor(pdf, color);
  pdf.text(`${Math.round(score)}%`, cx, cy + 2, { align: "center" });

  pdf.setFontSize(10);
  setTextColor(pdf, C.grey);
  pdf.setFont("helvetica", "normal");
  pdf.text("automatisable", cx, cy + 10, { align: "center" });
}

// =============================================================================
// RADAR CHART (pentagon)
// =============================================================================

function drawRadarChart(
  pdf: jsPDF,
  cx: number,
  cy: number,
  radius: number,
  values: number[],
  labels: string[]
) {
  const n = 5;
  const angleOffset = -Math.PI / 2;

  function vertex(i: number, r: number): [number, number] {
    const angle = angleOffset + (2 * Math.PI * i) / n;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  // Grid pentagons (25%, 50%, 75%, 100%)
  for (const pct of [0.25, 0.5, 0.75, 1]) {
    setDraw(pdf, C.lightGrey);
    pdf.setLineWidth(0.2);
    for (let i = 0; i < n; i++) {
      const [x1, y1] = vertex(i, radius * pct);
      const [x2, y2] = vertex((i + 1) % n, radius * pct);
      pdf.line(x1, y1, x2, y2);
    }
  }

  // Axes
  setDraw(pdf, [220, 220, 220] as RGB);
  pdf.setLineWidth(0.15);
  for (let i = 0; i < n; i++) {
    const [vx, vy] = vertex(i, radius);
    pdf.line(cx, cy, vx, vy);
  }

  // Value polygon — filled semi-transparent blue
  const valPoints: [number, number][] = values.map((v, i) =>
    vertex(i, radius * v)
  );
  setFill(pdf, [37, 99, 235] as RGB);
  pdf.setGState(new (pdf as any).GState({ opacity: 0.15 }));
  for (let i = 0; i < n; i++) {
    const [x1, y1] = valPoints[i];
    const [x2, y2] = valPoints[(i + 1) % n];
    pdf.triangle(cx, cy, x1, y1, x2, y2, "F");
  }
  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

  // Value polygon outline
  setDraw(pdf, C.blue);
  pdf.setLineWidth(0.7);
  for (let i = 0; i < n; i++) {
    const [x1, y1] = valPoints[i];
    const [x2, y2] = valPoints[(i + 1) % n];
    pdf.line(x1, y1, x2, y2);
  }

  // Dots at values
  for (const [vx, vy] of valPoints) {
    setFill(pdf, C.blue);
    pdf.circle(vx, vy, 1.2, "F");
  }

  // Labels with percentage
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setTextColor(pdf, C.darkGrey);
  const labelOffset = radius + 8;
  for (let i = 0; i < n; i++) {
    const [lx, ly] = vertex(i, labelOffset);
    const pctText = `${Math.round(values[i] * 100)}%`;
    pdf.text(`${labels[i]} (${pctText})`, lx, ly, { align: "center" });
  }
}

// =============================================================================
// TABLE HELPER (cursor-aware)
// =============================================================================

function drawTable(
  cursor: PdfCursor,
  headers: string[],
  rows: string[][],
  colWidths: number[],
  options?: { highlightLastRow?: boolean }
): void {
  const pdf = cursor.pdf;
  const rowH = 8;
  const headerH = 9;
  const tableW = colWidths.reduce((a, b) => a + b, 0);
  const totalH = headerH + rows.length * rowH;

  cursor.ensureSpace(Math.min(totalH, headerH + 3 * rowH)); // at least header + 3 rows

  const x = MARGIN_LEFT;

  // Header
  drawRoundedRect(pdf, x, cursor.y, tableW, headerH, 1, C.blue);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  setTextColor(pdf, C.white);
  let curX = x;
  for (let i = 0; i < headers.length; i++) {
    pdf.text(headers[i], curX + 3, cursor.y + 6);
    curX += colWidths[i];
  }
  cursor.move(headerH);

  // Rows
  pdf.setFontSize(9);
  for (let r = 0; r < rows.length; r++) {
    cursor.ensureSpace(rowH + 2);
    const isLast = r === rows.length - 1 && options?.highlightLastRow;
    const bg: RGB = isLast
      ? [238, 242, 255]
      : r % 2 === 0
        ? C.white
        : C.lightGrey;
    drawRoundedRect(pdf, x, cursor.y, tableW, rowH, 0, bg);

    curX = x;
    for (let c = 0; c < rows[r].length; c++) {
      const isValue = c === rows[r].length - 1;
      pdf.setFont("helvetica", isLast || isValue ? "bold" : "normal");
      setTextColor(pdf, isLast && isValue ? C.blue : C.black);
      pdf.text(rows[r][c], curX + 3, cursor.y + 5.5);
      curX += colWidths[c];
    }
    cursor.move(rowH);
  }
}

// =============================================================================
// ROI UTILITIES
// =============================================================================

function formatEur(n: number): string {
  return Math.round(n).toLocaleString("fr-FR") + " \u20ac";
}

function getComparison(annualEur: number): string {
  if (annualEur <= 0) return "";
  if (annualEur < 10000)
    return `l'\u00e9quivalent de ${Math.round(annualEur / 750)} jours de prestation conseil`;
  if (annualEur < 30000) return "l'\u00e9quivalent d'un mi-temps";
  if (annualEur < 60000)
    return "l'\u00e9quivalent d'un salaire junior \u00e0 temps plein";
  return `l'\u00e9quivalent de ${(annualEur / 35000).toFixed(1)} collaborateurs \u00e0 temps plein`;
}

function getSynthesisText(
  metier: string,
  score: number,
  autoCount: number,
  total: number,
  hours: number
): string {
  if (score > 70) {
    return `Votre m\u00e9tier de ${metier} pr\u00e9sente un potentiel d'automatisation \u00e9lev\u00e9. ${autoCount} t\u00e2ches sur ${total} sont directement automatisables, repr\u00e9sentant ${hours.toFixed(1)}h d'\u00e9conomie hebdomadaire. Nous recommandons de d\u00e9marrer imm\u00e9diatement par les quick wins identifi\u00e9s.`;
  }
  if (score >= 40) {
    return `Votre m\u00e9tier de ${metier} offre des opportunit\u00e9s d'automatisation significatives. ${autoCount} t\u00e2ches peuvent \u00eatre optimis\u00e9es, avec un gain potentiel de ${hours.toFixed(1)}h par semaine. Une approche progressive en commen\u00e7ant par les t\u00e2ches les mieux scor\u00e9es est recommand\u00e9e.`;
  }
  return `Votre m\u00e9tier de ${metier} comporte des t\u00e2ches \u00e0 forte valeur humaine. ${autoCount} t\u00e2ches peuvent n\u00e9anmoins b\u00e9n\u00e9ficier d'une assistance IA, avec un gain de ${hours.toFixed(1)}h par semaine. L'accompagnement se concentrera sur l'IA assistive plut\u00f4t que l'automatisation compl\u00e8te.`;
}

function getBullets(score: number): string[] {
  if (score > 70) {
    return [
      "Identifier les quick wins \u00e0 activer en moins de 2 semaines",
      "Construire une roadmap d'automatisation sur mesure",
      "D\u00e9ployer les bons outils (M365, agents IA, N8N, Power Automate)",
      "Former vos \u00e9quipes pour une adoption durable",
    ];
  }
  if (score >= 40) {
    return [
      "Valider les automatisations les plus rentables pour votre contexte",
      "Recommander les outils adapt\u00e9s \u00e0 votre environnement",
      "Estimer le ROI concret de chaque action",
    ];
  }
  return [
    "D\u00e9ployer Microsoft 365 et les usages collaboratifs",
    "Int\u00e9grer l'IA assistive (Copilot, Claude) dans le quotidien",
    "Conduite du changement et adoption des outils",
  ];
}

function computeScoreCriteres(
  criteres?: AnalysisTask["criteres"]
): number {
  if (!criteres) return 0;
  return [
    criteres.recurrence,
    criteres.energie,
    criteres.scalabilite,
    criteres.fiabilite,
    criteres.penibilite,
  ].filter(Boolean).length;
}

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

// =============================================================================
// PAGE 1 — COVER
// =============================================================================

function drawCoverPage(
  pdf: jsPDF,
  metier: string,
  source: AnalysisSource
): void {
  // "DECLIC" top-left in blue bold 22pt
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  setTextColor(pdf, C.blue);
  pdf.text("D\u00c9CLIC", MARGIN_LEFT, 30);

  // "par Lecko" in grey 10pt below
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  setTextColor(pdf, C.grey);
  pdf.text("par Lecko", MARGIN_LEFT, 37);

  // Centered: "DIAGNOSTIC IA" in black bold 28pt
  const centerY = 120;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  setTextColor(pdf, C.black);
  pdf.text("DIAGNOSTIC IA", PAGE_W / 2, centerY, { align: "center" });

  // Metier name in orange bold 20pt
  pdf.setFontSize(20);
  setTextColor(pdf, C.orange);
  pdf.text(metier, PAGE_W / 2, centerY + 14, { align: "center" });

  // Blue decorative line (60mm)
  drawLine(
    pdf,
    PAGE_W / 2 - 30,
    centerY + 22,
    PAGE_W / 2 + 30,
    centerY + 22,
    C.blue,
    0.8
  );

  // Date at bottom
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  setTextColor(pdf, C.grey);
  pdf.text(today, PAGE_W / 2, PAGE_H - 60, { align: "center" });

  pdf.setFontSize(9);
  pdf.text(
    "Rapport g\u00e9n\u00e9r\u00e9 automatiquement par la plateforme D\u00c9CLIC",
    PAGE_W / 2,
    PAGE_H - 52,
    { align: "center" }
  );

  // Source badge
  const sourceLabel =
    source === "api" ? "Analyse IA personnalis\u00e9e" : "Analyse g\u00e9n\u00e9rique";
  pdf.setFontSize(8);
  const badgeW = pdf.getTextWidth(sourceLabel) + 8;
  const badgeX = PAGE_W / 2 - badgeW / 2;
  drawRoundedRect(pdf, badgeX, PAGE_H - 46, badgeW, 7, 2, C.lightBg, C.blue);
  pdf.setFont("helvetica", "bold");
  setTextColor(pdf, C.blue);
  pdf.text(sourceLabel, PAGE_W / 2, PAGE_H - 41.5, { align: "center" });

  // Orange decorative square bottom-left (12x12mm, radius 2mm)
  drawRoundedRect(pdf, MARGIN_LEFT, PAGE_H - 30, 12, 12, 2, C.orange);
}

// =============================================================================
// PAGE 2 — EXECUTIVE SUMMARY
// =============================================================================

function drawSynthesePage(
  cursor: PdfCursor,
  result: AnalysisResult,
  _source: AnalysisSource
): void {
  const pdf = cursor.pdf;

  // Blue banner full width at top (22mm high)
  setFill(pdf, C.blue);
  pdf.rect(0, 0, PAGE_W, 22, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  setTextColor(pdf, C.white);
  pdf.text("SYNTH\u00c8SE EX\u00c9CUTIVE", PAGE_W / 2, 14, { align: "center" });

  // Score circle centered below banner
  cursor.y = 30;
  const circleCY = cursor.y + 22;
  drawCircleScore(pdf, PAGE_W / 2, circleCY, 22, result.score_global, C.blue);
  cursor.y = circleCY + 16;
  cursor.move(4);

  // 3 KPI boxes in a row
  const autoCount = result.taches.filter(
    (t) => t.categorie === "automatisable"
  ).length;
  const kpis = [
    { value: String(result.taches.length), label: "t\u00e2ches analys\u00e9es", color: C.blue },
    { value: String(autoCount), label: "automatisables", color: C.emerald },
    {
      value: `${result.heures_economisees_semaine.toFixed(1)}h`,
      label: "/ semaine gagn\u00e9es",
      color: C.orange,
    },
  ];

  const kpiW = 55;
  const kpiGap = 5;
  const kpiStartX =
    MARGIN_LEFT + (CONTENT_W - 3 * kpiW - 2 * kpiGap) / 2;

  cursor.ensureSpace(32);
  for (let i = 0; i < 3; i++) {
    const x = kpiStartX + i * (kpiW + kpiGap);
    drawRoundedRect(pdf, x, cursor.y, kpiW, 28, 3, C.white, C.lightGrey);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    setTextColor(pdf, kpis[i].color);
    pdf.text(kpis[i].value, x + kpiW / 2, cursor.y + 14, {
      align: "center",
    });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.grey);
    pdf.text(kpis[i].label, x + kpiW / 2, cursor.y + 22, {
      align: "center",
    });
  }
  cursor.move(34);

  // Synthesis text box with light blue background
  const synthText = getSynthesisText(
    result.metier,
    result.score_global,
    autoCount,
    result.taches.length,
    result.heures_economisees_semaine
  );
  const { lines: synthLines, height: synthH } = measureText(
    pdf,
    synthText,
    CONTENT_W - 12,
    10
  );
  const boxH = synthH + 18;

  cursor.ensureSpace(boxH + 4);
  drawRoundedRect(pdf, MARGIN_LEFT, cursor.y, CONTENT_W, boxH, 3, C.lightBg);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  setTextColor(pdf, C.blue);
  pdf.text("R\u00e9sum\u00e9", MARGIN_LEFT + 6, cursor.y + 9);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  setTextColor(pdf, C.darkGrey);
  pdf.text(synthLines, MARGIN_LEFT + 6, cursor.y + 18);
  cursor.move(boxH + 4);

  // "Top 3 Quick Wins" section
  const quickWinTasks = [...result.taches]
    .filter((t) => t.categorie === "automatisable")
    .sort(
      (a, b) =>
        (b.score_criteres ?? computeScoreCriteres(b.criteres)) -
        (a.score_criteres ?? computeScoreCriteres(a.criteres))
    )
    .slice(0, 3);

  if (quickWinTasks.length > 0) {
    cursor.ensureSpace(10 + quickWinTasks.length * 16);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    setTextColor(pdf, C.black);
    pdf.text("Top 3 Quick Wins", MARGIN_LEFT + 6, cursor.y);
    cursor.move(6);

    for (let qi = 0; qi < quickWinTasks.length; qi++) {
      const qw = quickWinTasks[qi];
      const qwRowH = 14;

      cursor.ensureSpace(qwRowH + 2);

      // Row background (alternating)
      drawRoundedRect(
        pdf,
        MARGIN_LEFT,
        cursor.y,
        CONTENT_W,
        qwRowH,
        2,
        qi % 2 === 0 ? C.lightBg : C.white
      );

      // Number circle
      setFill(pdf, C.emerald);
      pdf.circle(MARGIN_LEFT + 6, cursor.y + qwRowH / 2, 3, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      setTextColor(pdf, C.white);
      pdf.text(String(qi + 1), MARGIN_LEFT + 6, cursor.y + qwRowH / 2 + 1, {
        align: "center",
      });

      // Task name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      setTextColor(pdf, C.black);
      const nameMaxW = CONTENT_W - 80;
      const truncName = pdf.splitTextToSize(qw.nom, nameMaxW)[0];
      pdf.text(truncName, MARGIN_LEFT + 13, cursor.y + 5);

      // Hours saved
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      setTextColor(pdf, C.emerald);
      pdf.text(
        `~${qw.temps_gagne_heures_semaine}h/sem`,
        MARGIN_LEFT + 13,
        cursor.y + 11
      );

      // Tool badge
      pdf.setFontSize(7);
      const toolLabel = qw.type_outil;
      const toolBW = pdf.getTextWidth(toolLabel) + 6;
      const toolBX = PAGE_W - MARGIN_RIGHT - toolBW - 4;
      drawRoundedRect(
        pdf,
        toolBX,
        cursor.y + 3,
        toolBW,
        6,
        2,
        C.lightBg,
        C.blue
      );
      setTextColor(pdf, C.blue);
      pdf.setFont("helvetica", "bold");
      pdf.text(toolLabel, toolBX + 3, cursor.y + 7);

      cursor.move(qwRowH + 2);
    }
  }
}

// =============================================================================
// PAGE 3 — ROI
// =============================================================================

function drawRoiPage(
  cursor: PdfCursor,
  result: AnalysisResult,
  hourlyRate: number,
  nbPeople: number
): void {
  const pdf = cursor.pdf;

  drawSectionTitle(cursor, "RETOUR SUR INVESTISSEMENT");
  cursor.move(4);

  const hrs = result.heures_economisees_semaine;
  const weekEur = hrs * hourlyRate * nbPeople;
  const monthEur = weekEur * 4.33;
  const yearEur = weekEur * 47;
  const etp = (hrs * nbPeople) / 35;

  // ROI Table
  drawTable(
    cursor,
    ["Indicateur", "Valeur"],
    [
      ["Heures gagn\u00e9es / semaine", `${hrs.toFixed(1)}h`],
      ["Co\u00fbt horaire charg\u00e9", `${hourlyRate} \u20ac/h`],
      ["Personnes concern\u00e9es", String(nbPeople)],
      ["\u00c9conomie / semaine", formatEur(weekEur)],
      ["\u00c9conomie / mois", formatEur(monthEur)],
      ["\u00c9conomie / an", formatEur(yearEur)],
      ["\u00c9quivalent ETP", etp.toFixed(2)],
    ],
    [100, 80],
    { highlightLastRow: true }
  );
  cursor.move(8);

  // "A retenir" callout with orange left border
  const comparison = getComparison(yearEur);
  const calloutText = `Votre \u00e9conomie annuelle de ${formatEur(yearEur)} repr\u00e9sente ${comparison}.`;
  const { lines: calloutLines, height: calloutTextH } = measureText(
    pdf,
    calloutText,
    CONTENT_W - 16,
    9
  );
  const calloutH = Math.max(18, 10 + calloutTextH);

  cursor.ensureSpace(calloutH + 4);
  drawRoundedRect(
    pdf,
    MARGIN_LEFT,
    cursor.y,
    CONTENT_W,
    calloutH,
    3,
    [255, 251, 235] as RGB
  );
  drawRoundedRect(pdf, MARGIN_LEFT, cursor.y, 3, calloutH, 1, C.orange);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setTextColor(pdf, C.orange);
  pdf.text("\u00c0 RETENIR", MARGIN_LEFT + 8, cursor.y + 7);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  setTextColor(pdf, C.darkGrey);
  pdf.text(calloutLines, MARGIN_LEFT + 8, cursor.y + 13);
  cursor.move(calloutH + 12);

  // 3 horizontal projection bars (6mo / 12mo / 24mo)
  cursor.ensureSpace(50);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  setTextColor(pdf, C.black);
  pdf.text("Projections", MARGIN_LEFT, cursor.y);
  cursor.move(8);

  const projections = [
    { label: "6 mois", value: monthEur * 6 },
    { label: "12 mois", value: yearEur },
    { label: "24 mois", value: yearEur * 2 },
  ];
  const maxVal = projections[projections.length - 1].value;
  const barMaxW = CONTENT_W - 50;

  for (const proj of projections) {
    cursor.ensureSpace(12);
    const barW = maxVal > 0 ? (proj.value / maxVal) * barMaxW : 0;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setTextColor(pdf, C.darkGrey);
    pdf.text(proj.label, MARGIN_LEFT, cursor.y + 5);

    drawRoundedRect(pdf, MARGIN_LEFT + 28, cursor.y, barW, 7, 2, C.blue);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    setTextColor(pdf, C.blue);
    pdf.text(formatEur(proj.value), MARGIN_LEFT + 30 + barW, cursor.y + 5);

    cursor.move(12);
  }
  cursor.move(6);

  // Per-task breakdown table: Task | Hours/week | EUR/week
  cursor.ensureSpace(30);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  setTextColor(pdf, C.black);
  pdf.text("D\u00e9tail par t\u00e2che", MARGIN_LEFT, cursor.y);
  cursor.move(6);

  const roiColWidths = [CONTENT_W - 50, 25, 25];
  const roiRows: string[][] = result.taches
    .filter((t) => t.temps_gagne_heures_semaine > 0)
    .sort((a, b) => b.temps_gagne_heures_semaine - a.temps_gagne_heures_semaine)
    .map((t) => {
      const taskWeekEur = t.temps_gagne_heures_semaine * hourlyRate * nbPeople;
      const name =
        t.nom.length > 40 ? t.nom.substring(0, 38) + "\u2026" : t.nom;
      return [
        name,
        `${t.temps_gagne_heures_semaine.toFixed(1)}`,
        formatEur(taskWeekEur),
      ];
    });

  if (roiRows.length > 0) {
    const totalHrs = result.taches.reduce(
      (s, t) => s + t.temps_gagne_heures_semaine,
      0
    );
    roiRows.push(["TOTAL", `${totalHrs.toFixed(1)}`, formatEur(weekEur)]);
    drawTable(cursor, ["T\u00e2che", "h/sem", "\u20ac/sem"], roiRows, roiColWidths, {
      highlightLastRow: true,
    });
  }
}

// =============================================================================
// PAGE 4 — RADAR CHART
// =============================================================================

function drawRadarPage(cursor: PdfCursor, tasks: AnalysisTask[]): void {
  const pdf = cursor.pdf;

  drawSectionTitle(cursor, "\u00c9VALUATION MULTICRIT\u00c8RES");

  // Compute averages
  const critereKeys = [
    "recurrence",
    "energie",
    "scalabilite",
    "fiabilite",
    "penibilite",
  ] as const;
  const critereLabels = [
    "R\u00e9currence",
    "\u00c9nergie",
    "Scalabilit\u00e9",
    "Fiabilit\u00e9",
    "P\u00e9nibilit\u00e9",
  ];
  const tasksWithCriteres = tasks.filter((t) => t.criteres);
  const total = tasksWithCriteres.length || 1;
  const values = critereKeys.map(
    (key) => tasksWithCriteres.filter((t) => t.criteres?.[key]).length / total
  );

  // Radar chart centered on page
  cursor.ensureSpace(100);
  const radarCY = cursor.y + 45;
  drawRadarChart(pdf, PAGE_W / 2, radarCY, 38, values, critereLabels);
  cursor.y = radarCY + 50;
  cursor.move(4);

  // 5 criterion explanations
  for (let i = 0; i < 5; i++) {
    cursor.ensureSpace(10);
    const pct = Math.round(values[i] * 100);
    setFill(pdf, pct > 50 ? C.blue : C.lightGrey);
    pdf.circle(MARGIN_LEFT + 4, cursor.y + 2, 2, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setTextColor(pdf, C.black);
    pdf.text(
      `${critereLabels[i]} \u2014 ${pct}%`,
      MARGIN_LEFT + 10,
      cursor.y + 3
    );
    cursor.move(8);
  }
  cursor.move(6);

  // Interpretation callout
  const maxIdx = values.indexOf(Math.max(...values));
  const minIdx = values.indexOf(Math.min(...values));
  const interpText = `Vos t\u00e2ches sont particuli\u00e8rement caract\u00e9ris\u00e9es par la ${critereLabels[maxIdx].toLowerCase()} (${Math.round(values[maxIdx] * 100)}%). Le levier ${critereLabels[minIdx].toLowerCase()} (${Math.round(values[minIdx] * 100)}%) est moins pr\u00e9sent, ce qui oriente vers une automatisation assist\u00e9e plut\u00f4t que compl\u00e8te sur certaines t\u00e2ches.`;

  const { lines: interpLines, height: interpTextH } = measureText(
    pdf,
    interpText,
    CONTENT_W - 16,
    9
  );
  const interpH = 12 + interpTextH;

  cursor.ensureSpace(interpH + 4);
  drawRoundedRect(
    pdf,
    MARGIN_LEFT,
    cursor.y,
    CONTENT_W,
    interpH,
    3,
    C.lightBg
  );
  drawRoundedRect(pdf, MARGIN_LEFT, cursor.y, 3, interpH, 1, C.blue);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setTextColor(pdf, C.blue);
  pdf.text("INTERPR\u00c9TATION", MARGIN_LEFT + 8, cursor.y + 7);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  setTextColor(pdf, C.darkGrey);
  pdf.text(interpLines, MARGIN_LEFT + 8, cursor.y + 13);
  cursor.move(interpH + 4);
}

// =============================================================================
// PAGES 5+ — TASK CARDS
// =============================================================================

/** Measure the total height a task card will need (all optional fields) */
function estimateTaskCardHeight(
  pdf: jsPDF,
  task: AnalysisTask
): number {
  const textW = CONTENT_W - 16;
  const descH = measureText(pdf, task.description, textW, 9).height;
  const solH = measureText(pdf, task.solution, textW, 9).height;
  let h = 28 + descH + solH + 16; // header + desc + solution + padding

  if (task.process_actuel) {
    h += 10 + measureText(pdf, task.process_actuel, textW, 9).height;
  }
  if (task.process_cible) {
    h += 10 + measureText(pdf, task.process_cible, textW, 9).height;
  }
  if (task.etapes_mise_en_place && task.etapes_mise_en_place.length > 0) {
    h += 10;
    for (const step of task.etapes_mise_en_place) {
      h += measureText(pdf, step, textW - 10, 9).height;
    }
  }
  if (task.prerequis && task.prerequis.length > 0) {
    h += 10 + task.prerequis.length * 5;
  }
  if (task.limites) {
    h += 10 + measureText(pdf, task.limites, textW, 9).height;
  }
  if (task.niveau_autonomie) {
    h += 8;
  }
  return h;
}

function drawTaskPages(
  cursor: PdfCursor,
  tasks: AnalysisTask[],
  hourlyRate: number,
  nbPeople: number
): void {
  const pdf = cursor.pdf;
  const textW = CONTENT_W - 16;

  // Sort tasks by category
  const sorted = [...tasks].sort(
    (a, b) => CAT_ORDER.indexOf(a.categorie) - CAT_ORDER.indexOf(b.categorie)
  );

  let currentCat: TaskCategory | null = null;

  for (const task of sorted) {
    const cardH = estimateTaskCardHeight(pdf, task);

    // Category header
    if (task.categorie !== currentCat) {
      currentCat = task.categorie;
      const catConf = CAT_CONFIG[currentCat];
      const catTasks = sorted.filter((t) => t.categorie === currentCat);

      // Need space for header + at least start of card
      cursor.ensureSpace(14 + Math.min(cardH, 60));

      drawRoundedRect(
        pdf,
        MARGIN_LEFT,
        cursor.y,
        CONTENT_W,
        10,
        2,
        catConf.color
      );
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      setTextColor(pdf, C.white);
      pdf.text(
        `${catConf.label} (${catTasks.length} t\u00e2che${catTasks.length > 1 ? "s" : ""})`,
        MARGIN_LEFT + 5,
        cursor.y + 7
      );
      cursor.move(14);
    }

    // If the card fits on current page, draw it; otherwise start a new page
    cursor.ensureSpace(Math.min(cardH, 60));

    // Card shadow + body
    const cardStartY = cursor.y;
    drawRoundedRect(
      pdf,
      MARGIN_LEFT + 1,
      cursor.y + 1,
      CONTENT_W - 2,
      cardH - 2,
      3,
      [230, 230, 230] as RGB
    );
    drawRoundedRect(
      pdf,
      MARGIN_LEFT,
      cursor.y,
      CONTENT_W - 2,
      cardH - 2,
      3,
      C.white,
      C.lightGrey
    );

    cursor.move(6);

    // ── Task name + score badge + tool type ──
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    setTextColor(pdf, C.black);
    pdf.text(task.nom, MARGIN_LEFT + 5, cursor.y);

    const score =
      task.score_criteres ?? computeScoreCriteres(task.criteres);
    const scoreColor: RGB =
      score >= 3 ? C.emerald : score === 2 ? C.orange : C.grey;
    const scoreText = `${score}/5`;
    const scoreBadgeW = 14;
    drawRoundedRect(
      pdf,
      PAGE_W - MARGIN_RIGHT - scoreBadgeW - 8,
      cursor.y - 4,
      scoreBadgeW,
      6,
      2,
      scoreColor
    );
    pdf.setFontSize(7);
    setTextColor(pdf, C.white);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      scoreText,
      PAGE_W - MARGIN_RIGHT - scoreBadgeW / 2 - 8,
      cursor.y - 0.5,
      { align: "center" }
    );

    // Tool badge
    pdf.setFontSize(7);
    const toolW = pdf.getTextWidth(task.type_outil) + 6;
    const toolBadgeX =
      PAGE_W - MARGIN_RIGHT - scoreBadgeW - 10 - toolW;
    drawRoundedRect(
      pdf,
      toolBadgeX,
      cursor.y - 4,
      toolW,
      6,
      2,
      C.lightBg
    );
    setTextColor(pdf, C.blue);
    pdf.text(task.type_outil, toolBadgeX + 3, cursor.y - 0.5);

    // Niveau d'autonomie badge
    if (task.niveau_autonomie) {
      const autoLabels: Record<string, string> = {
        autonome: "Autonome",
        guide: "Guid\u00e9",
        expert: "Expert",
      };
      const autoColors: Record<string, RGB> = {
        autonome: C.emerald,
        guide: C.blue,
        expert: C.orange,
      };
      const autoLabel =
        autoLabels[task.niveau_autonomie] ?? task.niveau_autonomie;
      const autoColor = autoColors[task.niveau_autonomie] ?? C.grey;
      pdf.setFontSize(7);
      const autoBW = pdf.getTextWidth(autoLabel) + 6;
      drawRoundedRect(
        pdf,
        PAGE_W - MARGIN_RIGHT - autoBW - 8,
        cursor.y + 3,
        autoBW,
        6,
        2,
        autoColor
      );
      setTextColor(pdf, C.white);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        autoLabel,
        PAGE_W - MARGIN_RIGHT - autoBW - 5,
        cursor.y + 7
      );
    }
    cursor.move(6);

    // ── Description ──
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.darkGrey);
    const { lines: descL, height: descH } = measureText(
      pdf,
      task.description,
      textW,
      9
    );
    pdf.text(descL, MARGIN_LEFT + 5, cursor.y);
    cursor.move(descH + 3);

    // ── AVANT (process_actuel) ──
    if (task.process_actuel) {
      cursor.ensureSpace(14);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      setTextColor(pdf, C.orange);
      pdf.text("AVANT \u2014 Processus actuel", MARGIN_LEFT + 5, cursor.y);
      cursor.move(4);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      setTextColor(pdf, C.darkGrey);
      const { lines: actL, height: actH } = measureText(
        pdf,
        task.process_actuel,
        textW,
        9
      );
      pdf.text(actL, MARGIN_LEFT + 5, cursor.y);
      cursor.move(actH + 3);
    }

    // ── APRES (process_cible) ──
    if (task.process_cible) {
      cursor.ensureSpace(14);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      setTextColor(pdf, C.emerald);
      pdf.text("APR\u00c8S \u2014 Processus cible", MARGIN_LEFT + 5, cursor.y);
      cursor.move(4);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      setTextColor(pdf, C.darkGrey);
      const { lines: cibL, height: cibH } = measureText(
        pdf,
        task.process_cible,
        textW,
        9
      );
      pdf.text(cibL, MARGIN_LEFT + 5, cursor.y);
      cursor.move(cibH + 3);
    }

    // ── Solution ──
    cursor.ensureSpace(14);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    setTextColor(pdf, C.grey);
    pdf.text("SOLUTION RECOMMAND\u00c9E", MARGIN_LEFT + 5, cursor.y);
    cursor.move(4);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.darkGrey);
    const { lines: solL, height: solH } = measureText(
      pdf,
      task.solution,
      textW,
      9
    );
    pdf.text(solL, MARGIN_LEFT + 5, cursor.y);
    cursor.move(solH + 3);

    // ── Etapes de mise en place ──
    if (task.etapes_mise_en_place && task.etapes_mise_en_place.length > 0) {
      cursor.ensureSpace(14);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      setTextColor(pdf, C.blue);
      pdf.text("\u00c9TAPES DE MISE EN PLACE", MARGIN_LEFT + 5, cursor.y);
      cursor.move(4);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      setTextColor(pdf, C.darkGrey);
      for (let si = 0; si < task.etapes_mise_en_place.length; si++) {
        const stepText = `${si + 1}. ${task.etapes_mise_en_place[si]}`;
        const { lines: stepL, height: stepH } = measureText(
          pdf,
          stepText,
          textW - 5,
          9
        );
        cursor.ensureSpace(stepH + 1);
        pdf.text(stepL, MARGIN_LEFT + 8, cursor.y);
        cursor.move(stepH);
      }
      cursor.move(2);
    }

    // ── Prerequis ──
    if (task.prerequis && task.prerequis.length > 0) {
      cursor.ensureSpace(14);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      setTextColor(pdf, C.violet);
      pdf.text("PR\u00c9REQUIS", MARGIN_LEFT + 5, cursor.y);
      cursor.move(4);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      setTextColor(pdf, C.darkGrey);
      for (const pr of task.prerequis) {
        cursor.ensureSpace(6);
        pdf.text(`\u2022 ${pr}`, MARGIN_LEFT + 8, cursor.y);
        cursor.move(5);
      }
      cursor.move(1);
    }

    // ── Limites ──
    if (task.limites) {
      cursor.ensureSpace(14);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      setTextColor(pdf, C.amber);
      pdf.text("LIMITES", MARGIN_LEFT + 5, cursor.y);
      cursor.move(4);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      setTextColor(pdf, C.darkGrey);
      const { lines: limL, height: limH } = measureText(
        pdf,
        task.limites,
        textW,
        9
      );
      pdf.text(limL, MARGIN_LEFT + 5, cursor.y);
      cursor.move(limH + 3);
    }

    // ── Metrics row: hours/week + ROI/week ──
    cursor.ensureSpace(10);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    setTextColor(pdf, C.blue);
    pdf.text(
      `~${task.temps_gagne_heures_semaine}h / semaine`,
      MARGIN_LEFT + 5,
      cursor.y
    );

    const roiWeek = task.temps_gagne_heures_semaine * hourlyRate * nbPeople;
    if (roiWeek > 0) {
      setTextColor(pdf, C.emerald);
      pdf.text(`~${formatEur(roiWeek)}/sem.`, MARGIN_LEFT + 45, cursor.y);
    }

    // IA badge
    if (task.peut_fonctionner_sans_ia === true) {
      drawRoundedRect(
        pdf,
        MARGIN_LEFT + 90,
        cursor.y - 3,
        16,
        5,
        2,
        C.emerald
      );
      pdf.setFontSize(6);
      setTextColor(pdf, C.white);
      pdf.text("Sans IA", MARGIN_LEFT + 92, cursor.y);
    } else if (task.peut_fonctionner_sans_ia === false) {
      drawRoundedRect(
        pdf,
        MARGIN_LEFT + 90,
        cursor.y - 3,
        24,
        5,
        2,
        C.violet
      );
      pdf.setFontSize(6);
      setTextColor(pdf, C.white);
      pdf.text("IA recommand\u00e9e", MARGIN_LEFT + 92, cursor.y);
    }

    // Criteria dots
    if (task.criteres) {
      const dotX = CONTENT_W - 15;
      const keys = [
        "recurrence",
        "energie",
        "scalabilite",
        "fiabilite",
        "penibilite",
      ] as const;
      for (let d = 0; d < 5; d++) {
        setFill(
          pdf,
          task.criteres[keys[d]] ? C.blue : ([220, 220, 220] as RGB)
        );
        pdf.circle(MARGIN_LEFT + dotX + d * 4, cursor.y - 1, 1.2, "F");
      }
    }

    // Move past the card (use estimated height to account for the card background)
    const actualH = cursor.y - cardStartY + 6;
    cursor.y = cardStartY + Math.max(cardH, actualH) + 3;
  }
}

// =============================================================================
// DECLIC PHASES PAGE
// =============================================================================

function drawParcoursPage(cursor: PdfCursor): void {
  const pdf = cursor.pdf;

  drawSectionTitle(cursor, "VOTRE PARCOURS D\u00c9CLIC");
  cursor.move(6);

  for (let i = 0; i < DECLIC_PHASES.length; i++) {
    const phase = DECLIC_PHASES[i];
    const isCompleted = i <= 2; // phases 0-2 done via diagnostic
    const rgb = hexToRgb(phase.color);

    cursor.ensureSpace(32);

    // Colored circle
    setFill(pdf, rgb);
    pdf.circle(MARGIN_LEFT + 10, cursor.y + 5, 5, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setTextColor(pdf, C.white);
    pdf.text(String(i), MARGIN_LEFT + 10, cursor.y + 6.5, {
      align: "center",
    });

    // Connecting line (except last)
    if (i < DECLIC_PHASES.length - 1) {
      drawLine(
        pdf,
        MARGIN_LEFT + 10,
        cursor.y + 10,
        MARGIN_LEFT + 10,
        cursor.y + 30,
        C.lightGrey,
        0.4
      );
    }

    // Phase name
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    setTextColor(pdf, C.black);
    pdf.text(phase.label, MARGIN_LEFT + 22, cursor.y + 4);

    // Description
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.grey);
    const { lines: descLines, height: descH } = measureText(
      pdf,
      phase.description,
      CONTENT_W - 35,
      9
    );
    pdf.text(descLines, MARGIN_LEFT + 22, cursor.y + 10);

    // Status
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    if (isCompleted) {
      setTextColor(pdf, C.emerald);
      pdf.text(
        "\u2713 Compl\u00e9t\u00e9",
        MARGIN_LEFT + 22,
        cursor.y + 10 + descH + 2
      );
    } else {
      setTextColor(pdf, C.orange);
      pdf.text(
        "\u2192 Prochaine \u00e9tape",
        MARGIN_LEFT + 22,
        cursor.y + 10 + descH + 2
      );
    }

    cursor.move(32);
  }

  // Callout
  cursor.move(4);
  const calloutText =
    "Gr\u00e2ce \u00e0 ce diagnostic, vous avez compl\u00e9t\u00e9 les phases Pr\u00e9requis, D\u00e9tecter et \u00c9valuer. La prochaine \u00e9tape est de Concevoir vos premiers workflows d'automatisation.";
  const { lines, height: textH } = measureText(
    pdf,
    calloutText,
    CONTENT_W - 16,
    9
  );
  const boxH = 14 + textH;

  cursor.ensureSpace(boxH + 4);
  drawRoundedRect(
    pdf,
    MARGIN_LEFT,
    cursor.y,
    CONTENT_W,
    boxH,
    3,
    C.lightBg
  );
  drawRoundedRect(pdf, MARGIN_LEFT, cursor.y, 3, boxH, 1, C.blue);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setTextColor(pdf, C.blue);
  pdf.text("O\u00d9 EN \u00caTES-VOUS ?", MARGIN_LEFT + 8, cursor.y + 7);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  setTextColor(pdf, C.darkGrey);
  pdf.text(lines, MARGIN_LEFT + 8, cursor.y + 13);
  cursor.move(boxH + 4);
}

// =============================================================================
// LAST PAGE — CTA
// =============================================================================

function drawCtaPage(cursor: PdfCursor, score: number): void {
  const pdf = cursor.pdf;

  // Left blue panel (40%)
  const panelW = PAGE_W * 0.4;
  setFill(pdf, C.blue);
  pdf.rect(0, 0, panelW, PAGE_H, "F");

  // Left panel text: "PASSEZ A L'ACTION"
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  setTextColor(pdf, C.white);
  const titleLines = pdf.splitTextToSize("PASSEZ \u00c0 L'ACTION", panelW - 20);
  pdf.text(titleLines, 12, 60);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  const subLines = pdf.splitTextToSize(
    "Vous avez identifi\u00e9 le potentiel. Structurons ensemble le passage \u00e0 l'action.",
    panelW - 20
  );
  pdf.text(subLines, 12, 80);

  // Orange decoration on left panel
  drawRoundedRect(pdf, 12, PAGE_H - 30, 15, 12, 3, C.orange);

  // Right panel — benefits list + contact info
  const rightX = panelW + 15;
  let rY = 50;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  setTextColor(pdf, C.black);
  pdf.text("Ce que D\u00c9CLIC vous apporte", rightX, rY);
  rY += 12;

  const bullets = getBullets(score);
  for (const b of bullets) {
    // Green checkmark circle
    setFill(pdf, C.emerald);
    pdf.circle(rightX + 3, rY, 2, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    setTextColor(pdf, C.white);
    pdf.text("\u2713", rightX + 3, rY + 1, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    setTextColor(pdf, C.darkGrey);
    const bLines = pdf.splitTextToSize(
      b,
      PAGE_W - rightX - MARGIN_RIGHT - 12
    );
    pdf.text(bLines, rightX + 9, rY + 1);

    rY += 8 + (bLines.length - 1) * 4;
  }

  // Contact block
  rY += 15;
  drawLine(pdf, rightX, rY, PAGE_W - MARGIN_RIGHT, rY, C.lightGrey, 0.3);
  rY += 10;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  setTextColor(pdf, C.black);
  pdf.text("R\u00e9servez un \u00e9change", rightX, rY);
  rY += 10;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  setTextColor(pdf, C.darkGrey);
  const contacts = [
    "calendly.com/lecko/decouverte",
    "contact@lecko.fr",
    "lecko.fr",
  ];
  for (const c of contacts) {
    pdf.text(c, rightX, rY);
    rY += 6;
  }
}

// =============================================================================
// POST-PROCESSING: apply headers, footers, decorations to all pages
// =============================================================================

function applyPageDecorations(
  pdf: jsPDF,
  totalPages: number,
  skipFirst: boolean,
  skipLast: boolean
): void {
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    const isFirst = p === 1;
    const isLast = p === totalPages;

    // Blue header line on content pages (not cover, not CTA)
    if (!isFirst && !isLast) {
      drawPageHeader(pdf);
    }

    // Footer on content pages (not cover, not CTA)
    if (!(skipFirst && isFirst) && !(skipLast && isLast)) {
      drawPageFooter(pdf, p, totalPages);
    }

    // Orange decoration bottom-left on every page except cover
    if (!isFirst) {
      drawOrangeDecoration(pdf);
    }
  }
}

// =============================================================================
// MAIN — INDIVIDUAL REPORT
// =============================================================================

export function generatePremiumPdf(data: PdfReportData): void {
  const { result, source, hourlyRate, nbPeople } = data;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const cursor = new PdfCursor(pdf);

  // Page 1 — Cover (not using cursor; fixed layout)
  drawCoverPage(pdf, result.metier, source);

  // Page 2 — Executive Summary
  cursor.newPage();
  drawSynthesePage(cursor, result, source);

  // Page 3 — ROI
  cursor.newPage();
  drawRoiPage(cursor, result, hourlyRate, nbPeople);

  // Page 4 — Radar (only if tasks have criteres)
  if (result.taches.some((t) => t.criteres)) {
    cursor.newPage();
    drawRadarPage(cursor, result.taches);
  }

  // Page 5+ — Task cards
  cursor.newPage();
  drawTaskPages(cursor, result.taches, hourlyRate, nbPeople);

  // DECLIC Phases
  cursor.newPage();
  drawParcoursPage(cursor);

  // CTA page (last)
  cursor.newPage();
  drawCtaPage(cursor, result.score_global);

  // Apply decorations (headers, footers, orange squares) to all pages
  applyPageDecorations(pdf, cursor.pageNum, true, true);

  // Save
  const slug = result.metier
    .replace(/\s+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
  const date = new Date().toISOString().slice(0, 10);
  pdf.save(`DECLIC-Diagnostic-${slug}-${date}.pdf`);
}

// =============================================================================
// MAIN — TEAM REPORT
// =============================================================================

export function generateTeamPdf(data: TeamPdfReportData): void {
  const { team, quickWins, hourlyRates } = data;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const cursor = new PdfCursor(pdf);

  // Aggregate stats
  const totalMembers = team.members.reduce((s, m) => s + m.count, 0);
  const totalHours = team.results.reduce(
    (s, r) => s + r.result.heures_economisees_semaine * r.member.count,
    0
  );
  const avgScore =
    team.results.length > 0
      ? team.results.reduce((s, r) => s + r.result.score_global, 0) /
        team.results.length
      : 0;

  // ── Cover ──
  drawCoverPage(pdf, `\u00c9quipe (${totalMembers} personnes)`, "api");

  // ── Team summary page ──
  cursor.newPage();

  // Blue banner
  setFill(pdf, C.blue);
  pdf.rect(0, 0, PAGE_W, 22, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  setTextColor(pdf, C.white);
  pdf.text("SYNTH\u00c8SE \u00c9QUIPE", PAGE_W / 2, 14, { align: "center" });
  cursor.y = 30;

  // 4 Team KPIs
  const teamKpis = [
    {
      value: String(team.members.length),
      label: "m\u00e9tiers analys\u00e9s",
      color: C.blue,
    },
    { value: String(totalMembers), label: "personnes", color: C.blue },
    {
      value: `${totalHours.toFixed(1)}h`,
      label: "gagn\u00e9es/sem. (total)",
      color: C.emerald,
    },
    {
      value: `${Math.round(avgScore)}%`,
      label: "score moyen",
      color: C.orange,
    },
  ];
  const tkW = 42;
  const tkGap = 4;
  const tkStartX = MARGIN_LEFT + (CONTENT_W - 4 * tkW - 3 * tkGap) / 2;

  cursor.ensureSpace(30);
  for (let i = 0; i < 4; i++) {
    const x = tkStartX + i * (tkW + tkGap);
    drawRoundedRect(pdf, x, cursor.y, tkW, 25, 3, C.white, C.lightGrey);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    setTextColor(pdf, teamKpis[i].color);
    pdf.text(teamKpis[i].value, x + tkW / 2, cursor.y + 12, {
      align: "center",
    });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    setTextColor(pdf, C.grey);
    pdf.text(teamKpis[i].label, x + tkW / 2, cursor.y + 20, {
      align: "center",
    });
  }
  cursor.move(32);

  // Per-member bar chart
  drawSectionTitle(cursor, "VENTILATION PAR M\u00c9TIER");
  cursor.move(6);

  const maxHours = Math.max(
    ...team.results.map(
      (r) => r.result.heures_economisees_semaine * r.member.count
    ),
    1
  );
  const barMaxWidth = CONTENT_W - 60;

  for (const r of team.results) {
    const hrs = r.result.heures_economisees_semaine * r.member.count;
    const barW = (hrs / maxHours) * barMaxWidth;

    cursor.ensureSpace(12);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    setTextColor(pdf, C.darkGrey);
    const label = `${r.member.metier} (\u00d7${r.member.count})`;
    pdf.text(label, MARGIN_LEFT, cursor.y + 4);

    drawRoundedRect(pdf, MARGIN_LEFT + 48, cursor.y, barW, 6, 2, C.blue);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    setTextColor(pdf, C.blue);
    pdf.text(`${hrs.toFixed(1)}h/sem`, MARGIN_LEFT + 50 + barW, cursor.y + 4);

    cursor.move(10);
  }

  // ── Quick wins page ──
  if (quickWins.length > 0) {
    cursor.newPage();
    drawSectionTitle(cursor, "QUICK WINS TRANSVERSES");
    cursor.move(4);

    const topWins = quickWins.slice(0, 10);
    for (const qw of topWins) {
      cursor.ensureSpace(20);

      drawRoundedRect(
        pdf,
        MARGIN_LEFT,
        cursor.y,
        CONTENT_W,
        16,
        3,
        C.white,
        C.lightGrey
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      setTextColor(pdf, C.black);
      pdf.text(qw.task.nom, MARGIN_LEFT + 4, cursor.y + 6);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      setTextColor(pdf, C.grey);
      pdf.text(
        `${qw.metier} \u2014 ${qw.task.temps_gagne_heures_semaine}h/sem \u00d7 ${qw.count} pers.`,
        MARGIN_LEFT + 4,
        cursor.y + 12
      );

      // Impact badge
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      setTextColor(pdf, C.emerald);
      pdf.text(
        `${qw.totalImpact.toFixed(1)}h/sem`,
        PAGE_W - MARGIN_RIGHT - 4,
        cursor.y + 9,
        { align: "right" }
      );

      cursor.move(20);
    }
  }

  // ── Team ROI summary ──
  cursor.newPage();
  drawSectionTitle(cursor, "RETOUR SUR INVESTISSEMENT \u00c9QUIPE");
  cursor.move(4);

  // Build aggregate ROI
  let totalWeekEur = 0;
  for (const r of team.results) {
    const rate = hourlyRates[r.member.id] ?? 45;
    totalWeekEur +=
      r.result.heures_economisees_semaine * rate * r.member.count;
  }
  const totalMonthEur = totalWeekEur * 4.33;
  const totalYearEur = totalWeekEur * 47;

  drawTable(
    cursor,
    ["Indicateur", "Valeur"],
    [
      ["Heures gagn\u00e9es / semaine (total)", `${totalHours.toFixed(1)}h`],
      ["\u00c9conomie / semaine", formatEur(totalWeekEur)],
      ["\u00c9conomie / mois", formatEur(totalMonthEur)],
      ["\u00c9conomie / an", formatEur(totalYearEur)],
    ],
    [110, 70],
    { highlightLastRow: true }
  );
  cursor.move(8);

  // Comparison callout
  const comparison = getComparison(totalYearEur);
  if (comparison) {
    const calloutText = `\u00c9conomie annuelle de ${formatEur(totalYearEur)} : ${comparison}.`;
    const { lines: calloutLines, height: calloutTextH } = measureText(
      pdf,
      calloutText,
      CONTENT_W - 16,
      9
    );
    const calloutH = Math.max(18, 10 + calloutTextH);

    cursor.ensureSpace(calloutH + 4);
    drawRoundedRect(
      pdf,
      MARGIN_LEFT,
      cursor.y,
      CONTENT_W,
      calloutH,
      3,
      [255, 251, 235] as RGB
    );
    drawRoundedRect(
      pdf,
      MARGIN_LEFT,
      cursor.y,
      3,
      calloutH,
      1,
      C.orange
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setTextColor(pdf, C.orange);
    pdf.text("\u00c0 RETENIR", MARGIN_LEFT + 8, cursor.y + 7);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.darkGrey);
    pdf.text(calloutLines, MARGIN_LEFT + 8, cursor.y + 13);
    cursor.move(calloutH + 4);
  }

  // ── CTA page ──
  cursor.newPage();
  drawCtaPage(cursor, avgScore);

  // Apply decorations
  applyPageDecorations(pdf, cursor.pageNum, true, true);

  // Save
  const date = new Date().toISOString().slice(0, 10);
  pdf.save(`DECLIC-Equipe-Diagnostic-${date}.pdf`);
}
