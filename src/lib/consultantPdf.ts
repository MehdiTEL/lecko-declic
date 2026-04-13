import jsPDF from "jspdf";
import type { Mission, Entretien, Chantier, Horizon, Priorite } from "@/types/consultant";
import { HORIZON_LABELS, PRIORITE_CONFIG } from "@/types/consultant";
import { SECTOR_LABELS } from "@/types/diagnostic";
import { ORG_SIZE_LABELS } from "@/types/diagnostic";
import type { Sector, OrgSize } from "@/types/diagnostic";

// ─── Color helpers ──────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

const BLUE: [number, number, number] = [37, 99, 235];
const ORANGE: [number, number, number] = [245, 158, 11];
const DARK: [number, number, number] = [30, 30, 30];
const GRAY: [number, number, number] = [107, 114, 128];
const WHITE: [number, number, number] = [255, 255, 255];
const LIGHT_BLUE_BG: [number, number, number] = [239, 246, 255];

// ─── Main export ────────────────────────────────────────────────────────────

export async function generateConsultantPdf(
  mission: Mission,
  entretiens: Entretien[],
  chantiers: Chantier[],
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const marginL = 18;
  const marginR = 18;
  const contentW = pageW - marginL - marginR;
  let currentPage = 1;

  const org = mission.client_organisation || mission.client_nom || "Client";
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function addFooter() {
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text("Document confidentiel", marginL, pageH - 10);
    doc.text(`${currentPage}`, pageW - marginR, pageH - 10, { align: "right" });
  }

  function newPage() {
    addFooter();
    doc.addPage();
    currentPage++;
  }

  function checkPageBreak(y: number, needed: number): number {
    if (y + needed > pageH - 20) {
      newPage();
      return 20;
    }
    return y;
  }

  function drawRoundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    fill: [number, number, number],
  ) {
    doc.setFillColor(...fill);
    doc.roundedRect(x, y, w, h, r, r, "F");
  }

  // ── PAGE 1 — Cover ─────────────────────────────────────────────────────────

  // Blue banner
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, pageW, 60, "F");

  // DÉCLIC title
  doc.setTextColor(...WHITE);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("DÉCLIC", marginL, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Cartographie IA", marginL, 38);

  // Date top-right
  doc.setFontSize(9);
  doc.text(today, pageW - marginR, 30, { align: "right" });

  // Title below banner
  let y = 78;
  doc.setTextColor(...DARK);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Cartographie des usages IA", marginL, y);
  y += 10;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  const orgLines = doc.splitTextToSize(org, contentW);
  doc.text(orgLines, marginL, y);
  y += orgLines.length * 9 + 4;

  // Orange decorative line
  doc.setFillColor(...ORANGE);
  doc.rect(marginL, y, 40, 1.5, "F");
  y += 10;

  // Mission info
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);

  const infoLines: string[] = [];
  if (mission.client_secteur)
    infoLines.push(`Secteur : ${SECTOR_LABELS[mission.client_secteur as Sector] ?? mission.client_secteur}`);
  if (mission.client_taille)
    infoLines.push(`Taille : ${ORG_SIZE_LABELS[mission.client_taille as OrgSize] ?? mission.client_taille}`);
  if (mission.date_livraison_prevue)
    infoLines.push(
      `Date de livraison : ${new Date(mission.date_livraison_prevue).toLocaleDateString("fr-FR")}`,
    );
  if (mission.client_contact_nom)
    infoLines.push(`Contact : ${mission.client_contact_nom}${mission.client_contact_poste ? ` — ${mission.client_contact_poste}` : ""}`);

  for (const line of infoLines) {
    doc.text(line, marginL, y);
    y += 5;
  }
  y += 6;

  // Objectif mission box
  if (mission.objectif_mission) {
    drawRoundedRect(marginL, y, contentW, 22, 3, LIGHT_BLUE_BG);
    doc.setTextColor(...BLUE);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Objectif de la mission", marginL + 5, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.setFontSize(8);
    const objLines = doc.splitTextToSize(mission.objectif_mission, contentW - 10);
    doc.text(objLines, marginL + 5, y + 12);
    y += 28;
  }

  // 4 KPIs
  y += 4;
  const entretiensDone = entretiens.filter((e) => e.statut === "termine");
  const servicesCount = new Set(entretiens.map((e) => e.service_nom)).size;
  const totalHeuresSem = chantiers.reduce((s, c) => s + c.temps_gagne_heures_semaine, 0);
  const totalImpactAn = chantiers.reduce((s, c) => s + (c.impact_total_heures_an ?? 0), 0);

  const kpis = [
    { label: "Services analysés", value: String(servicesCount) },
    { label: "Chantiers identifiés", value: String(chantiers.length) },
    { label: "Heures/sem", value: `${totalHeuresSem}h` },
    { label: "Impact/an", value: `${Math.round(totalImpactAn)}h` },
  ];

  const kpiW = (contentW - 9) / 4;
  kpis.forEach((kpi, i) => {
    const kx = marginL + i * (kpiW + 3);
    drawRoundedRect(kx, y, kpiW, 22, 3, LIGHT_BLUE_BG);
    doc.setTextColor(...BLUE);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(kpi.value, kx + kpiW / 2, y + 10, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(kpi.label, kx + kpiW / 2, y + 17, { align: "center" });
  });

  addFooter();

  // ── PAGE 2 — Synthèse par service ──────────────────────────────────────────

  newPage();
  y = 20;

  // Blue left bar + title
  doc.setFillColor(...BLUE);
  doc.rect(marginL, y, 3, 10, "F");
  doc.setTextColor(...DARK);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Synthèse par service", marginL + 7, y + 7);
  y += 18;

  for (const ent of entretiensDone) {
    if (!ent.resultats || ent.resultats.length === 0) continue;

    y = checkPageBreak(y, 30);

    // Service header
    drawRoundedRect(marginL, y, contentW, 8, 2, LIGHT_BLUE_BG);
    doc.setTextColor(...BLUE);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(ent.service_nom, marginL + 4, y + 5.5);
    y += 12;

    for (const result of ent.resultats) {
      y = checkPageBreak(y, 25);

      // Metier + score
      doc.setTextColor(...DARK);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(result.metier, marginL + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GRAY);
      doc.text(
        `Score: ${result.score_global}/5 — ${result.heures_economisees_semaine}h/sem`,
        marginL + 2 + doc.getTextWidth(result.metier) + 4,
        y,
      );
      y += 5;

      // Top 3 tasks
      const topTasks = [...result.taches]
        .sort((a, b) => b.temps_gagne_heures_semaine - a.temps_gagne_heures_semaine)
        .slice(0, 3);

      for (const task of topTasks) {
        y = checkPageBreak(y, 6);
        doc.setTextColor(...DARK);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const taskText = `• ${task.nom} — ${task.temps_gagne_heures_semaine}h/sem`;
        const taskLines = doc.splitTextToSize(taskText, contentW - 8);
        doc.text(taskLines, marginL + 6, y);
        y += taskLines.length * 3.5 + 1.5;
      }
      y += 3;
    }

    // Notes consultant
    if (ent.notes_consultant) {
      y = checkPageBreak(y, 16);
      const amberBg: [number, number, number] = [255, 251, 235];
      const amberText: [number, number, number] = [180, 120, 10];
      drawRoundedRect(marginL + 2, y, contentW - 4, 14, 2, amberBg);
      doc.setTextColor(...amberText);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("Notes consultant", marginL + 6, y + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      const noteLines = doc.splitTextToSize(ent.notes_consultant, contentW - 14);
      doc.text(noteLines, marginL + 6, y + 8);
      y += 18;
    }

    y += 4;
  }

  addFooter();

  // ── PAGE 3 — Chantiers prioritaires ────────────────────────────────────────

  newPage();
  y = 20;

  doc.setFillColor(...BLUE);
  doc.rect(marginL, y, 3, 10, "F");
  doc.setTextColor(...DARK);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Chantiers prioritaires", marginL + 7, y + 7);
  y += 18;

  const prioriteOrder: Priorite[] = ["critique", "haute", "normale", "basse"];

  for (const prio of prioriteOrder) {
    const group = chantiers.filter((c) => c.priorite === prio);
    if (group.length === 0) continue;

    y = checkPageBreak(y, 20);

    const cfg = PRIORITE_CONFIG[prio];
    const rgb = hexToRgb(cfg.color);
    const bgRgb = hexToRgb(cfg.bg);

    // Priority header
    drawRoundedRect(marginL, y, contentW, 8, 2, bgRgb as [number, number, number]);
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${cfg.label} (${group.length})`, marginL + 4, y + 5.5);
    y += 12;

    // Table header
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GRAY);
    doc.text("Titre", marginL + 2, y);
    doc.text("Service", marginL + 72, y);
    doc.text("Impact", marginL + 112, y);
    doc.text("Horizon", marginL + 132, y);
    doc.text("Niveau", marginL + 155, y);
    y += 4;

    for (const ch of group) {
      y = checkPageBreak(y, 8);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...DARK);

      const titreLines = doc.splitTextToSize(ch.titre, 66);
      doc.text(titreLines, marginL + 2, y);
      doc.setTextColor(...GRAY);
      doc.text(ch.service_concerne ?? "—", marginL + 72, y);
      doc.text(`${ch.score_impact}/5`, marginL + 112, y);
      doc.text(ch.horizon ? HORIZON_LABELS[ch.horizon] : "—", marginL + 132, y);
      doc.text(ch.niveau_accompagnement ?? "—", marginL + 155, y);
      y += Math.max(titreLines.length * 3.5, 5) + 1;
    }
    y += 4;
  }

  addFooter();

  // ── PAGE 4 — Feuille de route ──────────────────────────────────────────────

  newPage();
  y = 20;

  doc.setFillColor(...BLUE);
  doc.rect(marginL, y, 3, 10, "F");
  doc.setTextColor(...DARK);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Feuille de route", marginL + 7, y + 7);
  y += 18;

  const horizonCols: { key: Horizon; label: string; color: [number, number, number] }[] = [
    { key: "3_mois", label: "3 mois", color: [16, 185, 129] },
    { key: "6_mois", label: "6 mois", color: [245, 158, 11] },
    { key: "12_mois", label: "12 mois+", color: [239, 68, 68] },
  ];

  const colW = (contentW - 6) / 3;
  const colStartY = y;

  horizonCols.forEach((col, i) => {
    const cx = marginL + i * (colW + 3);

    // Column header
    drawRoundedRect(cx, colStartY, colW, 8, 2, col.color);
    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(col.label, cx + colW / 2, colStartY + 5.5, { align: "center" });

    // Cards
    const items = chantiers.filter((c) => {
      if (col.key === "12_mois") return c.horizon === "12_mois" || c.horizon === "plus";
      return c.horizon === col.key;
    });

    let cy = colStartY + 12;
    for (const ch of items) {
      const titreLines = doc.splitTextToSize(ch.titre, colW - 6);
      const cardH = titreLines.length * 3.5 + 10;

      drawRoundedRect(cx, cy, colW, cardH, 2, LIGHT_BLUE_BG);
      doc.setTextColor(...DARK);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(titreLines, cx + 3, cy + 4);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GRAY);
      doc.setFontSize(6);
      doc.text(ch.service_concerne ?? "", cx + 3, cy + cardH - 4);
      doc.text(`Impact: ${ch.score_impact}/5`, cx + colW - 3, cy + cardH - 4, { align: "right" });
      cy += cardH + 2;
    }
  });

  addFooter();

  // ── PAGE 5 — Accompagnement DÉCLIC ──────────────────────────────────────────

  newPage();
  y = 0;

  // Blue banner
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, pageW, 45, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Accompagnement DÉCLIC", pageW / 2, 25, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Nos offres pour accélérer votre transformation IA", pageW / 2, 34, {
    align: "center",
  });

  y = 58;

  // 3 accompagnement levels
  type AccLevel = { label: string; niveaux: string[]; color: [number, number, number] };
  const levels: AccLevel[] = [
    {
      label: "Express",
      niveaux: ["autonome"],
      color: [16, 185, 129],
    },
    {
      label: "Guidé",
      niveaux: ["guide"],
      color: [245, 158, 11],
    },
    {
      label: "Consultant",
      niveaux: ["consultant", "strategique"],
      color: [239, 68, 68],
    },
  ];

  const levelW = (contentW - 6) / 3;

  levels.forEach((lvl, i) => {
    const lx = marginL + i * (levelW + 3);
    const count = chantiers.filter((c) =>
      lvl.niveaux.includes(c.niveau_accompagnement ?? ""),
    ).length;

    drawRoundedRect(lx, y, levelW, 40, 3, LIGHT_BLUE_BG);

    // Color bar top
    doc.setFillColor(...lvl.color);
    doc.rect(lx, y, levelW, 3, "F");

    doc.setTextColor(...DARK);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(lvl.label, lx + levelW / 2, y + 16, { align: "center" });

    doc.setTextColor(...BLUE);
    doc.setFontSize(20);
    doc.text(String(count), lx + levelW / 2, y + 28, { align: "center" });

    doc.setTextColor(...GRAY);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("chantier" + (count > 1 ? "s" : ""), lx + levelW / 2, y + 33, { align: "center" });
  });

  y += 60;

  // Contact footer
  doc.setDrawColor(...GRAY);
  doc.setLineWidth(0.3);
  doc.line(marginL, y, pageW - marginR, y);
  y += 10;

  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DÉCLIC", pageW / 2, y, { align: "center" });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("declic.fr  |  contact@declic.fr", pageW / 2, y, { align: "center" });

  addFooter();

  // ── Save ───────────────────────────────────────────────────────────────────

  const filename = `DECLIC-Cartographie-${org.replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}
