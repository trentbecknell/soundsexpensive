import React, { useEffect, useMemo, useState } from 'react';

type TabKey = 'roadmap' | 'master-plan' | 'grants' | 'applications' | 'mix-analyzer' | 'catalog-analyzer' | 'portfolio' | 'live' | 'talent' | 'merch';

type TipsState = {
  byTab: Record<TabKey, { index: number; dismissed: boolean } | undefined>;
  enabled: boolean; // global enable/disable
};

const LS_KEY = 'ar-page-tips-v1';

function loadState(): TipsState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as TipsState;
  } catch {}
  return { byTab: {} as TipsState['byTab'], enabled: true };
}

function saveState(state: TipsState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

const TIPS: Record<TabKey, string[]> = {
  'catalog-analyzer': [
    'Upload several released tracks to analyze consistency and quality trends.',
    'Use the insights to decide EP vs. Singles vs. Album before budgeting.',
  ],
  'roadmap': [
    'This board mirrors release phases. Add tasks per phase and owners to keep it accountable.',
    'Adjust tracks and weeks in Project to auto-update timeline and phase budgets.',
  ],
  'master-plan': [
    'Master Plan summarizes project scope, ROI signals, and key risks for stakeholders.',
  ],
  'grants': [
    'Save grants to track deadlines. Start an application to create a checklist and reminders.',
    'Match genre and location filters to narrow opportunities quickly.',
  ],
  'applications': [
    'Keep application notes and reminders here. Status changes will bubble up in navigation.',
  ],
  'mix-analyzer': [
    'Run mixes against benchmarks by genre. Address the top 1–2 issues per iteration.',
  ],
  'portfolio': [
    'Manage multiple artists. Compare two or more to see relative strengths and opportunities.',
  ],
  'live': [
    'Estimate draw to plan routing and budgets. Increase accuracy as you collect show data.',
  ],
  'talent': [
    'Use recommendations by role, then copy an outreach brief. Add your contact to speed replies.',
    'Try External Sources (beta) to search credits and local live activity.',
  ],
  'merch': [
    'Start with tees and stickers; adjust quantities by expected show draw. Use Copy quote to email vendors fast.',
    'Add items to your budget to track costs in the Growth phase. Iterate quantities after first runs.',
  ],
};

export default function PageTips({ tab }: { tab: TabKey }) {
  const [state, setState] = useState<TipsState>(() => loadState());
  const tips = TIPS[tab] || [];
  const current = state.byTab[tab] || { index: 0, dismissed: false };

  useEffect(() => { saveState(state); }, [state]);

  const visible = useMemo(() => state.enabled && tips.length > 0 && !current.dismissed, [state.enabled, tips.length, current.dismissed]);
  if (!visible) return (
    <div className="mb-3 flex items-center justify-end">
      <button
        className="text-[11px] rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700"
        onClick={() => setState(s => ({ ...s, enabled: true, byTab: { ...s.byTab, [tab]: { index: 0, dismissed: false } } }))}
      >
        Show tips
      </button>
    </div>
  );

  const idx = Math.min(current.index, tips.length - 1);
  const message = tips[idx];

  const next = () => setState(s => ({
    ...s,
    byTab: { ...s.byTab, [tab]: { index: (idx + 1) % tips.length, dismissed: false } }
  }));

  const dismiss = () => setState(s => ({
    ...s,
    byTab: { ...s.byTab, [tab]: { index: idx, dismissed: true } }
  }));

  const disableAll = () => setState(s => ({ ...s, enabled: false }));

  return (
    <div className="mb-4 rounded-xl border border-surface-700 bg-surface-800/70 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs text-surface-200 leading-relaxed">
          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-700/40 text-primary-200 text-[11px] align-top">i</span>
          {message}
        </div>
        <div className="flex items-center gap-2">
          {tips.length > 1 && (
            <button className="text-[11px] rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30" onClick={next}>
              Next
            </button>
          )}
          <button className="text-[11px] rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={dismiss}>
            Don’t show for this page
          </button>
          <button className="text-[11px] rounded border border-surface-600 text-surface-400 px-2 py-1 hover:bg-surface-700" onClick={disableAll}>
            Hide all
          </button>
        </div>
      </div>
      {tips.length > 1 && (
        <div className="mt-2 text-[11px] text-surface-400">Tip {idx + 1} of {tips.length}</div>
      )}
    </div>
  );
}
