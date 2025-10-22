import React, { useEffect, useMemo, useState } from "react";
import AssessmentWizard from "./components/AssessmentWizard";
import Toast from "./components/Toast";
import Chat, { ChatMessage } from "./components/Chat";
import { analyzeChatMessage, findMatchingArtists, suggestFollowupQuestions } from './lib/chatAnalysis';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

import computeStageFromScores, { Stage } from "./lib/computeStage";
type PhaseKey = "Discovery" | "Pre‑Production" | "Production" | "Post‑Production" | "Release" | "Growth";

interface ArtistProfile {
  artistName: string;
  genres: string;
  city: string;
  elevatorPitch: string;
  stage: Stage;
  stageScores: Record<string, number>;
}

interface ProjectConfig {
  projectType: "EP" | "Album" | "Singles";
  units: number;
  startWeeks: number;
  targetWeeks: number;
  hasGrant: boolean;
  grantAmount: number;
  targetMarkets: string[];
}

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  qty: number;
  unitCost: number;
  phase: PhaseKey;
  required: boolean;
}

interface RoadTask {
  id: string;
  phase: PhaseKey;
  title: string;
  owner: string;
  weeks: number;
}

interface AppState {
  profile: ArtistProfile;
  project: ProjectConfig;
  budget: BudgetItem[];
  tasks: RoadTask[];
}

const PHASE_ORDER: PhaseKey[] = ["Discovery","Pre‑Production","Production","Post‑Production","Release","Growth"];

const DEFAULT_PROFILE: ArtistProfile = {
  artistName: "",
  genres: "",
  city: "",
  elevatorPitch: "",
  stage: "Emerging",
  stageScores: { craft: 2, catalog: 2, brand: 1, team: 1, audience: 1, ops: 1 },
};

// Guided assessment questions mapped to profile keys.
const ASSESSMENT_QUESTIONS: { key: keyof ArtistProfile['stageScores']; title: string; help: string }[] = [
  { key: 'craft', title: 'Craft (writing & performance)', help: 'How consistent and developed are your songwriting, vocal or instrumental skills? 1 = emerging, 5 = world-class' },
  { key: 'catalog', title: 'Catalog (song inventory)', help: 'How many finished, releasable songs do you have and how strong are they? 1 = a few rough ideas, 5 = large, release-ready catalog' },
  { key: 'brand', title: 'Brand & Visuals', help: 'Do you have a clear sound, visual identity, and assets (photos, artwork, colors)?' },
  { key: 'team', title: 'Team & Partners', help: 'Do you have consistent collaborators, management, booking, or label partners?' },
  { key: 'audience', title: 'Audience & Engagement', help: 'Do you have a measurable and engaged audience across platforms?' },
  { key: 'ops', title: 'Ops (finance & legal)', help: 'Are your business operations, rights ownership, and finances organised?' },
];

const DEFAULT_PROJECT: ProjectConfig = {
  projectType: "EP",
  units: 3,
  startWeeks: 0,
  targetWeeks: 16,
  hasGrant: false,
  grantAmount: 0,
  targetMarkets: ["DSP","TikTok/Shorts","Live","Sync"],
};

const uid = () => Math.random().toString(36).slice(2, 9);
const sum = (arr: number[]) => arr.reduce((a,b)=>a+b,0);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const currency = (n: number) => n.toLocaleString(undefined,{style:"currency",currency:"USD", maximumFractionDigits:0});

// Initial chat messages to understand artist personality
const WELCOME_MESSAGES: ChatMessage[] = [
  { id: uid(), type: 'system', content: "Hey there! Before we dive into the technical details, I'd love to understand your artistic vision and personality. This will help shape the project in a way that truly reflects you." },
  { id: uid(), type: 'system', content: "Tell me about your sound, your inspirations, and what moves you as an artist. What feelings do you want to evoke in your listeners?" }
];

