import React, { useMemo } from 'react';
import type { Stage } from '../lib/computeStage';

// Type-only imports from App to avoid runtime cycles
import type { ArtistProfile, ProjectConfig, BudgetItem } from '../App';

// Local copies to avoid importing constants from App
const PHASE_ORDER = ["Discovery","Pre‑Production","Production","Post‑Production","Release","Growth"] as const;
type PhaseKey = typeof PHASE_ORDER[number];
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const sum = (arr: number[]) => arr.reduce((a,b)=>a+b,0);
const currency = (n: number) => n.toLocaleString(undefined,{style:"currency",currency:"USD", maximumFractionDigits:0});

function phaseWeeks(phase: PhaseKey, stage: Stage, units: number) {
  const base: Record<PhaseKey, number> = {
    "Discovery": 1, "Pre‑Production": 2,
    "Production": Math.max(2, Math.ceil(units/2)),
    "Post‑Production": Math.max(2, Math.ceil(units/2)),
    "Release": 2, "Growth": 6
  };
  const mult: Record<Stage, number> = {
    Emerging: 1.2, Developing: 1, Established: 0.9, Breakout: 0.8
  };
  return Math.max(1, Math.round(base[phase] * mult[stage]));
}

export interface ManagerOverviewProps {
  profile: ArtistProfile;
  project: ProjectConfig;
  budget: BudgetItem[];
  stage: Stage;
  estimatedDraw: number;
  onExportCSV?: () => void;
  onExportJSON?: () => void;
  onShare?: () => void;
}

