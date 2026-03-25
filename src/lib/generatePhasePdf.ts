import jsPDF from "jspdf";
import type { PhaseTemplate } from "./declicTemplates";

const BLUE = [37, 99, 235] as const;
const ORANGE = [245, 158, 11] as const;
const BLACK = [17, 24, 39] as const;
const GREY = [55, 65, 81] as const;
const LIGHT_GREY = [107, 114, 128] as const;
const BG_BLUE = [238, 242, 255] as const;
const BG_ALT = [250, 250, 250] as const;
const WHITE = [255, 255, 255] as const;

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - 2 * MARGIN;

type RGB = readonly [number, number, number];

function setColor(pdf: jsPDF, c: RGB) { pdf.setTextColor(c[0], c[1], c[2]); }
function setFill(pdf: jsPDF, c: RGB) { pdf.setFillColor(c[0], c[1], c[2]); }
function setDraw(pdf: jsPDF, c: RGB) { pdf.setDrawColor(c[0], c[1], c[2]); }

class Cursor {
  y: number;
  page: number;
  private pdf: jsPDF;

  constructor(pdf: jsPDF, startY = 20) {
    this.pdf = pdf;
    this.y = startY;
    this.page = 1;
  }

  ensureSpace(needed: number) {
    if (this.y + needed > PAGE_H - 25) {
      this.pdf.addPage();
      this.page++;
      this.y = 20;
    }
  }

  advance(dy: number) {
    this.y += dy;
  }
}

function drawFooter(pdf: jsPDF, pageNum: number, totalPages: number) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  setColor(pdf, LIGHT_GREY);
  pdf.text(`Page ${pageNum} / ${totalPages}`, MARGIN, PAGE_H - 10);
  pdf.text("DECLIC by Lecko", PAGE_W - MARGIN, PAGE_H - 10, { align: "right" });
}

function drawCover(pdf: jsPDF, template: PhaseTemplate) {
  // Logo
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  setColor(pdf, BLUE);
  pdf.text("DECLIC", MARGIN, 25);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  setColor(pdf, LIGHT_GREY);
  pdf.text("by Lecko", MARGIN + 38, 25);

  // Orange bar
  setFill(pdf, ORANGE);
  pdf.rect(0, 35, PAGE_W, 1.5, "F");

  // Phase title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  setColor(pdf, BLACK);
  pdf.text(`Phase ${template.label} — ${template.nom}`, MARGIN, 65);

  // Description
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  setColor(pdf, GREY);
  const descLines = pdf.splitTextToSize(template.description, CONTENT_W);
  pdf.text(descLines, MARGIN, 80);

  // Instruction
  pdf.setFontSize(10);
  setColor(pdf, LIGHT_GREY);
  pdf.text("Ce template est a remplir avec votre equipe.", MARGIN, 100);
  pdf.text("Imprimez-le ou completez-le numeriquement.", MARGIN, 106);

  // Date
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  pdf.setFontSize(9);
  pdf.text(today, PAGE_W - MARGIN, PAGE_H - 25, { align: "right" });

  // Orange square decoration
  setFill(pdf, ORANGE);
  pdf.roundedRect(MARGIN, PAGE_H - 30, 15, 12, 2, 2, "F");
}

function drawTextField(pdf: jsPDF, c: Cursor, label: string, placeholder?: string) {
  c.ensureSpace(14);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setColor(pdf, LIGHT_GREY);
  pdf.text(label, MARGIN, c.y);
  c.advance(5);

  setDraw(pdf, [200, 200, 200]);
  pdf.setLineWidth(0.3);
  pdf.line(MARGIN, c.y, MARGIN + CONTENT_W, c.y);
  c.advance(3);

  if (placeholder) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    setColor(pdf, [180, 180, 180]);
    pdf.text(placeholder, MARGIN + 1, c.y);
  }
  c.advance(6);
}

