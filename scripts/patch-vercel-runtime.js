import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const TARGET_RUNTIME = 'nodejs22.x';
const VERCEL_OUTPUT_DIR = '.vercel/output/functions';

function findVcConfigFiles(dir, files = []) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        findVcConfigFiles(fullPath, files);
      } else if (entry === '.vc-config.json') {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist, skip
  }
  return files;
}

function patchRuntime() {
  const configFiles = findVcConfigFiles(VERCEL_OUTPUT_DIR);
  
  if (configFiles.length === 0) {
    console.log('[patch-vercel-runtime] No .vc-config.json files found');
    return;
  }

  for (const file of configFiles) {
    const content = JSON.parse(readFileSync(file, 'utf-8'));
    const oldRuntime = content.runtime;
    
    if (oldRuntime !== TARGET_RUNTIME) {
      content.runtime = TARGET_RUNTIME;
      writeFileSync(file, JSON.stringify(content, null, '\t'));
      console.log(`[patch-vercel-runtime] ${file}: ${oldRuntime} → ${TARGET_RUNTIME}`);
    } else {
      console.log(`[patch-vercel-runtime] ${file}: already ${TARGET_RUNTIME}`);
    }
  }
}

patchRuntime();
