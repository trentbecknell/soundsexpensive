#!/usr/bin/env node
/**
 * Create GitHub issues from Jira-style CSV backlog.
 * - Reads tools/backlog/jira_backlog.csv by default
 * - Creates labels as needed (best-effort)
 * - Creates issues for Epics and Stories/Tasks
 *
 * Usage:
 *   node tools/backlog/create_github_issues.mjs [path/to/csv] [--dry-run]
 *
 * Requirements:
 *   - GitHub CLI (gh) installed and authenticated: gh auth status
 */
import { readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';

const args = process.argv.slice(2);
const csvPath = args.find(a => !a.startsWith('-')) || path.resolve('tools/backlog/jira_backlog.csv');
const dryRun = args.includes('--dry-run') || process.env.DRY_RUN === '1';

function ok(code) { return code === 0; }
function sh(cmd, argv, opts = {}) {
  const res = spawnSync(cmd, argv, { stdio: 'pipe', encoding: 'utf8', ...opts });
  return { code: res.status ?? 0, out: res.stdout?.trim() ?? '', err: res.stderr?.trim() ?? '' };
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (c === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }
    if ((c === '\n' || c === '\r') && !inQuotes) {
      if (field !== '' || row.length > 0) {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      }
      // swallow CRLF pairs
      if (c === '\r' && next === '\n') i++;
      continue;
    }
    field += c;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function toObjects(rows) {
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).filter(r => r.length && r.some(c => c.trim() !== '')).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = (r[i] ?? '').trim());
    return obj;
  });
}

function ensureGhAvailable() {
  const res = sh('gh', ['--version']);
  if (!ok(res.code)) {
    throw new Error('GitHub CLI (gh) is required. Install from https://cli.github.com/ and run `gh auth login`.');
  }
}

function ensureLabels(allLabels) {
  const created = new Set();
  for (const label of allLabels) {
    const name = label.trim();
    if (!name) continue;
    if (created.has(name)) continue;
    const args = ['label', 'create', name, '-c', '0e8a16']; // green default; ignore if exists
    if (dryRun) {
      console.log(`[dry-run] gh ${args.join(' ')}`);
    } else {
      const res = sh('gh', args);
      // If label exists, stderr contains 'Already exists'; ignore errors
      if (!ok(res.code) && !/Already exists/i.test(res.err)) {
        console.warn(`warn: label '${name}' may not be created: ${res.err}`);
      }
    }
    created.add(name);
  }
}

function createIssue({ title, body, labels }) {
  const args = ['issue', 'create', '--title', title, '--body', body];
  for (const l of labels) args.push('--label', l);
  if (dryRun) {
    console.log(`[dry-run] gh ${args.join(' ')}`);
    return;
  }
  const res = sh('gh', args, { stdio: 'pipe' });
  if (!ok(res.code)) {
    console.error(`error creating issue '${title}':\n${res.err || res.out}`);
  } else {
    console.log(res.out);
  }
}

function main() {
  // 1) Read and parse CSV
  const raw = readFileSync(csvPath, 'utf8');
  const rows = parseCSV(raw);
  const records = toObjects(rows);

  const epics = records.filter(r => /Epic/i.test(r['Issue Type']));
  const others = records.filter(r => !/Epic/i.test(r['Issue Type']));

  // 2) Collect labels
  const baseLabels = new Set();
  for (const r of records) {
    (r['Labels'] || '').split(',').forEach(s => baseLabels.add(s.trim()).add(`type:${r['Issue Type']}`));
  }
  // Add derived priority labels
  for (const r of records) {
    const pri = (r['Priority'] || '').toUpperCase();
    if (pri) baseLabels.add(`priority:${pri.replace(/\s+/g, '-')}`);
  }

  ensureGhAvailable();
  ensureLabels(baseLabels);

  // 3) Create epics first
  for (const e of epics) {
    const title = `[Epic] ${e['Summary']}`.replace(/^\[Epic\] Epic — /, '[Epic] ');
    const labels = new Set();
    (e['Labels'] || '').split(',').forEach(s => s && labels.add(s));
    labels.add('epic');
    labels.add('type:Epic');
    labels.add(`priority:${(e['Priority']||'').toUpperCase().replace(/\s+/g,'-')}`);
    const body = `${e['Description'] || ''}\n\nIssue ID: ${e['Issue ID']}`.trim();
    createIssue({ title, body, labels: Array.from(labels).filter(Boolean) });
  }

  // 4) Create others (Stories/Tasks) with epic label mapping
  const epicById = new Map(epics.map(e => [e['Issue ID'], e]));
  for (const it of others) {
    const labels = new Set();
    (it['Labels'] || '').split(',').forEach(s => s && labels.add(s));
    labels.add(`type:${it['Issue Type']}`);
    labels.add(`priority:${(it['Priority']||'').toUpperCase().replace(/\s+/g,'-')}`);
    const epicId = it['Epic Link'];
    let epicSuffix = '';
    if (epicId && epicById.has(epicId)) {
      labels.add(`epic:${epicId}`);
      epicSuffix = `\nEpic: ${epicId} — ${epicById.get(epicId)['Summary']}`;
    }
    const title = it['Summary'];
    const body = `${it['Description'] || ''}\n\nIssue ID: ${it['Issue ID']}${epicSuffix}`.trim();
    createIssue({ title, body, labels: Array.from(labels).filter(Boolean) });
  }
}

try {
  main();
} catch (err) {
  console.error(err?.message || err);
  process.exit(1);
}