export default function ManagerOverview({ profile, project, budget, stage, estimatedDraw, onExportCSV, onExportJSON, onShare }: ManagerOverviewProps) {
  const totals = useMemo(() => {
    const byPhase: Record<PhaseKey, number> = {"Discovery":0,"Pre‑Production":0,"Production":0,"Post‑Production":0,"Release":0,"Growth":0};
    for (const b of budget) byPhase[b.phase as PhaseKey] += b.qty * b.unitCost;
    const grand = sum(Object.values(byPhase));
    const afterGrant = grand - (project.hasGrant ? project.grantAmount : 0);
    return { byPhase, grand, afterGrant };
  }, [budget, project.hasGrant, project.grantAmount]);

  const gantt = useMemo(()=> {
    const rows: { name: string; start: number; end: number; phase: PhaseKey }[] = [];
    let cursor = project.startWeeks;
    for (const phase of PHASE_ORDER) {
      const blockWeeks = phaseWeeks(phase, stage, project.units);
      const taskWeeks = blockWeeks; // tasks not passed; rely on base model for overview
      rows.push({ name: phase, start: cursor, end: cursor + taskWeeks, phase });
      cursor += taskWeeks;
    }
    return rows;
  }, [project.startWeeks, project.units, stage]);

  const merchBudget = useMemo(() => {
    const items = budget.filter(b => b.category === 'Merch');
    return {
      count: items.length,
      total: items.reduce((a,b)=> a + b.qty*b.unitCost, 0)
    };
  }, [budget]);

  // Simple risk heuristics
  const risks = useMemo(() => {
    const r: string[] = [];
    const totalSpan = gantt.length ? (gantt[gantt.length - 1].end - gantt[0].start) : 0;
    if (project.targetWeeks < totalSpan) r.push(`Aggressive timeline: ${project.targetWeeks} weeks vs ~${totalSpan}`);
    if (!profile.artistName) r.push('Missing project/artist name');
    if (!profile.genres) r.push('Genres not specified (affects benchmarks)');
    if (!merchBudget.count) r.push('No merch planned (missed margin opportunity)');
    if (!project.hasGrant && totals.grand > 15000) r.push('No grant support identified for mid/high budget');
    return r;
  }, [gantt, project.targetWeeks, profile.artistName, profile.genres, merchBudget.count, project.hasGrant, totals.grand]);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <section className="rounded-2xl border border-surface-700 bg-surface-900/60 p-6 print:border-gray-300 print:bg-white print:p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap print:flex-nowrap">
          <div>
            <h2 className="text-lg font-semibold text-surface-50 print:text-gray-900">Executive Overview</h2>
            <p className="text-surface-300 text-sm print:text-gray-600">Concise summary for stakeholders. Read-only, with export options.</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            {onShare && <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50" onClick={onShare}>Share</button>}
            {onExportCSV && <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50" onClick={onExportCSV}>Export CSV</button>}
            {onExportJSON && <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50" onClick={onExportJSON}>Export JSON</button>}
            <button
              className="rounded-lg border border-accent-600 px-3 py-2 text-sm text-accent-100 hover:bg-accent-800/50"
              onClick={() => window.print()}
              title="Print or save as PDF"
            >
              Print PDF
            </button>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="rounded-2xl border border-surface-700 bg-surface-900/60 p-6 print:border-gray-300 print:bg-white print:p-4">
        <div className="grid gap-4 md:grid-cols-4 print:grid-cols-4">
          <div className="rounded-xl bg-surface-800/60 p-4 print:bg-gray-50 print:border print:border-gray-200">
            <div className="text-sm text-surface-400 print:text-gray-600">Est. Budget</div>
            <div className="text-2xl font-semibold print:text-xl print:text-gray-900">{currency(totals.grand)}</div>
          </div>
          <div className="rounded-xl bg-surface-800/60 p-4 print:bg-gray-50 print:border print:border-gray-200">
            <div className="text-sm text-surface-400 print:text-gray-600">After Grants</div>
            <div className="text-2xl font-semibold print:text-xl print:text-gray-900">{currency(Math.max(0, totals.afterGrant))}</div>
          </div>
          <div className="rounded-xl bg-surface-800/60 p-4 print:bg-gray-50 print:border print:border-gray-200">
            <div className="text-sm text-surface-400 print:text-gray-600">Project</div>
            <div className="text-sm text-surface-200 print:text-gray-800">{project.projectType} • {project.units} tracks • {project.targetWeeks} weeks</div>
          </div>
          <div className="rounded-xl bg-surface-800/60 p-4 print:bg-gray-50 print:border print:border-gray-200">
            <div className="text-sm text-surface-400 print:text-gray-600">Stage</div>
            <div className="text-2xl font-semibold print:text-xl print:text-gray-900">{stage}</div>
          </div>
        </div>
      </section>

      {/* Merch Summary */}
      <section className="rounded-2xl border border-surface-700 bg-surface-900/60 p-6 print:border-gray-300 print:bg-white print:p-4">
        <h3 className="mb-3 font-semibold print:text-gray-900">Merch Summary</h3>
        <div className="grid gap-4 md:grid-cols-3 print:grid-cols-3">
          <div className="rounded-xl bg-surface-800/60 p-4 print:bg-gray-50 print:border print:border-gray-200">
            <div className="text-sm text-surface-400 print:text-gray-600">Planned items</div>
            <div className="text-2xl font-semibold print:text-xl print:text-gray-900">{merchBudget.count}</div>
          </div>
          <div className="rounded-xl bg-surface-800/60 p-4 print:bg-gray-50 print:border print:border-gray-200">
            <div className="text-sm text-surface-400 print:text-gray-600">Total merch budget</div>
            <div className="text-2xl font-semibold print:text-xl print:text-gray-900">{currency(merchBudget.total)}</div>
          </div>
          <div className="rounded-xl bg-surface-800/60 p-4 print:bg-gray-50 print:border print:border-gray-200">
            <div className="text-sm text-surface-400 print:text-gray-600">Est. event draw</div>
            <div className="text-2xl font-semibold print:text-xl print:text-gray-900">{estimatedDraw}</div>
          </div>
        </div>
      </section>

      {/* Timeline milestones */}
      <section className="rounded-2xl border border-surface-700 bg-surface-900/60 p-6 print:border-gray-300 print:bg-white print:p-4">
        <h3 className="mb-3 font-semibold print:text-gray-900">Milestones (critical path)</h3>
        <div className="grid gap-3 md:grid-cols-3 print:grid-cols-3">
          {gantt.map(row => (
            <div key={row.phase} className="rounded-xl bg-surface-800/60 p-4 print:bg-gray-50 print:border print:border-gray-200">
              <div className="text-sm font-medium print:text-gray-900">{row.phase}</div>
              <div className="text-xs text-surface-300 print:text-gray-600">Weeks {row.start}–{row.end}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-surface-400 print:text-gray-600">Total span: {gantt.length ? (gantt[gantt.length - 1].end - gantt[0].start) : 0} weeks</div>
      </section>

      {/* Risks & Assumptions */}
      <section className="rounded-2xl border border-surface-700 bg-surface-900/60 p-6 print:border-gray-300 print:bg-white print:p-4">
        <h3 className="mb-3 font-semibold print:text-gray-900">Risks & Assumptions</h3>
        {risks.length === 0 ? (
          <div className="text-sm text-green-300 print:text-green-700">No major risks detected based on current inputs.</div>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-sm text-surface-200 print:text-gray-800">
            {risks.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        )}
        <p className="mt-3 text-xs text-surface-400 print:text-gray-600">Assumptions: standard lead times, typical vendor MOQs, and baseline marketing cadence for the selected stage.</p>
      </section>
    </div>
  );
}