function drawTextarea(pdf: jsPDF, c: Cursor, label: string, placeholder?: string) {
  const lineCount = placeholder ? Math.max(3, placeholder.split("\n").length + 1) : 4;
  const blockH = 5 + lineCount * 5.5;
  c.ensureSpace(blockH + 8);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setColor(pdf, LIGHT_GREY);
  pdf.text(label, MARGIN, c.y);
  c.advance(4);

  // Draw lined box
  setDraw(pdf, [220, 220, 220]);
  pdf.setLineWidth(0.2);
  for (let i = 0; i < lineCount; i++) {
    pdf.line(MARGIN, c.y + i * 5.5, MARGIN + CONTENT_W, c.y + i * 5.5);
  }

  if (placeholder) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    setColor(pdf, [190, 190, 190]);
    pdf.text(placeholder.substring(0, 80), MARGIN + 1, c.y + 3.5);
  }

  c.advance(lineCount * 5.5 + 4);
}

function drawTable(pdf: jsPDF, c: Cursor, label: string, colonnes: string[], lignes: number) {
  const colW = CONTENT_W / colonnes.length;
  const rowH = 7;
  const headerH = 8;
  const totalH = headerH + lignes * rowH + 8;
  c.ensureSpace(totalH + 10);

  // Label
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setColor(pdf, LIGHT_GREY);
  pdf.text(label, MARGIN, c.y);
  c.advance(5);

  // Header row
  setFill(pdf, BG_BLUE);
  pdf.rect(MARGIN, c.y, CONTENT_W, headerH, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  setColor(pdf, BLUE);
  colonnes.forEach((col, i) => {
    pdf.text(col, MARGIN + i * colW + 2, c.y + 5.5);
  });
  c.advance(headerH);

  // Data rows
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  setDraw(pdf, [230, 230, 230]);
  pdf.setLineWidth(0.2);

  for (let r = 0; r < lignes; r++) {
    if (c.y + rowH > PAGE_H - 25) {
      pdf.addPage();
      c.page++;
      c.y = 20;
    }

    if (r % 2 === 1) {
      setFill(pdf, BG_ALT);
      pdf.rect(MARGIN, c.y, CONTENT_W, rowH, "F");
    }
    pdf.line(MARGIN, c.y + rowH, MARGIN + CONTENT_W, c.y + rowH);

    // Vertical lines
    colonnes.forEach((_, i) => {
      if (i > 0) pdf.line(MARGIN + i * colW, c.y, MARGIN + i * colW, c.y + rowH);
    });

    c.advance(rowH);
  }
  c.advance(4);
}

function drawChecklist(pdf: jsPDF, c: Cursor, label: string, options: string[]) {
  c.ensureSpace(8 + options.length * 7);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setColor(pdf, LIGHT_GREY);
  pdf.text(label, MARGIN, c.y);
  c.advance(5);

  options.forEach((opt) => {
    c.ensureSpace(7);
    // Checkbox square
    setDraw(pdf, [180, 180, 180]);
    pdf.setLineWidth(0.3);
    pdf.rect(MARGIN + 1, c.y - 2.5, 3, 3);

    // Option text
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setColor(pdf, GREY);
    pdf.text(opt, MARGIN + 7, c.y);
    c.advance(6);
  });
  c.advance(3);
}

export async function generatePhasePdf(template: PhaseTemplate): Promise<void> {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Page 1 — Cover
  drawCover(pdf, template);

  // Content pages
  pdf.addPage();
  const cursor = new Cursor(pdf, 20);

  for (const section of template.sections) {
    cursor.ensureSpace(20);

    // Section title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    setColor(pdf, BLUE);
    pdf.text(section.titre, MARGIN, cursor.y);
    cursor.advance(2);

    // Blue underline
    setDraw(pdf, BLUE);
    pdf.setLineWidth(0.5);
    pdf.line(MARGIN, cursor.y, MARGIN + CONTENT_W, cursor.y);
    cursor.advance(6);

    for (const champ of section.champs) {
      switch (champ.type) {
        case "text":
          drawTextField(pdf, cursor, champ.label, champ.placeholder);
          break;
        case "textarea":
          drawTextarea(pdf, cursor, champ.label, champ.placeholder);
          break;
        case "table":
          drawTable(pdf, cursor, champ.label, champ.colonnes ?? [], champ.lignes ?? 5);
          break;
        case "checklist":
          drawChecklist(pdf, cursor, champ.label, champ.options ?? []);
          break;
      }
    }
    cursor.advance(6);
  }

  // Add footers to all pages
  const totalPages = cursor.page + 1; // +1 for cover
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    drawFooter(pdf, p, totalPages);
  }

  pdf.save(`DECLIC-Phase${template.phase}-${template.nom}.pdf`);
}