// Personality-focused suggestions
const PERSONALITY_SUGGESTIONS = [
  // Emotional/Expressive
  "I'm inspired by raw, emotional performances",
  "I tell deep, personal stories through my music",
  "My songs focus on social issues and change",
  
  // Sound/Production
  "I love creating dreamy, atmospheric soundscapes",
  "I blend electronic and organic instruments",
  "I prefer a raw, unpolished sound",
  "I aim for pristine, detailed production",
  
  // Energy/Style
  "My music is energetic and upbeat",
  "I create calm, introspective pieces",
  "I focus on heavy, intense sounds",
  
  // Approach
  "I tell stories through my lyrics",
  "I experiment with unconventional structures",
  "I prioritize catchy melodies and hooks",
  
  // Influences
  "I blend different cultural influences",
  "I'm inspired by classic genres",
  "I combine multiple genres in new ways",
  
  // Purpose
  "I'm focused on danceable rhythms",
  "I want my music to heal and uplift",
  "I create immersive sonic experiences"
];

function computeStage(profile: ArtistProfile): Stage {
  const s = profile.stageScores as any;
  return computeStageFromScores({ craft: s.craft, catalog: s.catalog, brand: s.brand, team: s.team, audience: s.audience, ops: s.ops });
}

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

const BUDGET_PRESETS = (units: number): BudgetItem[] => [
  { id: uid(), category: "Songwriting", description: "Co‑writing sessions", qty: units, unitCost: 300, phase: "Discovery", required: true },
  { id: uid(), category: "Pre‑Prod", description: "Producer pre‑pro & charts", qty: units, unitCost: 250, phase: "Pre‑Production", required: true },
  { id: uid(), category: "Recording", description: "Studio day rate", qty: Math.ceil(units/2), unitCost: 600, phase: "Production", required: true },
  { id: uid(), category: "Musicians", description: "Session players", qty: units*2, unitCost: 200, phase: "Production", required: false },
  { id: uid(), category: "Mixing", description: "Per song mix", qty: units, unitCost: 400, phase: "Post‑Production", required: true },
  { id: uid(), category: "Mastering", description: "Per song master", qty: units, unitCost: 100, phase: "Post‑Production", required: true },
  { id: uid(), category: "Artwork", description: "Cover + alt assets", qty: 1, unitCost: 500, phase: "Release", required: true },
  { id: uid(), category: "Video", description: "Performance/visualizer", qty: 1, unitCost: 750, phase: "Release", required: false },
  { id: uid(), category: "PR/Marketing", description: "3‑month sprint", qty: 1, unitCost: 3000, phase: "Growth", required: true },
  { id: uid(), category: "Ads", description: "DSP/social ads", qty: 1, unitCost: 1500, phase: "Growth", required: false },
];

const DEFAULT_TASKS = (units: number): RoadTask[] => [
  { id: uid(), phase: "Discovery", title: "Vision & references workshop", owner: "Artist/Producer", weeks: 1 },
  { id: uid(), phase: "Pre‑Production", title: "Demos & arrangements", owner: "Artist/Producer", weeks: 2 },
  { id: uid(), phase: "Production", title: `Track ${Math.min(3, units)} songs (core instruments)`, owner: "Producer", weeks: clamp(Math.ceil(units/2),1,4) },
  { id: uid(), phase: "Post‑Production", title: "Edits, mixing, mastering", owner: "Mix/Master", weeks: clamp(Math.ceil(units/1.5),1,4) },
  { id: uid(), phase: "Release", title: "DSP delivery & pre‑save setup", owner: "Mgmt", weeks: 1 },
  { id: uid(), phase: "Growth", title: "PR, content calendar, ad flights", owner: "Marketing", weeks: 4 },
];

const LS_KEY = "artist-roadmap-vite-v1";

function toCSV(rows: any[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const r of rows) {
    const line = headers.map((h)=> {
      const v = (r as any)[h];
      const s = typeof v === "string" ? v : JSON.stringify(v);
      return `"${String(s).replaceAll('"','""')}"`;
    }).join(",");
    lines.push(line);
  }
  return lines.join("\\n");
}

function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function encodeStateToUrl(state: AppState) {
  const json = JSON.stringify(state);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  const url = new URL(window.location.href); url.hash = `#s=${b64}`;
  return url.toString();
}
function decodeStateFromUrl(): AppState | null {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith("#s=")) return null;
    const b64 = hash.slice(3);
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch { return null; }
}

