#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";

function burn(dir: string): { deleted: number; freed: number; files: string[] } {
  const files: string[] = [];
  let totalSize = 0;
  if (!fs.existsSync(dir)) return { deleted: 0, freed: 0, files: [] };
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const r = burn(fullPath);
      files.push(...r.files);
      totalSize += r.freed;
    } else {
      const stat = fs.statSync(fullPath);
      totalSize += stat.size;
      files.push(fullPath);
      fs.unlinkSync(fullPath);
    }
  }
  fs.rmdirSync(dir);
  return { deleted: files.length, freed: totalSize, files };
}

const dir = process.argv[2] || "./dist";
if (!fs.existsSync(dir)) { console.log(`Directory not found: ${dir}`); process.exit(0); }
const result = burn(dir);
console.log(`Burned ${result.deleted} files, freed ${(result.freed / 1024).toFixed(2)} KB`);
