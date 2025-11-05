#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Ensure common node module binaries are executable (helpful when CI/hosts cache
// node_modules and lose exec permissions). This is a safe, best-effort script.
const repoRoot = path.resolve(__dirname, '..');
const candidates = [
  path.join(repoRoot, 'node_modules', '.bin', 'vite'),
  path.join(repoRoot, 'node_modules', '.bin', 'vite.js'),
  path.join(repoRoot, 'node_modules', '.bin', 'vite.cmd'),
  path.join(repoRoot, 'node_modules', '.bin', 'esbuild'),
  path.join(repoRoot, 'node_modules', '.bin', 'esbuild.exe')
];

let touched = 0;
for (const p of candidates) {
  try {
    if (fs.existsSync(p)) {
      try {
        // Attempt to set owner-exec/read/write bits. On Windows this may be a no-op.
        fs.chmodSync(p, 0o755);
        console.log('Made executable:', p);
        touched++;
      } catch (err) {
        console.warn('Could not chmod', p, err && err.message ? err.message : err);
      }
    }
  } catch (err) {
    // continue if anything odd happens reading the path
  }
}

if (touched === 0) {
  console.log('No known node binaries found to chmod. This is harmless.');
}

process.exit(0);
