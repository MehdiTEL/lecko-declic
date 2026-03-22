/**
 * DÉCLIC Premium PDF Report Generator
 * Generates a multi-page branded A4 PDF report from analysis data.
 * Uses jsPDF programmatic drawing (no html2canvas).
 */
import jsPDF from "jspdf";
import type { AnalysisResult, AnalysisTask, AnalysisSource, TaskCategory } from "@/types/analysis";
import type { TeamAnalysisResult, QuickWin, TeamJobResult } from "@/types/team";
import { DECLIC_PHASES } from "@/types/declic";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PdfReportData {
  result: AnalysisResult;
  source: AnalysisSource;
  hourlyRate: number;
  nbPeople: number;
}

export interface TeamPdfReportData {
  team: TeamAnalysisResult;
  quickWins: QuickWin[];
  hourlyRates: Record<string, number>; // member.id → rate
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS — Lecko brand palette (RGB)
// ═══════════════════════════════════════════════════════════════════════════════

const C = {
  blue: [37, 99, 235] as const,
  orange: [245, 158, 11] as const,
  emerald: [5, 150, 105] as const,
  black: [17, 24, 39] as const,
  darkGrey: [55, 65, 81] as const,
  grey: [107, 114, 128] as const,
  lightBg: [238, 242, 255] as const,
  white: [255, 255, 255] as const,
  lightGrey: [243, 244, 246] as const,
  violet: [124, 58, 237] as const,
  amber: [217, 119, 6] as const,
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - 2 * MARGIN;

// ═══════════════════════════════════════════════════════════════════════════════
// DRAWING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

type RGB = readonly [number, number, number];

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
  x: number, y: number, w: number, h: number, r: number,
  fill?: RGB, stroke?: RGB
) {
  if (fill) setFill(pdf, fill);
  if (stroke) { setDraw(pdf, stroke); pdf.setLineWidth(0.3); }
  pdf.roundedRect(x, y, w, h, r, r, fill && stroke ? "FD" : fill ? "F" : "S");
}

function drawLine(pdf: jsPDF, x1: number, y1: number, x2: number, y2: number, c: RGB, width = 0.5) {
  setDraw(pdf, c);
  pdf.setLineWidth(width);
  pdf.line(x1, y1, x2, y2);
}

/** Draw a circular score arc (like a donut chart) */
function drawCircleScore(
  pdf: jsPDF, cx: number, cy: number, radius: number,
  score: number, color: RGB
) {
  const bgColor: RGB = [229, 231, 235]; // gray-200
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
    const endAngle = startAngle + (2 * Math.PI * Math.min(score, 100)) / 100;
    const segCount = Math.max(1, Math.round(steps * (score / 100)));
    const angleStep = (endAngle - startAngle) / segCount;

    for (let i = 0; i < segCount; i++) {
      const a1 = startAngle + i * angleStep;
      const a2 = startAngle + (i + 1) * angleStep;
      pdf.line(
        cx + radius * Math.cos(a1), cy + radius * Math.sin(a1),
        cx + radius * Math.cos(a2), cy + radius * Math.sin(a2)
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

/** Draw a pentagon radar chart */
function drawRadarChart(
  pdf: jsPDF, cx: number, cy: number, radius: number,
  values: number[], labels: string[]
) {
  const n = 5;
  const angleOffset = -Math.PI / 2; // start at top

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
  setDraw(pdf, [220, 220, 220]);
  pdf.setLineWidth(0.15);
  for (let i = 0; i < n; i++) {
    const [vx, vy] = vertex(i, radius);
    pdf.line(cx, cy, vx, vy);
  }

  // Value polygon — filled semi-transparent blue
  const valPoints: [number, number][] = values.map((v, i) => vertex(i, radius * v));

  // Fill using triangles from center
  setFill(pdf, [37, 99, 235]);
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

  // Labels
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

/** Draw a row-based table */
function drawTable(
  pdf: jsPDF, x: number, y: number,
  headers: string[], rows: string[][],
  colWidths: number[], options?: { highlightLastRow?: boolean }
) {
  const rowH = 8;
  const headerH = 9;
  let curY = y;

  // Header
  drawRoundedRect(pdf, x, curY, colWidths.reduce((a, b) => a + b, 0), headerH, 1, C.blue);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  setTextColor(pdf, C.white);
  let curX = x;
  for (let i = 0; i < headers.length; i++) {
    pdf.text(headers[i], curX + 3, curY + 6);
    curX += colWidths[i];
  }
  curY += headerH;

  // Rows
  pdf.setFontSize(9);
  for (let r = 0; r < rows.length; r++) {
    const isLast = r === rows.length - 1 && options?.highlightLastRow;
    const bg: RGB = isLast ? [238, 242, 255] : r % 2 === 0 ? C.white : C.lightGrey;
    drawRoundedRect(pdf, x, curY, colWidths.reduce((a, b) => a + b, 0), rowH, 0, bg);

    curX = x;
    for (let c = 0; c < rows[r].length; c++) {
      const isValue = c === rows[r].length - 1;
      pdf.setFont("helvetica", isLast || isValue ? "bold" : "normal");
      setTextColor(pdf, isLast && isValue ? C.blue : C.black);
      pdf.text(rows[r][c], curX + 3, curY + 5.5);
      curX += colWidths[c];
    }
    curY += rowH;
  }

  return curY;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE FRAMEWORK — header line, footer, decoration
// ═══════════════════════════════════════════════════════════════════════════════

function drawPageHeader(pdf: jsPDF) {
  drawLine(pdf, MARGIN, 10, PAGE_W - MARGIN, 10, C.blue, 0.6);
}

function drawPageFooter(pdf: jsPDF, pageNum: number, totalPages: number) {
  // Orange square decoration
  drawRoundedRect(pdf, MARGIN, PAGE_H - 22, 12, 10, 2, C.orange);

  // Footer text
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  setTextColor(pdf, C.grey);
  pdf.text("DÉCLIC — Diagnostic IA", MARGIN + 16, PAGE_H - 14);
  pdf.text(`Page ${pageNum} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 14, { align: "right" });
}

function drawSectionTitle(pdf: jsPDF, y: number, title: string): number {
  // Blue left bar
  drawRoundedRect(pdf, MARGIN, y, 3, 10, 1, C.blue);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  setTextColor(pdf, C.black);
  pdf.text(title, MARGIN + 8, y + 7.5);

  return y + 16;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROI UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function formatEur(n: number): string {
  return Math.round(n).toLocaleString("fr-FR") + " €";
}

function getComparison(annualEur: number): string {
  if (annualEur <= 0) return "";
  const base =
    annualEur < 10000
      ? `l'équivalent de ${Math.round(annualEur / 750)} jours de prestation conseil`
      : annualEur < 30000
      ? "l'équivalent d'un mi-temps"
      : annualEur < 60000
      ? "l'équivalent d'un salaire junior à temps plein"
      : `l'équivalent de ${(annualEur / 35000).toFixed(1)} collaborateurs à temps plein`;
  return `Soit ${base}.`;
}

function getSynthesisText(metier: string, score: number, autoCount: number, total: number, hours: number): string {
  if (score > 70) {
    return `Votre métier de ${metier} présente un potentiel d'automatisation élevé. ${autoCount} tâches sur ${total} sont directement automatisables, représentant ${hours.toFixed(1)}h d'économie hebdomadaire. Nous recommandons de démarrer immédiatement par les quick wins identifiés.`;
  }
  if (score >= 40) {
    return `Votre métier de ${metier} offre des opportunités d'automatisation significatives. ${autoCount} tâches peuvent être optimisées, avec un gain potentiel de ${hours.toFixed(1)}h par semaine. Une approche progressive en commençant par les tâches les mieux scorées est recommandée.`;
  }
  return `Votre métier de ${metier} comporte des tâches à forte valeur humaine. ${autoCount} tâches peuvent néanmoins bénéficier d'une assistance IA, avec un gain de ${hours.toFixed(1)}h par semaine. L'accompagnement se concentrera sur l'IA assistive plutôt que l'automatisation complète.`;
}

function getBullets(score: number): string[] {
  if (score > 70) {
    return [
      "Identifier les quick wins à activer en moins de 2 semaines",
      "Construire une roadmap d'automatisation sur mesure",
      "Déployer les bons outils (M365, agents IA, N8N, Power Automate)",
      "Former vos équipes pour une adoption durable",
    ];
  }
  if (score >= 40) {
    return [
      "Valider les automatisations les plus rentables pour votre contexte",
      "Recommander les outils adaptés à votre environnement",
      "Estimer le ROI concret de chaque action",
    ];
  }
  return [
    "Déployer Microsoft 365 et les usages collaboratifs",
    "Intégrer l'IA assistive (Copilot, Claude) dans le quotidien",
    "Conduite du changement et adoption des outils",
  ];
}

// Category sorting and config
const CAT_ORDER: TaskCategory[] = ["automatisable", "partiellement_automatisable", "difficilement_automatisable"];
const CAT_CONFIG: Record<TaskCategory, { label: string; color: RGB }> = {
  automatisable: { label: "Automatisable", color: C.emerald },
  partiellement_automatisable: { label: "Partiellement automatisable", color: C.orange },
  difficilement_automatisable: { label: "Difficilement automatisable", color: C.grey },
};

function computeScoreCriteres(criteres?: AnalysisTask["criteres"]): number {
  if (!criteres) return 0;
  return [criteres.recurrence, criteres.energie, criteres.scalabilite, criteres.fiabilite, criteres.penibilite]
    .filter(Boolean).length;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ═══════════════════════════════════════════════════════════════════════════════

function drawCoverPage(pdf: jsPDF, metier: string, source: AnalysisSource) {
  // Orange decoration top-right
  drawRoundedRect(pdf, PAGE_W - 35, 10, 20, 10, 3, C.orange);

  // Logo
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  setTextColor(pdf, C.blue);
  pdf.text("DÉCLIC", MARGIN, 30);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  setTextColor(pdf, C.grey);
  pdf.text("par DÉCLIC", MARGIN, 37);

  // Center content
  const centerY = 120;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(32);
  setTextColor(pdf, C.black);
  pdf.text("DIAGNOSTIC IA", PAGE_W / 2, centerY, { align: "center" });

  pdf.setFontSize(24);
  setTextColor(pdf, C.orange);
  pdf.text(metier, PAGE_W / 2, centerY + 16, { align: "center" });

  // Decorative line
  drawLine(pdf, PAGE_W / 2 - 30, centerY + 24, PAGE_W / 2 + 30, centerY + 24, C.blue, 0.8);

  // Bottom info
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  setTextColor(pdf, C.grey);
  pdf.text(today, PAGE_W / 2, PAGE_H - 60, { align: "center" });

  pdf.setFontSize(9);
  pdf.text("Rapport généré automatiquement par la plateforme DÉCLIC", PAGE_W / 2, PAGE_H - 52, { align: "center" });

  // Source badge
  const sourceLabel = source === "api" ? "Analyse IA personnalisée" : "Analyse générique";
  const badgeW = pdf.getTextWidth(sourceLabel) + 8;
  const badgeX = PAGE_W / 2 - badgeW / 2;
  drawRoundedRect(pdf, badgeX, PAGE_H - 46, badgeW, 7, 2, C.lightBg, C.blue);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  setTextColor(pdf, C.blue);
  pdf.text(sourceLabel, PAGE_W / 2, PAGE_H - 41.5, { align: "center" });

  // Orange square bottom-left
  drawRoundedRect(pdf, MARGIN, PAGE_H - 30, 15, 15, 3, C.orange);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — EXECUTIVE SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

function drawSynthesePage(pdf: jsPDF, result: AnalysisResult, source: AnalysisSource) {
  // Blue banner
  setFill(pdf, C.blue);
  pdf.rect(0, 0, PAGE_W, 25, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  setTextColor(pdf, C.white);
  pdf.text("SYNTHÈSE EXÉCUTIVE", PAGE_W / 2, 16, { align: "center" });

  // Score circle
  drawCircleScore(pdf, PAGE_W / 2, 60, 22, result.score_global, C.blue);

  // 3 KPI cards
  const autoCount = result.taches.filter(t => t.categorie === "automatisable").length;
  const kpis = [
    { value: String(result.taches.length), label: "tâches analysées", color: C.blue },
    { value: String(autoCount), label: "automatisables", color: C.emerald },
    { value: `${result.heures_economisees_semaine.toFixed(1)}h`, label: "/ semaine gagnées", color: C.orange },
  ];

  const kpiW = 55;
  const kpiGap = 5;
  const kpiStartX = MARGIN + (CONTENT_W - 3 * kpiW - 2 * kpiGap) / 2;
  const kpiY = 90;

  for (let i = 0; i < 3; i++) {
    const x = kpiStartX + i * (kpiW + kpiGap);
    drawRoundedRect(pdf, x, kpiY, kpiW, 28, 3, C.white, C.lightGrey);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    setTextColor(pdf, kpis[i].color);
    pdf.text(kpis[i].value, x + kpiW / 2, kpiY + 14, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.grey);
    pdf.text(kpis[i].label, x + kpiW / 2, kpiY + 22, { align: "center" });
  }

  // Synthesis box
  const boxY = 128;
  drawRoundedRect(pdf, MARGIN, boxY, CONTENT_W, 50, 3, C.lightBg);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  setTextColor(pdf, C.blue);
  pdf.text("Résumé", MARGIN + 6, boxY + 9);

  const synthText = getSynthesisText(
    result.metier,
    result.score_global,
    autoCount,
    result.taches.length,
    result.heures_economisees_semaine
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  setTextColor(pdf, C.darkGrey);
  const lines = pdf.splitTextToSize(synthText, CONTENT_W - 12);
  pdf.text(lines, MARGIN + 6, boxY + 18);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — ROI
// ═══════════════════════════════════════════════════════════════════════════════

function drawRoiPage(pdf: jsPDF, result: AnalysisResult, hourlyRate: number, nbPeople: number) {
  drawPageHeader(pdf);
  let y = 18;
  y = drawSectionTitle(pdf, y, "RETOUR SUR INVESTISSEMENT");
  y += 4;

  const hrs = result.heures_economisees_semaine;
  const weekEur = hrs * hourlyRate * nbPeople;
  const monthEur = weekEur * 4.33;
  const yearEur = weekEur * 47;
  const etp = (hrs * nbPeople) / 35;

  // ROI Table
  const tableEndY = drawTable(pdf, MARGIN, y,
    ["Indicateur", "Valeur"],
    [
      ["Heures gagnées / semaine", `${hrs.toFixed(1)}h`],
      ["Coût horaire chargé", `${hourlyRate} €/h`],
      ["Personnes concernées", String(nbPeople)],
      ["Économie / semaine", formatEur(weekEur)],
      ["Économie / mois", formatEur(monthEur)],
      ["Économie / an", formatEur(yearEur)],
      ["Équivalent ETP", etp.toFixed(2)],
    ],
    [100, 80],
    { highlightLastRow: true }
  );

  // "À retenir" callout
  let bY = tableEndY + 8;
  const comparison = getComparison(yearEur);
  const calloutText = `Votre économie annuelle de ${formatEur(yearEur)} représente ${comparison}`;
  const calloutLines = pdf.splitTextToSize(calloutText, CONTENT_W - 16);
  const calloutH = Math.max(18, 10 + calloutLines.length * 4.5);

  drawRoundedRect(pdf, MARGIN, bY, CONTENT_W, calloutH, 3, [255, 251, 235]); // amber-50
  drawRoundedRect(pdf, MARGIN, bY, 3, calloutH, 1, C.orange);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setTextColor(pdf, C.orange);
  pdf.text("À RETENIR", MARGIN + 8, bY + 7);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  setTextColor(pdf, C.darkGrey);
  pdf.text(calloutLines, MARGIN + 8, bY + 13);

  bY += calloutH + 12;

  // Projection bars
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  setTextColor(pdf, C.black);
  pdf.text("Projections", MARGIN, bY);
  bY += 8;

  const projections = [
    { label: "6 mois", value: monthEur * 6 },
    { label: "12 mois", value: yearEur },
    { label: "24 mois", value: yearEur * 2 },
  ];
  const maxVal = projections[projections.length - 1].value;
  const barMaxW = CONTENT_W - 50;

  for (const proj of projections) {
    const barW = maxVal > 0 ? (proj.value / maxVal) * barMaxW : 0;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setTextColor(pdf, C.darkGrey);
    pdf.text(proj.label, MARGIN, bY + 5);

    drawRoundedRect(pdf, MARGIN + 28, bY, barW, 7, 2, C.blue);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    setTextColor(pdf, C.blue);
    pdf.text(formatEur(proj.value), MARGIN + 30 + barW, bY + 5);

    bY += 12;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — RADAR CHART
// ═══════════════════════════════════════════════════════════════════════════════

function drawRadarPage(pdf: jsPDF, tasks: AnalysisTask[]) {
  drawPageHeader(pdf);
  let y = 18;
  y = drawSectionTitle(pdf, y, "ÉVALUATION MULTICRITÈRES");

  // Compute averages
  const critereKeys = ["recurrence", "energie", "scalabilite", "fiabilite", "penibilite"] as const;
  const critereLabels = ["Récurrence", "Énergie", "Scalabilité", "Fiabilité", "Pénibilité"];
  const tasksWithCriteres = tasks.filter(t => t.criteres);
  const total = tasksWithCriteres.length || 1;

  const values = critereKeys.map(key =>
    tasksWithCriteres.filter(t => t.criteres?.[key]).length / total
  );

  // Radar
  drawRadarChart(pdf, PAGE_W / 2, y + 55, 38, values, critereLabels);

  // Mini blocks under radar
  let blockY = y + 108;
  pdf.setFontSize(9);
  for (let i = 0; i < 5; i++) {
    const pct = Math.round(values[i] * 100);

    // Colored dot
    setFill(pdf, pct > 50 ? C.blue : C.lightGrey);
    pdf.circle(MARGIN + 4, blockY + 2, 2, "F");

    pdf.setFont("helvetica", "bold");
    setTextColor(pdf, C.black);
    pdf.text(`${critereLabels[i]} — ${pct}%`, MARGIN + 10, blockY + 3);

    blockY += 8;
  }

  // Interpretation callout
  const maxIdx = values.indexOf(Math.max(...values));
  const minIdx = values.indexOf(Math.min(...values));
  const interpText = `Vos tâches sont particulièrement caractérisées par la ${critereLabels[maxIdx].toLowerCase()} (${Math.round(values[maxIdx] * 100)}%). Le levier ${critereLabels[minIdx].toLowerCase()} (${Math.round(values[minIdx] * 100)}%) est moins présent, ce qui oriente vers une automatisation assistée plutôt que complète sur certaines tâches.`;

  blockY += 6;
  const interpLines = pdf.splitTextToSize(interpText, CONTENT_W - 16);
  const interpH = 12 + interpLines.length * 4.5;

  drawRoundedRect(pdf, MARGIN, blockY, CONTENT_W, interpH, 3, C.lightBg);
  drawRoundedRect(pdf, MARGIN, blockY, 3, interpH, 1, C.blue);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setTextColor(pdf, C.blue);
  pdf.text("INTERPRÉTATION", MARGIN + 8, blockY + 7);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  setTextColor(pdf, C.darkGrey);
  pdf.text(interpLines, MARGIN + 8, blockY + 13);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5+ — TASK CARDS
// ═══════════════════════════════════════════════════════════════════════════════

function drawTaskPages(
  pdf: jsPDF, tasks: AnalysisTask[], hourlyRate: number, nbPeople: number,
  pageTracker: { current: number }
) {
  // Sort tasks by category
  const sorted = [...tasks].sort(
    (a, b) => CAT_ORDER.indexOf(a.categorie) - CAT_ORDER.indexOf(b.categorie)
  );

  let y = 18;
  let currentCat: TaskCategory | null = null;
  const bottomLimit = PAGE_H - 30;

  function newPage() {
    pageTracker.current++;
    pdf.addPage();
    drawPageHeader(pdf);
    y = 18;
  }

  drawPageHeader(pdf);

  for (const task of sorted) {
    // Estimate card height
    const descLines = pdf.splitTextToSize(task.description, CONTENT_W - 16).length;
    const solLines = pdf.splitTextToSize(task.solution, CONTENT_W - 16).length;
    const cardH = 28 + descLines * 4 + solLines * 4 + 16;

    // Category header
    if (task.categorie !== currentCat) {
      currentCat = task.categorie;
      const catConf = CAT_CONFIG[currentCat];
      const catTasks = sorted.filter(t => t.categorie === currentCat);

      if (y + cardH + 14 > bottomLimit) newPage();

      drawRoundedRect(pdf, MARGIN, y, CONTENT_W, 10, 2, catConf.color);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      setTextColor(pdf, C.white);
      pdf.text(`${catConf.label} (${catTasks.length} tâche${catTasks.length > 1 ? "s" : ""})`, MARGIN + 5, y + 7);
      y += 14;
    }

    // Check space
    if (y + cardH > bottomLimit) newPage();

    // Card shadow
    drawRoundedRect(pdf, MARGIN + 1, y + 1, CONTENT_W - 2, cardH - 2, 3, [230, 230, 230]);
    // Card body
    drawRoundedRect(pdf, MARGIN, y, CONTENT_W - 2, cardH - 2, 3, C.white, C.lightGrey);

    let cY = y + 6;

    // Task name + score badge
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    setTextColor(pdf, C.black);
    pdf.text(task.nom, MARGIN + 5, cY);

    const score = task.score_criteres ?? computeScoreCriteres(task.criteres);
    const scoreColor: RGB = score >= 3 ? C.emerald : score === 2 ? C.orange : C.grey;
    const scoreText = `${score}/5`;
    const scoreBadgeW = 14;
    drawRoundedRect(pdf, PAGE_W - MARGIN - scoreBadgeW - 8, cY - 4, scoreBadgeW, 6, 2, scoreColor);
    pdf.setFontSize(7);
    setTextColor(pdf, C.white);
    pdf.setFont("helvetica", "bold");
    pdf.text(scoreText, PAGE_W - MARGIN - scoreBadgeW / 2 - 8, cY - 0.5, { align: "center" });

    // Tool badge
    const toolBadgeX = PAGE_W - MARGIN - scoreBadgeW - 10 - pdf.getTextWidth(task.type_outil) - 8;
    pdf.setFontSize(7);
    const toolW = pdf.getTextWidth(task.type_outil) + 6;
    drawRoundedRect(pdf, toolBadgeX, cY - 4, toolW, 6, 2, C.lightBg);
    setTextColor(pdf, C.blue);
    pdf.text(task.type_outil, toolBadgeX + 3, cY - 0.5);

    cY += 6;

    // Description
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.darkGrey);
    const descL = pdf.splitTextToSize(task.description, CONTENT_W - 16);
    pdf.text(descL, MARGIN + 5, cY);
    cY += descL.length * 4 + 3;

    // Solution
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    setTextColor(pdf, C.grey);
    pdf.text("SOLUTION RECOMMANDÉE", MARGIN + 5, cY);
    cY += 4;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.darkGrey);
    const solL = pdf.splitTextToSize(task.solution, CONTENT_W - 16);
    pdf.text(solL, MARGIN + 5, cY);
    cY += solL.length * 4 + 3;

    // Metrics row
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    setTextColor(pdf, C.blue);
    const timeText = `~${task.temps_gagne_heures_semaine}h / semaine`;
    pdf.text(timeText, MARGIN + 5, cY);

    const roiWeek = task.temps_gagne_heures_semaine * hourlyRate * nbPeople;
    if (roiWeek > 0) {
      setTextColor(pdf, C.emerald);
      pdf.text(`~${formatEur(roiWeek)}/sem.`, MARGIN + 45, cY);
    }

    // IA badge
    if (task.peut_fonctionner_sans_ia === true) {
      drawRoundedRect(pdf, MARGIN + 90, cY - 3, 16, 5, 2, C.emerald);
      pdf.setFontSize(6);
      setTextColor(pdf, C.white);
      pdf.text("Sans IA", MARGIN + 92, cY);
    } else if (task.peut_fonctionner_sans_ia === false) {
      drawRoundedRect(pdf, MARGIN + 90, cY - 3, 24, 5, 2, C.violet);
      pdf.setFontSize(6);
      setTextColor(pdf, C.white);
      pdf.text("IA recommandée", MARGIN + 92, cY);
    }

    // Criteria dots
    if (task.criteres) {
      const dotX = CONTENT_W - 15;
      const keys = ["recurrence", "energie", "scalabilite", "fiabilite", "penibilite"] as const;
      for (let d = 0; d < 5; d++) {
        setFill(pdf, task.criteres[keys[d]] ? C.blue : [220, 220, 220]);
        pdf.circle(MARGIN + dotX + d * 4, cY - 1, 1.2, "F");
      }
    }

    y += cardH + 3;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE — DÉCLIC PARCOURS
// ═══════════════════════════════════════════════════════════════════════════════

function drawParcoursPage(pdf: jsPDF) {
  drawPageHeader(pdf);
  let y = 18;
  y = drawSectionTitle(pdf, y, "VOTRE PARCOURS DÉCLIC");
  y += 6;

  for (let i = 0; i < DECLIC_PHASES.length; i++) {
    const phase = DECLIC_PHASES[i];
    const isCompleted = i <= 2; // phases 0-2 done via diagnostic
    const hexColor = phase.color;
    const rgb = hexToRgb(hexColor);

    // Circle
    setFill(pdf, rgb);
    pdf.circle(MARGIN + 10, y + 5, 5, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setTextColor(pdf, C.white);
    pdf.text(String(i), MARGIN + 10, y + 6.5, { align: "center" });

    // Connecting line (except last)
    if (i < DECLIC_PHASES.length - 1) {
      drawLine(pdf, MARGIN + 10, y + 10, MARGIN + 10, y + 30, C.lightGrey, 0.4);
    }

    // Phase info
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    setTextColor(pdf, C.black);
    pdf.text(phase.label, MARGIN + 22, y + 4);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setTextColor(pdf, C.grey);
    const descLines = pdf.splitTextToSize(phase.description, CONTENT_W - 35);
    pdf.text(descLines, MARGIN + 22, y + 10);

    // Status
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    if (isCompleted) {
      setTextColor(pdf, C.emerald);
      pdf.text("✓ Complété", MARGIN + 22, y + 10 + descLines.length * 4);
    } else {
      setTextColor(pdf, C.orange);
      pdf.text("→ Prochaine étape", MARGIN + 22, y + 10 + descLines.length * 4);
    }

    y += 32;
  }

  // Callout
  y += 4;
  const calloutText = "Grâce à ce diagnostic, vous avez complété les phases Prérequis, Détecter et Évaluer. La prochaine étape est de Concevoir vos premiers workflows d'automatisation.";
  const lines = pdf.splitTextToSize(calloutText, CONTENT_W - 16);
  const boxH = 14 + lines.length * 4.5;

  drawRoundedRect(pdf, MARGIN, y, CONTENT_W, boxH, 3, C.lightBg);
  drawRoundedRect(pdf, MARGIN, y, 3, boxH, 1, C.blue);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setTextColor(pdf, C.blue);
  pdf.text("OÙ EN ÊTES-VOUS ?", MARGIN + 8, y + 7);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  setTextColor(pdf, C.darkGrey);
  pdf.text(lines, MARGIN + 8, y + 13);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAST PAGE — CTA / NEXT STEPS
// ═══════════════════════════════════════════════════════════════════════════════

function drawCtaPage(pdf: jsPDF, score: number) {
  // Left blue panel (40%)
  const panelW = PAGE_W * 0.4;
  setFill(pdf, C.blue);
  pdf.rect(0, 0, panelW, PAGE_H, "F");

  // Left panel text
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  setTextColor(pdf, C.white);
  const titleLines = pdf.splitTextToSize("PASSEZ À L'ACTION", panelW - 20);
  pdf.text(titleLines, 12, 60);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  const subLines = pdf.splitTextToSize(
    "Vous avez identifié le potentiel. Structurons ensemble le passage à l'action.",
    panelW - 20
  );
  pdf.text(subLines, 12, 80);

  // Orange decoration on left
  drawRoundedRect(pdf, 12, PAGE_H - 30, 15, 12, 3, C.orange);

  // Right panel — benefits
  const rightX = panelW + 15;
  let y = 50;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  setTextColor(pdf, C.black);
  pdf.text("Ce que DÉCLIC vous apporte", rightX, y);
  y += 12;

  const bullets = getBullets(score);
  for (const b of bullets) {
    // Green checkmark
    setFill(pdf, C.emerald);
    pdf.circle(rightX + 3, y, 2, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    setTextColor(pdf, C.white);
    pdf.text("✓", rightX + 3, y + 1, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    setTextColor(pdf, C.darkGrey);
    const bLines = pdf.splitTextToSize(b, PAGE_W - rightX - MARGIN - 12);
    pdf.text(bLines, rightX + 9, y + 1);

    y += 8 + (bLines.length - 1) * 4;
  }

  // Contact block
  y += 15;
  drawLine(pdf, rightX, y, PAGE_W - MARGIN, y, C.lightGrey, 0.3);
  y += 10;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  setTextColor(pdf, C.black);
  pdf.text("Réservez un échange", rightX, y);
  y += 10;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  setTextColor(pdf, C.darkGrey);

  const contacts = [
    "calendly.com/lecko/decouverte",
    "contact@lecko.fr",
    "lecko.fr",
  ];
  for (const c of contacts) {
    pdf.text(c, rightX, y);
    y += 6;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — INDIVIDUAL REPORT
// ═══════════════════════════════════════════════════════════════════════════════

export function generatePremiumPdf(data: PdfReportData): void {
  const { result, source, hourlyRate, nbPeople } = data;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageTracker = { current: 1 };

  // Page 1 — Cover
  drawCoverPage(pdf, result.metier, source);

  // Page 2 — Executive Summary
  pdf.addPage();
  pageTracker.current++;
  drawSynthesePage(pdf, result, source);

  // Page 3 — ROI
  pdf.addPage();
  pageTracker.current++;
  drawRoiPage(pdf, result, hourlyRate, nbPeople);

  // Page 4 — Radar
  if (result.taches.some(t => t.criteres)) {
    pdf.addPage();
    pageTracker.current++;
    drawRadarPage(pdf, result.taches);
  }

  // Page 5+ — Task cards
  pdf.addPage();
  pageTracker.current++;
  drawTaskPages(pdf, result.taches, hourlyRate, nbPeople, pageTracker);

  // Parcours DÉCLIC
  pdf.addPage();
  pageTracker.current++;
  drawParcoursPage(pdf);

  // CTA page
  pdf.addPage();
  pageTracker.current++;
  drawCtaPage(pdf, result.score_global);

  // Apply footers to all pages except cover (1) and CTA (last)
  const totalPages = pageTracker.current;
  for (let p = 2; p < totalPages; p++) {
    pdf.setPage(p);
    drawPageFooter(pdf, p, totalPages);
  }

  // Save
  const slug = result.metier.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const date = new Date().toISOString().slice(0, 10);
  pdf.save(`declic-diagnostic-${slug}-${date}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — TEAM REPORT
// ═══════════════════════════════════════════════════════════════════════════════

export function generateTeamPdf(data: TeamPdfReportData): void {
  const { team, quickWins, hourlyRates } = data;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageTracker = { current: 1 };

  // Aggregate stats
  const totalMembers = team.members.reduce((s, m) => s + m.count, 0);
  const allTasks = team.results.flatMap(r => r.result.taches);
  const totalHours = team.results.reduce((s, r) => s + r.result.heures_economisees_semaine * r.member.count, 0);
  const avgScore = team.results.length > 0
    ? team.results.reduce((s, r) => s + r.result.score_global, 0) / team.results.length
    : 0;

  // ── Cover ──
  drawCoverPage(pdf, `Équipe (${totalMembers} personnes)`, "api");

  // ── Team summary page ──
  pdf.addPage();
  pageTracker.current++;

  setFill(pdf, C.blue);
  pdf.rect(0, 0, PAGE_W, 25, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  setTextColor(pdf, C.white);
  pdf.text("SYNTHÈSE ÉQUIPE", PAGE_W / 2, 16, { align: "center" });

  // Team KPIs
  const teamKpis = [
    { value: String(team.members.length), label: "métiers analysés", color: C.blue },
    { value: String(totalMembers), label: "personnes", color: C.blue },
    { value: `${totalHours.toFixed(1)}h`, label: "gagnées/sem. (total)", color: C.emerald },
    { value: `${Math.round(avgScore)}%`, label: "score moyen", color: C.orange },
  ];

  const tkW = 42;
  const tkGap = 4;
  const tkStartX = MARGIN + (CONTENT_W - 4 * tkW - 3 * tkGap) / 2;
  let ty = 36;

  for (let i = 0; i < 4; i++) {
    const x = tkStartX + i * (tkW + tkGap);
    drawRoundedRect(pdf, x, ty, tkW, 25, 3, C.white, C.lightGrey);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    setTextColor(pdf, teamKpis[i].color);
    pdf.text(teamKpis[i].value, x + tkW / 2, ty + 12, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    setTextColor(pdf, C.grey);
    pdf.text(teamKpis[i].label, x + tkW / 2, ty + 20, { align: "center" });
  }

  ty += 36;

  // Per-member bar chart
  ty = drawSectionTitle(pdf, ty, "VENTILATION PAR MÉTIER");
  ty += 6;

  const maxHours = Math.max(...team.results.map(r => r.result.heures_economisees_semaine * r.member.count), 1);
  const barMaxWidth = CONTENT_W - 60;

  for (const r of team.results) {
    const hrs = r.result.heures_economisees_semaine * r.member.count;
    const barW = (hrs / maxHours) * barMaxWidth;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    setTextColor(pdf, C.darkGrey);
    const label = `${r.member.metier} (×${r.member.count})`;
    pdf.text(label, MARGIN, ty + 4);

    drawRoundedRect(pdf, MARGIN + 48, ty, barW, 6, 2, C.blue);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    setTextColor(pdf, C.blue);
    pdf.text(`${hrs.toFixed(1)}h/sem`, MARGIN + 50 + barW, ty + 4);

    ty += 10;
    if (ty > PAGE_H - 40) {
      pdf.addPage();
      pageTracker.current++;
      drawPageHeader(pdf);
      ty = 20;
    }
  }

  // ── Quick wins page ──
  if (quickWins.length > 0) {
    pdf.addPage();
    pageTracker.current++;
    drawPageHeader(pdf);
    let qy = 18;
    qy = drawSectionTitle(pdf, qy, "QUICK WINS TRANSVERSES");
    qy += 4;

    const topWins = quickWins.slice(0, 10);
    for (const qw of topWins) {
      if (qy > PAGE_H - 35) {
        pdf.addPage();
        pageTracker.current++;
        drawPageHeader(pdf);
        qy = 20;
      }

      drawRoundedRect(pdf, MARGIN, qy, CONTENT_W, 16, 3, C.white, C.lightGrey);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      setTextColor(pdf, C.black);
      pdf.text(qw.task.nom, MARGIN + 4, qy + 6);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      setTextColor(pdf, C.grey);
      pdf.text(`${qw.metier} • ×${qw.count} personnes`, MARGIN + 4, qy + 12);

      pdf.setFont("helvetica", "bold");
      setTextColor(pdf, C.emerald);
      pdf.text(`${qw.totalImpact.toFixed(1)}h/sem`, PAGE_W - MARGIN - 4, qy + 9, { align: "right" });

      qy += 20;
    }
  }

  // ── ROI consolidé ──
  pdf.addPage();
  pageTracker.current++;
  drawPageHeader(pdf);
  let ry = 18;
  ry = drawSectionTitle(pdf, ry, "ROI CONSOLIDÉ ÉQUIPE");
  ry += 4;

  let totalWeekEur = 0;
  for (const r of team.results) {
    const rate = hourlyRates[r.member.id] ?? 45;
    totalWeekEur += r.result.heures_economisees_semaine * rate * r.member.count;
  }

  const totalMonthEur = totalWeekEur * 4.33;
  const totalYearEur = totalWeekEur * 47;
  const totalEtp = totalHours / 35;

  drawTable(pdf, MARGIN, ry,
    ["Indicateur", "Valeur"],
    [
      ["Heures totales gagnées / semaine", `${totalHours.toFixed(1)}h`],
      ["Économie / semaine", formatEur(totalWeekEur)],
      ["Économie / mois", formatEur(totalMonthEur)],
      ["Économie / an", formatEur(totalYearEur)],
      ["Équivalent ETP", totalEtp.toFixed(2)],
    ],
    [100, 80],
    { highlightLastRow: true }
  );

  // ── Parcours + CTA ──
  pdf.addPage();
  pageTracker.current++;
  drawParcoursPage(pdf);

  pdf.addPage();
  pageTracker.current++;
  drawCtaPage(pdf, avgScore);

  // Apply footers
  const totalPages = pageTracker.current;
  for (let p = 2; p < totalPages; p++) {
    pdf.setPage(p);
    drawPageFooter(pdf, p, totalPages);
  }

  const date = new Date().toISOString().slice(0, 10);
  pdf.save(`declic-equipe-diagnostic-${date}.pdf`);
}
