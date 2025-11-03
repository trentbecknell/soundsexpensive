# Backlog Import Artifacts

This folder contains import-ready artifacts to load your product backlog into Jira and to create GitHub issues.

## Files

- `jira_backlog.csv` — Jira CSV import with Epics and Stories/Tasks
- `create_github_issues.mjs` — Node script to create GitHub issues from the CSV via GitHub CLI

## Jira Import (CSV)

1) In Jira Cloud: Project Settings → Import & export → External system import → CSV
2) Upload `tools/backlog/jira_backlog.csv`
3) Map fields:
   - Issue ID → External ID (or leave unmapped)
   - Summary → Summary
   - Issue Type → Issue Type
   - Description → Description
   - Priority → Priority
   - Epic Name → Epic Name (Epics only)
   - Epic Link → Epic Link (Stories/Tasks; references Issue ID of Epic)
   - Labels → Labels
4) Start import. Epics are created first; Stories/Tasks are linked to Epics by `Epic Link`.

Notes:
- You can deselect items you do not wish to import.
- If your Jira requires numeric priorities, adjust mapping accordingly.

## GitHub Issues (gh CLI)

Prereqs:
- Install GitHub CLI and authenticate in this repo: `gh auth login`
- Node 18+ available: `node -v`

Run (dry-run first):

```bash
node tools/backlog/create_github_issues.mjs --dry-run
```

Then create issues for real:

```bash
node tools/backlog/create_github_issues.mjs
```

What it does:
- Parses `jira_backlog.csv` with a minimal CSV parser
- Ensures labels exist (best-effort; ignores "Already exists")
- Creates issues for Epics first (label: `epic`), then Stories/Tasks
- Adds derived labels like `type:Story` and `priority:HIGHEST` and `epic:E1`

Tips:
- To scope to a subset, duplicate the CSV and delete rows you don't want, then pass the file path:
  `node tools/backlog/create_github_issues.mjs /path/to/filtered.csv`
- Use GitHub Projects for "epics" if you want hierarchical tracking, or keep `epic:E#` labels.
