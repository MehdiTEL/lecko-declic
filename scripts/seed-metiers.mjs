/**
 * Seed script for Supabase metiers table.
 * Run: node scripts/seed-metiers.mjs > supabase/seed-metiers.sql
 *
 * This generates INSERT SQL statements from the local job database.
 * Then paste the SQL into the Supabase SQL Editor to populate the table.
 */

import { readFileSync } from "fs";

// Read the compiled jobDatabase to extract the data
// Since it's TypeScript with path aliases, we parse it manually
const content = readFileSync("src/data/jobDatabase.ts", "utf-8");

// Extract job keys from the JOB_DATABASE object
const jobRegex = /"([^"]+)":\s*\{[\s\S]*?metier:\s*"([^"]+)"[\s\S]*?score_global:\s*(\d+)[\s\S]*?heures_economisees_semaine:\s*([\d.]+)/g;

let match;
const jobs = [];
while ((match = jobRegex.exec(content)) !== null) {
  jobs.push({
    key: match[1],
    metier: match[2],
    score: parseInt(match[3]),
    hours: parseFloat(match[4]),
  });
}

console.log("-- Seed script for metiers table");
console.log("-- Generated from src/data/jobDatabase.ts");
console.log("-- Run this SQL in the Supabase SQL Editor");
console.log("");

for (const job of jobs) {
  const slug = job.key.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-/]/g, "");
  console.log(`-- ${job.metier}`);
  console.log(`INSERT INTO public.metiers (slug, metier, score_global, heures_economisees_semaine, taches)`);
  console.log(`VALUES ('${slug}', '${job.metier.replace(/'/g, "''")}', ${job.score}, ${job.hours}, '[]'::jsonb)`);
  console.log(`ON CONFLICT (slug) DO UPDATE SET`);
  console.log(`  score_global = EXCLUDED.score_global,`);
  console.log(`  heures_economisees_semaine = EXCLUDED.heures_economisees_semaine,`);
  console.log(`  version = metiers.version + 1;`);
  console.log("");
}

console.log("-- NOTE: taches JSONB must be populated separately");
console.log("-- Use the Supabase dashboard or a full export script for the complete data");