export default function App() {
  const [app, setApp] = useState<AppState>(() => {
    const fromUrl = decodeStateFromUrl(); if (fromUrl) return fromUrl;
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {
      profile: DEFAULT_PROFILE,
      project: DEFAULT_PROJECT,
      budget: BUDGET_PRESETS(DEFAULT_PROJECT.units),
      tasks: DEFAULT_TASKS(DEFAULT_PROJECT.units)
    };
  });

  // Chat state for personality capture
  const [chatComplete, setChatComplete] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(WELCOME_MESSAGES);
  
  const handleChatMessage = (message: string) => {
    // Add user message
    const userMsg: ChatMessage = { id: uid(), type: 'user', content: message };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    
  // Analyze latest user message for personality traits and sonic preferences
  const analysis = analyzeChatMessage(message);
    
    // Find matching artists if we have enough data
    const hasSubstantialData = 
      Object.keys(analysis.personality).length >= 3 ||
      Object.keys(analysis.sonics).length >= 3;

    setTimeout(() => {
      let response: ChatMessage;
      if (hasSubstantialData) {
        const matches = findMatchingArtists(analysis);
        if (matches.length > 0) {
          const match = matches[0];
          response = {
            id: uid(),
            type: 'system',
            content: `Based on your style, you remind me of ${match.name}! You share similar traits in ${Object.keys(analysis.personality).join(", ")}. ${suggestFollowupQuestions(analysis).join(" ")}`
          };
        } else {
          response = {
            id: uid(),
            type: 'system',
            content: suggestFollowupQuestions(analysis).join(" ")
          };
        }
      } else {
        response = {
          id: uid(),
          type: 'system',
          content: suggestFollowupQuestions(analysis).join(" ")
        };
      }

      // Complete the chat when we have enough information
      if (
        Object.keys(analysis.personality).length >= 5 &&
        Object.keys(analysis.sonics).length >= 4
      ) {
        setChatComplete(true);
      }

      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  useEffect(()=> { localStorage.setItem(LS_KEY, JSON.stringify(app)); }, [app]);

  // wizard visibility
  const [showWizard, setShowWizard] = useState(false);

  // simple toast message
  const [toast, setToast] = useState<string | null>(null);
  const pushToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const computedStage = useMemo(()=> computeStage(app.profile), [app.profile.stageScores]);
  useEffect(()=> {
    if (computedStage !== app.profile.stage) {
      setApp(prev => ({...prev, profile: {...prev.profile, stage: computedStage}}));
    }
  }, [computedStage]);

  const totals = useMemo(()=> {
    const byPhase: Record<PhaseKey, number> = {"Discovery":0,"Pre‑Production":0,"Production":0,"Post‑Production":0,"Release":0,"Growth":0};
    for (const b of app.budget) byPhase[b.phase] += b.qty * b.unitCost;
    const grand = sum(Object.values(byPhase));
    const afterGrant = grand - (app.project.hasGrant ? app.project.grantAmount : 0);
    return { byPhase, grand, afterGrant };
  }, [app.budget, app.project.hasGrant, app.project.grantAmount]);

  const gantt = useMemo(()=> {
    const rows: { name: string; start: number; end: number; phase: PhaseKey }[] = [];
    let cursor = app.project.startWeeks;
    for (const phase of PHASE_ORDER) {
      const blockWeeks = phaseWeeks(phase, app.profile.stage, app.project.units);
      const phaseTasks = app.tasks.filter(t => t.phase === phase);
      const taskWeeks = Math.max(blockWeeks, sum(phaseTasks.map(t => t.weeks)) || blockWeeks);
      rows.push({ name: phase, start: cursor, end: cursor + taskWeeks, phase });
      cursor += taskWeeks;
    }
    return rows;
  }, [app.tasks, app.project.startWeeks, app.project.units, app.profile.stage]);

  const addBudget = (phase: PhaseKey) => setApp(prev => ({
    ...prev, budget: [...prev.budget, { id: uid(), category: "Custom", description: "", qty: 1, unitCost: 0, phase, required: false }]
  }));
  const removeBudget = (id: string) => setApp(prev => ({...prev, budget: prev.budget.filter(b => b.id !== id)}));
  const addTask = (phase: PhaseKey) => setApp(prev => ({...prev, tasks: [...prev.tasks, { id: uid(), phase, title: "New task", owner: "", weeks: 1 }]}));
  const removeTask = (id: string) => setApp(prev => ({...prev, tasks: prev.tasks.filter(t => t.id !== id)}));

  const exportJSON = () => download(`${(app.profile.artistName || "artist").replaceAll(" ", "-")}-roadmap.json`, JSON.stringify(app, null, 2), "application/json");
  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { setApp(JSON.parse(String(reader.result))); alert("Imported settings."); }
      catch { alert("Invalid JSON file."); }
    };
    reader.readAsText(file);
  };
  const exportCSV = () => {
    const rows = app.budget.map(b => ({ phase: b.phase, category: b.category, description: b.description, qty: b.qty, unitCost: b.unitCost, total: b.qty * b.unitCost }));
    download("budget.csv", toCSV(rows), "text/csv");
  };
  const shareUrl = () => { const url = encodeStateToUrl(app); navigator.clipboard.writeText(url); alert("Sharable link copied to clipboard."); };
  const reset = () => { setApp({ profile: DEFAULT_PROFILE, project: DEFAULT_PROJECT, budget: BUDGET_PRESETS(DEFAULT_PROJECT.units), tasks: DEFAULT_TASKS(DEFAULT_PROJECT.units) }); window.history.replaceState({}, "", window.location.pathname); };

  return (
    <div className="min-h-screen w-full bg-surface-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-surface-50">Artist Roadmap <span className="text-surface-400">v1</span></h1>
            <p className="text-sm text-surface-400">Plan projects, estimate budgets, and generate a go‑to‑market timeline.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50 transition-colors" onClick={shareUrl}>Share</button>
            <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50 transition-colors" onClick={exportCSV}>CSV</button>
            <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50 transition-colors" onClick={exportJSON}>Export</button>
            <label className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50 transition-colors cursor-pointer">
              Import JSON
              <input type="file" accept="application/json" className="hidden" onChange={e => e.target.files && importJSON(e.target.files[0])}/>
            </label>
            <button className="rounded-lg border border-accent-600 px-3 py-2 text-sm text-accent-100 hover:bg-accent-800/50 transition-colors" onClick={reset}>Reset</button>
            <button
              className="rounded-lg border border-red-600 px-3 py-2 text-sm text-red-100 hover:bg-red-800/50 transition-colors"
              onClick={() => { localStorage.removeItem('artist-roadmap-vite-v1'); window.location.reload(); }}
            >
              Clear Local State
            </button>
          </div>
        </header>

        <div className="space-y-6">
          {!chatComplete ? (
            // Initial Chat Interface
            <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-primary-100">Let's Get to Know You</h2>
              <div className="h-[60vh] flex flex-col">
                <Chat
                  messages={chatMessages}
                  onSendMessage={handleChatMessage}
                  suggestions={PERSONALITY_SUGGESTIONS}
                  className="flex-1"
                />
              </div>
            </section>
          ) : (
            // Main App Content
            <>
            {/* Profile & Assessment */}
          <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold text-primary-100">Profile</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-surface-300">Artist / Project Name</label>
                <input className="w-full rounded-lg bg-surface-700/50 px-3 py-2 text-surface-100 placeholder-surface-500 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors" value={app.profile.artistName} onChange={e => setApp({...app, profile:{...app.profile, artistName: e.target.value}})} placeholder="e.g., Mic Carr" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-surface-300">Genres</label>
                <input className="w-full rounded-lg bg-surface-700/50 px-3 py-2 text-surface-100 placeholder-surface-500 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors" value={app.profile.genres} onChange={e => setApp({...app, profile:{...app.profile, genres: e.target.value}})} placeholder="Soul, R&B, Hip‑hop" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-surface-300">Home base</label>
                <input className="w-full rounded-lg bg-surface-700/50 px-3 py-2 text-surface-100 placeholder-surface-500 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors" value={app.profile.city} onChange={e => setApp({...app, profile:{...app.profile, city: e.target.value}})} placeholder="City, State" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-surface-300">Elevator pitch</label>
                <textarea rows={3} className="w-full rounded-lg bg-surface-700/50 px-3 py-2 text-surface-100 placeholder-surface-500 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors" value={app.profile.elevatorPitch} onChange={e => setApp({...app, profile:{...app.profile, elevatorPitch: e.target.value}})} placeholder="One or two sentences defining the sound, story, and audience." />
              </div>
            </div>

            <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Maturity self‑assessment</h3>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-surface-700 px-2 py-1 text-xs">{app.profile.stage}</span>
                  <button className="text-xs rounded px-2 py-1 border border-primary-600 text-primary-100" onClick={() => { setShowWizard(true); }}>Guided assessment</button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                  {ASSESSMENT_QUESTIONS.map(q => (
                    <div key={q.key}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{q.title}</span>
                        <span className="text-surface-300">{app.profile.stageScores[q.key]}/5</span>
                      </div>
                      <input type="range" min={1} max={5} step={1} value={app.profile.stageScores[q.key]} onChange={e => setApp({...app, profile:{...app.profile, stageScores:{...app.profile.stageScores, [q.key]: parseInt(e.target.value)}}})} className="w-full" />
                      <div className="mt-1 text-xs text-surface-400">{q.help}</div>
                    </div>
                  ))}
              </div>
            </div>
          </section>

            {showWizard && (
              <AssessmentWizard
                initialAnswers={app.profile.stageScores as any}
                onCancel={() => setShowWizard(false)}
                onFinish={(answers: Record<string, number>) => {
                  setApp(prev => ({...prev, profile: {...prev.profile, stageScores: {...prev.profile.stageScores, ...answers}}}));
                  // compute stage based on merged answers and show toast confirmation
                  const mergedProfile = {...app.profile, stageScores: {...app.profile.stageScores, ...answers}} as ArtistProfile;
                  const newStage = computeStage(mergedProfile);
                  pushToast(`Assessment saved — stage: ${newStage}`);
                  setShowWizard(false);
                }}
              />
            )}

            {toast && <Toast message={toast} />}

          {/* Project */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="mb-4 text-lg font-semibold">Project</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm">Project type</label>
                <select className="w-full rounded-lg bg-slate-800 px-3 py-2" value={app.project.projectType} onChange={e => setApp({...app, project:{...app.project, projectType: e.target.value as ProjectConfig['projectType']}})}>
                  <option value="EP">EP</option>
                  <option value="Album">Album</option>
                  <option value="Singles">Singles</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm"># Songs</label>
                <input type="number" min={1} className="w-full rounded-lg bg-slate-800 px-3 py-2" value={app.project.units} onChange={e => {
                  const units = clamp(parseInt(e.target.value || "1"), 1, 30);
                  setApp({...app, project:{...app.project, units}, budget: BUDGET_PRESETS(units), tasks: DEFAULT_TASKS(units)});
                }}/>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Total timeline (weeks)</label>
                <input type="number" min={6} className="w-full rounded-lg bg-slate-800 px-3 py-2" value={app.project.targetWeeks} onChange={e => setApp({...app, project:{...app.project, targetWeeks: clamp(parseInt(e.target.value || '6'), 6, 104)}})}/>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm">Target markets (comma separated)</label>
                <input className="w-full rounded-lg bg-slate-800 px-3 py-2" value={app.project.targetMarkets.join(", ")} onChange={e => setApp({...app, project:{...app.project, targetMarkets: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}})} placeholder="DSP, TikTok/Shorts, Live, Sync" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Grant support</label>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={app.project.hasGrant} onChange={e => setApp({...app, project:{...app.project, hasGrant: e.target.checked}})} />
                  <input type="number" min={0} className="w-full rounded-lg bg-slate-800 px-3 py-2" value={app.project.grantAmount} onChange={e => setApp({...app, project:{...app.project, grantAmount: Math.max(0, parseInt(e.target.value || '0'))}})} />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-indigo-600/10 p-4">
              <div className="text-sm text-indigo-300">Current est. budget</div>
              <div className="text-2xl font-semibold">{currency(totals.grand)} <span className="text-sm text-slate-400">({currency(Math.max(0, totals.afterGrant))} after grants)</span></div>
            </div>
          </section>

          {/* Budget */}
          <section className="space-y-4">
            {PHASE_ORDER.map(phase => (
              <div key={phase} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">{phase}</h3>
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg border border-slate-700 px-2 py-1 text-xs">Total: {currency(app.budget.filter(b=>b.phase===phase).reduce((a,b)=>a+b.qty*b.unitCost,0))}</span>
                    <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" onClick={()=> addBudget(phase)}>Add item</button>
                  </div>
                </div>
                <div className="grid gap-2">
                  {app.budget.filter(b=>b.phase===phase).map(b => (
                    <div key={b.id} className="grid grid-cols-12 items-center gap-2 rounded-xl bg-slate-800/60 p-3">
                      <input className="col-span-2 rounded bg-slate-900 px-2 py-1" value={b.category} onChange={e => setApp({...app, budget: app.budget.map(x=> x.id===b.id? {...x, category: e.target.value }: x)})}/>
                      <input className="col-span-5 rounded bg-slate-900 px-2 py-1" value={b.description} onChange={e => setApp({...app, budget: app.budget.map(x=> x.id===b.id? {...x, description: e.target.value }: x)})}/>
                      <input type="number" min={1} className="col-span-1 rounded bg-slate-900 px-2 py-1" value={b.qty} onChange={e => setApp({...app, budget: app.budget.map(x=> x.id===b.id? {...x, qty: Math.max(1, parseInt(e.target.value||'1')) }: x)})}/>
                      <input type="number" min={0} className="col-span-2 rounded bg-slate-900 px-2 py-1" value={b.unitCost} onChange={e => setApp({...app, budget: app.budget.map(x=> x.id===b.id? {...x, unitCost: Math.max(0, parseInt(e.target.value||'0')) }: x)})}/>
                      <div className="col-span-1 text-right text-sm">{currency(b.qty*b.unitCost)}</div>
                      <div className="col-span-1 flex justify-end">
                        <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" onClick={()=> removeBudget(b.id)}>X</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Quick fix: separate delete button for budget with correct function */}
          <style>{`.fixdelbtn{display:none}`}</style>

          {/* Roadmap & Charts */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* Kanban */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="mb-3 font-semibold">Phase board</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PHASE_ORDER.map(phase => (
                  <div key={phase} className="rounded-2xl border border-slate-800 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">{phase}</span>
                      <button className="rounded-lg border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800" onClick={()=> addTask(phase)}>Add</button>
                    </div>
                    <div className="space-y-2">
                      {app.tasks.filter(t=>t.phase===phase).map(t => (
                        <div key={t.id} className="rounded-xl bg-slate-800/60 p-3">
                          <input className="w-full rounded bg-slate-900 px-2 py-1" value={t.title} onChange={e => setApp({...app, tasks: app.tasks.map(x=> x.id===t.id? {...x, title: e.target.value }: x)})}/>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                            <input className="col-span-2 rounded bg-slate-900 px-2 py-1" placeholder="Owner" value={t.owner} onChange={e => setApp({...app, tasks: app.tasks.map(x=> x.id===t.id? {...x, owner: e.target.value }: x)})}/>
                            <input type="number" min={1} className="rounded bg-slate-900 px-2 py-1" value={t.weeks} onChange={e => setApp({...app, tasks: app.tasks.map(x=> x.id===t.id? {...x, weeks: Math.max(1, parseInt(e.target.value||'1')) }: x)})}/>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <button className="rounded-lg border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800" onClick={()=> removeTask(t.id)}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt-like chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="mb-3 font-semibold">Timeline (weeks)</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gantt.map(g => ({ name: g.phase, length: g.end - g.start }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="length" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-slate-400">Total span: {gantt.length ? (gantt[gantt.length - 1].end - gantt[0].start) : 0} weeks</div>
            </div>
          </section>

          {/* Budget by phase chart */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="mb-3 font-semibold">Budget by phase</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PHASE_ORDER.map(p => ({ phase: p, total: app.budget.filter(b=>b.phase===p).reduce((a,b)=>a+b.qty*b.unitCost,0) }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="phase" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Reports */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="mb-3 text-lg font-semibold">Reports</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-800/60 p-4">
                <div className="text-sm text-slate-400">Est. Budget</div>
                <div className="text-2xl font-semibold">{currency(totals.grand)}</div>
              </div>
              <div className="rounded-2xl bg-slate-800/60 p-4">
                <div className="text-sm text-slate-400">After Grants</div>
                <div className="text-2xl font-semibold">{currency(Math.max(0, totals.afterGrant))}</div>
              </div>
              <div className="rounded-2xl bg-slate-800/60 p-4">
                <div className="text-sm text-slate-400">Stage</div>
                <div className="text-2xl font-semibold">{app.profile.stage}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" onClick={exportCSV}>Export budget CSV</button>
              <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" onClick={exportJSON}>Export full JSON</button>
            </div>
          </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
