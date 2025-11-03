// TEMPORARILY DISABLED - Clerk auth not active
// Dedicated logout button using Clerk signOut
/*
function LogoutButton() {
  const { signOut } = useClerk();
  return (
    <button
      className="ml-2 rounded-lg border border-red-600 px-3 py-2 text-sm text-red-100 hover:bg-red-800/50 transition-colors"
      onClick={async () => {
        await signOut();
        localStorage.removeItem('artist-roadmap-vite-v1');
        window.location.href = '/soundsexpensive/sign-in';
      }}
      title="Log out of this account"
    >
      Log out
    </button>
  );
}
*/
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// TEMPORARILY DISABLED - Clerk components
// import { UserButton, OrganizationSwitcher } from "@clerk/clerk-react";
// import { useClerk } from "@clerk/clerk-react";


import AssessmentWizard from "./components/AssessmentWizard";
import Toast from "./components/Toast";
import Chat, { ChatMessage } from "./components/Chat";
import GrantDiscovery from "./components/GrantDiscovery";
import GrantApplicationTracker from "./components/GrantApplicationTracker";
import MixAnalyzer from "./components/MixAnalyzer";
import CatalogAnalyzer from "./components/CatalogAnalyzer";
import OnboardingWelcome from "./components/OnboardingWelcome";
import WelcomeBackDashboard from "./components/WelcomeBackDashboard";
import ArtistSwitcher from "./components/ArtistSwitcher";
import PortfolioDashboard from "./components/PortfolioDashboard";
import ArtistComparisonView from "./components/ArtistComparisonView";
import PortfolioAnalytics from "./components/PortfolioAnalytics";
import TourPlanner from "./components/TourPlanner";
import MasterPlan from "./components/MasterPlan";
import { analyzeChatMessage, findMatchingArtists, suggestFollowupQuestions } from './lib/chatAnalysis';
import { mapChatAnalysisToAssessment, convertLegacyProfileToAssessment } from './lib/assessmentMapping';
import { getBenchmarkForGenres, calculateSuccessProbability, generateRecommendations } from './lib/industryBenchmarks';
import { ArtistSelfAssessment, PartialAssessment } from './types/artistAssessment';
import { GrantOpportunity, GrantApplication, ApplicationStatus } from './types/grants';
import { GRANT_OPPORTUNITIES } from './data/grants';
import { CatalogAnalysisResult } from './types/catalogAnalysis';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { Portfolio, ArtistRecord, createArtistRecord } from './types/portfolio';
import { 
  loadPortfolio, 
  savePortfolio, 
  getActiveArtist, 
  addArtist, 
  updateArtist, 
  switchActiveArtist,
  deleteArtist 
} from './lib/portfolioStorage';

import computeStageFromScores, { Stage } from "./lib/computeStage";
type PhaseKey = "Discovery" | "Pre‑Production" | "Production" | "Post‑Production" | "Release" | "Growth";

export interface ArtistProfile {
  artistName: string;
  genres: string;
  city: string;
  elevatorPitch: string;
  stage: Stage;
  stageScores: Record<string, number>;
}

export interface ProjectConfig {
  projectType: "EP" | "Album" | "Singles";
  units: number;
  startWeeks: number;
  targetWeeks: number;
  hasGrant: boolean;
  grantAmount: number;
  targetMarkets: string[];
}

export interface BudgetItem {
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
  assessment?: PartialAssessment; // New schema-based assessment
  savedGrants: string[]; // Grant IDs that user has saved
  grantApplications: GrantApplication[]; // User's grant applications
  // Onboarding & Flow State
  onboardingComplete: boolean; // Has user completed initial flow?
  catalogAnalysisComplete: boolean; // Has user analyzed their catalog?
  chatPlanningComplete: boolean; // Has user done planning chat?
  roadmapGenerated: boolean; // Has initial roadmap been generated?
  lastActiveTab: string; // Remember user's last active tab
  firstVisitDate?: string; // ISO date of first visit
  catalogAnalysisData?: CatalogAnalysisResult; // Store catalog analysis results for chat context
  // Live Performance State
  estimatedDraw: number; // Artist's estimated draw for live shows
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

// Generate planning-focused chat messages based on catalog analysis
const generatePlanningMessages = (catalogData?: CatalogAnalysisResult): ChatMessage[] => {
  if (catalogData) {
    // User has completed catalog analysis - professional data-driven planning
    const avgScore = catalogData.average_score.toFixed(0);
    const consistency = catalogData.sonic_identity.consistency_score.toFixed(0);
    const trackCount = catalogData.total_tracks;
    const trend = catalogData.score_trend === 'improving' ? 'improving' : catalogData.score_trend === 'declining' ? 'declining' : 'stable';
    
    return [
      { 
        id: uid(), 
        type: 'system', 
        content: `Catalog analysis complete. We've assessed ${trackCount} tracks with an average quality score of ${avgScore}/100 and ${consistency}% sonic consistency. Quality trend: ${trend}.`
      },
      { 
        id: uid(), 
        type: 'system', 
        content: `Let's build a strategic roadmap. Consider: What's the optimal release format given this catalog strength? What timeline aligns with the artist's current momentum? What budget constraints should we account for?`
      }
    ];
  } else {
    // No catalog analysis yet - professional planning intro
    return [
      { 
        id: uid(), 
        type: 'system', 
        content: "Welcome to the Artist Roadmap Builder. This tool helps A&R professionals and label teams create data-driven release strategies for emerging artists."
      },
      { 
        id: uid(), 
        type: 'system', 
        content: "To begin: What's the artist's release format? (EP, Album, Singles) What's their timeline constraint? What are their primary career goals at this stage?"
      }
    ];
  }
};

// Default welcome messages (will be replaced with planning messages)
const WELCOME_MESSAGES: ChatMessage[] = [
  { id: uid(), type: 'system', content: "Artist Development Planning Tool - This platform helps label professionals assess artist readiness and create evidence-based career roadmaps." },
  { id: uid(), type: 'system', content: "Start by analyzing the artist's current catalog to establish baseline metrics. Then use the strategic planning module to build a customized release strategy with realistic timelines and budgets." }
];

// Planning-focused suggestions for roadmap building
const PLANNING_SUGGESTIONS = [
  // Project scope & format
  "Planning a 4-5 track EP to showcase the artist's core sound",
  "Considering a full album (10-12 tracks) for comprehensive market positioning", 
  "Singles release strategy - one track every 6-8 weeks to build momentum",
  "Mixtape/compilation format for rapid market testing",
  
  // Timeline & urgency
  "Artist needs to release within 3-4 months (fast-track timeline)",
  "Standard 6-9 month development cycle for optimal marketing build",
  "Extended 12+ month timeline for maximum quality and positioning",
  "Specific deadline tied to tour, sync opportunity, or label milestone",
  
  // Budget & resources
  "Working with limited budget ($2-5K total investment)",
  "Mid-tier budget available ($10-20K for professional production)",
  "DIY/lean approach to minimize risk and maximize learning",
  "Need budget recommendations based on industry standards",
  
  // Goals & strategy
  "Priority: Build streaming presence and playlist placement",
  "Focus: Live performance and touring to develop fanbase",
  "Target: Sync licensing opportunities for film/TV placement",
  "Goal: Position artist for label interest and A&R attention"
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

// Smart Roadmap Generator - Creates intelligent defaults based on catalog analysis and chat
interface RoadmapSuggestion {
  projectType: "EP" | "Album" | "Singles";
  units: number;
  targetWeeks: number;
  estimatedBudget: number;
  rationale: string;
}

const generateSmartRoadmap = (
  catalogData?: CatalogAnalysisResult,
  chatMessages?: ChatMessage[]
): RoadmapSuggestion => {
  let projectType: "EP" | "Album" | "Singles" = "EP";
  let units = 3;
  let targetWeeks = 16;
  let rationale = "Default configuration for emerging artists";

  // Analyze chat messages for explicit preferences
  const chatText = chatMessages?.map(m => m.content.toLowerCase()).join(' ') || '';
  
  // Detect project type from chat
  if (chatText.includes('album') || chatText.includes('10-12 tracks') || chatText.includes('full album')) {
    projectType = "Album";
    units = 10;
    targetWeeks = 24;
  } else if (chatText.includes('singles') || chatText.includes('single strategy') || chatText.includes('one track')) {
    projectType = "Singles";
    units = 1;
    targetWeeks = 12;
  } else if (chatText.includes('ep') || chatText.includes('4-5 track')) {
    projectType = "EP";
    units = 4;
    targetWeeks = 16;
  }

  // Detect timeline from chat
  if (chatText.includes('3-4 months') || chatText.includes('fast timeline') || chatText.includes('quick')) {
    targetWeeks = Math.min(targetWeeks, 16);
  } else if (chatText.includes('6-9 months')) {
    targetWeeks = clamp(targetWeeks, 20, 36);
  } else if (chatText.includes('12+ months') || chatText.includes('take my time')) {
    targetWeeks = Math.max(targetWeeks, 40);
  }

  // Use catalog data to refine suggestions if available
  if (catalogData) {
    const avgScore = catalogData.average_score;
    const totalTracks = catalogData.total_tracks;
    const consistency = catalogData.sonic_identity.consistency_score;
    const trend = catalogData.score_trend;

    // High quality + many tracks = suggest album
    if (avgScore >= 75 && totalTracks >= 8 && consistency >= 70 && projectType === "EP") {
      projectType = "Album";
      units = Math.min(totalTracks, 12);
      rationale = `Your catalog shows ${totalTracks} high-quality tracks (${avgScore.toFixed(0)}/100) with ${consistency.toFixed(0)}% consistency. Perfect for an album!`;
    }
    // Good quality + few tracks = suggest EP
    else if (avgScore >= 65 && totalTracks >= 3 && totalTracks <= 6) {
      projectType = "EP";
      units = Math.min(totalTracks, 5);
      rationale = `Your ${totalTracks} tracks (${avgScore.toFixed(0)}/100 avg) are strong - ideal for a focused EP showcasing your best work.`;
    }
    // Lower quality or inconsistent = suggest singles
    else if (avgScore < 65 || consistency < 60) {
      projectType = "Singles";
      units = 1;
      targetWeeks = 12;
      rationale = `Based on your catalog analysis, starting with singles lets you test and refine your sound before a larger release.`;
    }
    // Improving trend = encourage bigger project
    else if (trend === 'improving' && totalTracks >= 5) {
      projectType = totalTracks >= 8 ? "Album" : "EP";
      units = totalTracks >= 8 ? 10 : 5;
      rationale = `Your quality is improving (${trend}) - capitalize on this momentum with a ${projectType.toLowerCase()}!`;
    }
    // Default to EP with catalog-informed units
    else {
      units = clamp(totalTracks, 3, 6);
      rationale = `Based on your ${totalTracks}-track catalog with ${avgScore.toFixed(0)}/100 quality, starting with a ${units}-track EP.`;
    }
  }

  // Calculate budget estimate
  const budget = BUDGET_PRESETS(units);
  const estimatedBudget = budget.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);

  return {
    projectType,
    units,
    targetWeeks,
    estimatedBudget,
    rationale
  };
};

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

export interface AppProps {
  userId?: string; // Clerk user ID for data scoping (undefined = anonymous)
}

export default function App({ userId }: AppProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Portfolio Management - Multi-Artist Support
  const [portfolio, setPortfolio] = useState<Portfolio>(() => loadPortfolio(userId));
  
  // Get current active artist state
  const activeArtistRecord = getActiveArtist(portfolio);
  
  const [app, setApp] = useState<AppState>(() => {
    // If we have an active artist in portfolio, use their state
    if (activeArtistRecord) {
      return activeArtistRecord.state;
    }
    
    // Otherwise, check URL state or create new
    // First check URL state
    const fromUrl = decodeStateFromUrl(); 
    if (fromUrl) {
      // Ensure all required properties exist in URL state
      if (!fromUrl.savedGrants) fromUrl.savedGrants = [];
      if (!fromUrl.grantApplications) fromUrl.grantApplications = [];
      if (fromUrl.onboardingComplete === undefined) fromUrl.onboardingComplete = true;
      if (fromUrl.catalogAnalysisComplete === undefined) fromUrl.catalogAnalysisComplete = false;
      if (fromUrl.chatPlanningComplete === undefined) fromUrl.chatPlanningComplete = false;
      if (fromUrl.roadmapGenerated === undefined) fromUrl.roadmapGenerated = true;
      if (!fromUrl.lastActiveTab) fromUrl.lastActiveTab = 'roadmap';
      if (!fromUrl.firstVisitDate) fromUrl.firstVisitDate = new Date().toISOString();
      if (fromUrl.catalogAnalysisData === undefined) fromUrl.catalogAnalysisData = undefined;
      return fromUrl;
    }
    
    // Then check localStorage
    const raw = localStorage.getItem(LS_KEY);
    const baseState = raw ? JSON.parse(raw) : {
      profile: DEFAULT_PROFILE,
      project: DEFAULT_PROJECT,
      budget: BUDGET_PRESETS(DEFAULT_PROJECT.units),
      tasks: DEFAULT_TASKS(DEFAULT_PROJECT.units),
      savedGrants: [],
      grantApplications: [],
      // New onboarding fields - default to true to allow free navigation
      onboardingComplete: true,
      catalogAnalysisComplete: false,
      chatPlanningComplete: false,
      roadmapGenerated: false,
      lastActiveTab: 'roadmap', // Start at roadmap - assessment is optional
      firstVisitDate: new Date().toISOString(),
      catalogAnalysisData: undefined,
      estimatedDraw: 100 // Default draw for live performance planning
    };
    
    // Migration for existing users - add new fields if missing
    if (!baseState.savedGrants) {
      baseState.savedGrants = [];
    }
    if (!baseState.grantApplications) {
      baseState.grantApplications = [];
    }
    if (baseState.onboardingComplete === undefined) {
      // Existing users with data = already onboarded
      const hasExistingData = baseState.profile.artistName || baseState.budget.length > 0;
      baseState.onboardingComplete = true; // Always allow free navigation
      baseState.catalogAnalysisComplete = false;
      baseState.chatPlanningComplete = hasExistingData; // If they have data, they've done planning
      baseState.roadmapGenerated = hasExistingData;
      baseState.lastActiveTab = 'roadmap'; // Always start at roadmap - assessment is optional
      baseState.firstVisitDate = new Date().toISOString();
      baseState.catalogAnalysisData = undefined;
    }
    
    // Migrate old lastActiveTab values - if it's 'catalog-analyzer', change to 'roadmap'
    if (baseState.lastActiveTab === 'catalog-analyzer') {
      baseState.lastActiveTab = 'roadmap';
    }
    
    // Migrate chatComplete - ensure it defaults to true (skip chat planning)
    if (baseState.chatPlanningComplete === undefined) {
      baseState.chatPlanningComplete = false;
    }
    
    // Migrate live performance draw
    if (baseState.estimatedDraw === undefined) {
      baseState.estimatedDraw = 100;
    }
    
    // Initialize assessment from legacy profile if not present
    if (!baseState.assessment) {
      baseState.assessment = convertLegacyProfileToAssessment(baseState);
    }
    
    return baseState;
  });

  // Chat state for planning (now context-aware based on catalog analysis)
  const [chatComplete, setChatComplete] = useState(true); // Skip chat planning by default - make it optional
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    // Initialize with planning-focused messages based on catalog data
    return generatePlanningMessages(app.catalogAnalysisData);
  });
  const [chatProgress, setChatProgress] = useState({ 
    personality: 0, 
    sonics: 0, 
    total: 0,
    detailedAnalysis: { personality: {}, sonics: {} }
  });
  
  // Welcome back dashboard visibility (for returning users)
  const [showWelcomeBack, setShowWelcomeBack] = useState(() => {
    // Show welcome back if user has completed onboarding AND has meaningful data
    return app.onboardingComplete && (app.catalogAnalysisComplete || app.roadmapGenerated);
  });
  
  // Navigation state - sync with URL hash
  const [activeTab, setActiveTab] = useState<'roadmap' | 'master-plan' | 'grants' | 'applications' | 'mix-analyzer' | 'catalog-analyzer' | 'portfolio' | 'live'>(() => {
    // Check URL hash first (e.g., #/roadmap, #/grants, etc.)
    const hash = location.pathname.replace('/', '') || location.hash.replace('#/', '');
    const validTabs = ['roadmap', 'master-plan', 'grants', 'applications', 'mix-analyzer', 'catalog-analyzer', 'portfolio', 'live'];
    if (validTabs.includes(hash)) {
      return hash as any;
    }
    // Fall back to last active tab from app state
    return app.lastActiveTab as 'roadmap' | 'master-plan' | 'grants' | 'applications' | 'mix-analyzer' | 'catalog-analyzer' | 'portfolio' | 'live';
  });

  // Artist comparison state
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonArtistIds, setComparisonArtistIds] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Sync activeTab with URL hash
  useEffect(() => {
    const hash = location.pathname.replace('/', '');
    const validTabs = ['roadmap', 'master-plan', 'grants', 'applications', 'mix-analyzer', 'catalog-analyzer', 'portfolio', 'live'];
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash as any);
    }
  }, [location]);
  
  // Update URL and lastActiveTab when tab changes
  useEffect(() => {
    if (app.lastActiveTab !== activeTab) {
      setApp(prev => ({...prev, lastActiveTab: activeTab}));
      navigate(`/${activeTab}`, { replace: true });
    }
  }, [activeTab, navigate]);
  
  const handleChatMessage = (message: string) => {
    // Add user message
    const userMsg: ChatMessage = { id: uid(), type: 'user', content: message };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    
    // Analyze latest user message for personality traits and sonic preferences
    const analysis = analyzeChatMessage(message);
    
    // Update progress tracking with detailed analysis
    const personalityCount = Object.keys(analysis.personality).length;
    const sonicsCount = Object.keys(analysis.sonics).length;
    const totalResponses = updatedMessages.filter(m => m.type === 'user').length;
    
    setChatProgress({
      personality: personalityCount,
      sonics: sonicsCount,
      total: totalResponses,
      detailedAnalysis: analysis
    });
    
    // Find matching artists if we have enough data
    const hasSubstantialData = personalityCount >= 2 || sonicsCount >= 2;
    const hasMinimumData = totalResponses >= 2;

    setTimeout(() => {
      let response: ChatMessage;
      
      const professionalResponses = [
        "Noted. This information helps establish baseline positioning.",
        "Good data point. This clarifies the strategic direction.",
        "Understood. This informs the resource allocation model.",
        "Acknowledged. This helps calibrate timeline expectations.",
        "Recorded. This provides context for budget planning.",
        "Clear. This shapes the go-to-market approach.",
        "Confirmed. This influences the development strategy.",
        "Captured. This affects the launch positioning."
      ];
      
      if (hasSubstantialData) {
        const matches = findMatchingArtists(analysis);
        if (matches.length > 0) {
          const match = matches[0];
          const followups = suggestFollowupQuestions(analysis);
          const nextQuestion = followups.length > 0 ? followups[0] : "What additional factors should we consider in the strategic planning?";
          
          response = {
            id: uid(),
            type: 'system',
            content: `Artist profile shows alignment with ${match.name}'s positioning strategy. ${nextQuestion}`
          };
        } else {
          const followups = suggestFollowupQuestions(analysis);
          const nextQuestion = followups.length > 0 ? followups[0] : "What other strategic factors should inform this roadmap?";
          const randomResponse = professionalResponses[Math.floor(Math.random() * professionalResponses.length)];
          
          response = {
            id: uid(),
            type: 'system',
            content: `${randomResponse} ${nextQuestion}`
          };
        }
      } else if (hasMinimumData) {
        // Request more specific strategic details
        const detailRequests = [
          "Please clarify: What's the production approach? What's the intended emotional impact on the target audience?",
          "Additional context needed: Is this artist positioned as electronic/digital or organic/acoustic? What's the energy profile?",
          "For accurate planning: What's the sonic identity? What's the tempo and intensity range we're working with?"
        ];
        
        response = {
          id: uid(),
          type: 'system',
          content: detailRequests[Math.floor(Math.random() * detailRequests.length)]
        };
      } else {
        // First response - establish professional tone
        const initialResponses = [
          "Initial input received. For strategic planning: What's the core sonic identity? What production style defines this artist?",
          "Processing artist profile. Clarify: What's the primary genre positioning? What's the energy and tempo range?",
          "Beginning assessment. Define: What's the production aesthetic? What's the intended audience emotional response?"
        ];
        
        response = {
          id: uid(),
          type: 'system',
          content: initialResponses[Math.floor(Math.random() * initialResponses.length)]
        };
      }

      setChatMessages(prev => [...prev, response]);
    }, 800 + Math.random() * 400); // Professional response timing
  };

  // Function to complete chat manually or automatically
  const completeChatPhase = () => {
    // Generate assessment from chat analysis
    const finalAnalysis = analyzeChatMessage(
      chatMessages.filter(m => m.type === 'user').map(m => m.content).join(' ')
    );
    
    const updatedAssessment = mapChatAnalysisToAssessment(
      finalAnalysis,
      chatMessages,
      app.profile
    );
    
    // Generate smart roadmap based on catalog + chat
    const roadmapSuggestion = generateSmartRoadmap(app.catalogAnalysisData, chatMessages);
    
    // Update app state with new assessment data + smart roadmap
    setApp(prev => ({
      ...prev,
      assessment: { ...prev.assessment, ...updatedAssessment },
      // Update legacy profile fields for backward compatibility
      profile: {
        ...prev.profile,
        genres: updatedAssessment.identity.primary_genres?.join(', ') || prev.profile.genres,
        elevatorPitch: updatedAssessment.brand_narrative?.positioning || prev.profile.elevatorPitch
      },
      // Apply smart roadmap suggestions
      project: {
        ...prev.project,
        projectType: roadmapSuggestion.projectType,
        units: roadmapSuggestion.units,
        targetWeeks: roadmapSuggestion.targetWeeks
      },
      // Regenerate budget and tasks with new units
      budget: BUDGET_PRESETS(roadmapSuggestion.units),
      tasks: DEFAULT_TASKS(roadmapSuggestion.units),
      // Mark planning as complete and roadmap as generated
      chatPlanningComplete: true,
      roadmapGenerated: true
    }));
    
    setChatComplete(true);
    
    // Show success message with rationale
    pushToast(`✓ Roadmap generated: ${roadmapSuggestion.projectType} (${roadmapSuggestion.units} tracks, ${roadmapSuggestion.targetWeeks} weeks, ~${currency(roadmapSuggestion.estimatedBudget)})`);
    
    // Auto-navigate to roadmap tab
    setActiveTab('roadmap');
  };

  // Auto-save: Update portfolio when app state changes
  useEffect(() => {
    // Legacy single-artist save (keep for backward compatibility)
    localStorage.setItem(LS_KEY, JSON.stringify(app));
    
    // Portfolio multi-artist save
    if (portfolio.activeArtistId) {
      const updatedPortfolio = updateArtist(portfolio, portfolio.activeArtistId, app);
      setPortfolio(updatedPortfolio);
      savePortfolio(updatedPortfolio, userId);
    }
  }, [app, userId]);
  
  // Save portfolio when it changes (but not when triggered by app state change)
  useEffect(() => {
    savePortfolio(portfolio, userId);
  }, [portfolio.artists.length, portfolio.activeArtistId, portfolio.settings, userId]);

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

  // Grant management functions
  const saveGrant = (grant: GrantOpportunity) => {
    setApp(prev => ({
      ...prev,
      savedGrants: prev.savedGrants.includes(grant.id) 
        ? prev.savedGrants.filter(id => id !== grant.id)
        : [...prev.savedGrants, grant.id]
    }));
    pushToast(app.savedGrants.includes(grant.id) ? 'Grant removed from saved' : 'Grant saved successfully');
  };

  const startGrantApplication = (grant: GrantOpportunity) => {
    const newApplication: GrantApplication = {
      id: uid(),
      grant_id: grant.id,
      artist_id: 'current_user', // In a real app, this would be the user's ID
      status: 'not_started',
      project_title: `${app.profile.artistName || 'Untitled'} Project`,
      project_description: app.profile.elevatorPitch || '',
      requested_amount: Math.min(grant.award_amount.typical_amount || grant.award_amount.min, grant.award_amount.max),
      project_timeline: {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
      },
      completed_materials: [],
      remaining_materials: grant.requirements.application_materials,
      last_updated: new Date().toISOString(),
      notes: '',
      reminders: []
    };

    setApp(prev => ({
      ...prev,
      grantApplications: [...prev.grantApplications, newApplication]
    }));
    
    setActiveTab('applications');
    pushToast('Grant application started successfully');
  };

  const updateGrantApplication = (applicationId: string, updates: Partial<GrantApplication>) => {
    setApp(prev => ({
      ...prev,
      grantApplications: prev.grantApplications.map(app => 
        app.id === applicationId ? { ...app, ...updates } : app
      )
    }));
  };

  const deleteGrantApplication = (applicationId: string) => {
    setApp(prev => ({
      ...prev,
      grantApplications: prev.grantApplications.filter(app => app.id !== applicationId)
    }));
    pushToast('Grant application deleted');
  };

  const addApplicationReminder = (applicationId: string, reminder: { date: string; message: string }) => {
    setApp(prev => ({
      ...prev,
      grantApplications: prev.grantApplications.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              reminders: [...app.reminders, { ...reminder, completed: false }],
              last_updated: new Date().toISOString()
            } 
          : app
      )
    }));
    pushToast('Reminder added successfully');
  };

  // Catalog Analysis handler
  const handleCatalogAnalysisComplete = (result: CatalogAnalysisResult) => {
    setApp(prev => ({
      ...prev,
      catalogAnalysisComplete: true,
      catalogAnalysisData: result
    }));
    
    // Update chat messages with personalized planning context
    setChatMessages(generatePlanningMessages(result));
    
    pushToast(`✓ Catalog analyzed: ${result.total_tracks} tracks with ${result.average_score.toFixed(0)}/100 average score`);
  };

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
  const reset = () => { 
    const newState = { 
      profile: DEFAULT_PROFILE, 
      project: DEFAULT_PROJECT, 
      budget: BUDGET_PRESETS(DEFAULT_PROJECT.units), 
      tasks: DEFAULT_TASKS(DEFAULT_PROJECT.units),
      assessment: convertLegacyProfileToAssessment({ profile: DEFAULT_PROFILE, project: DEFAULT_PROJECT }),
      savedGrants: [],
      grantApplications: [],
      onboardingComplete: true, // Allow free navigation - assessment is optional
      catalogAnalysisComplete: false,
      chatPlanningComplete: false,
      roadmapGenerated: false,
      lastActiveTab: 'roadmap' as const, // Start at roadmap, not forced assessment
      firstVisitDate: new Date().toISOString(),
      catalogAnalysisData: undefined,
      estimatedDraw: 100 // Default draw for live performance planning
    };
    setApp(newState); 
    window.history.replaceState({}, "", window.location.pathname); 
  };

  // Multi-Artist Management Functions
  const handleNewArtist = () => {
    // Create new artist with default state
    const newState = { 
      profile: DEFAULT_PROFILE, 
      project: DEFAULT_PROJECT, 
      budget: BUDGET_PRESETS(DEFAULT_PROJECT.units), 
      tasks: DEFAULT_TASKS(DEFAULT_PROJECT.units),
      assessment: convertLegacyProfileToAssessment({ profile: DEFAULT_PROFILE, project: DEFAULT_PROJECT }),
      savedGrants: [],
      grantApplications: [],
      onboardingComplete: true, // Allow free navigation - assessment is optional
      catalogAnalysisComplete: false,
      chatPlanningComplete: false,
      roadmapGenerated: false,
      lastActiveTab: 'roadmap' as const, // Start at roadmap, not forced assessment
      firstVisitDate: new Date().toISOString(),
      catalogAnalysisData: undefined,
      estimatedDraw: 100 // Default draw for live performance planning
    };
    
    // Add to portfolio and switch to it
    const updatedPortfolio = addArtist(portfolio, newState);
    setPortfolio(updatedPortfolio);
    setApp(newState);
    
    // Reset chat and UI state for new artist
    setShowWelcomeBack(false);
    setChatComplete(false);
    setChatMessages(generatePlanningMessages(undefined));
    setChatProgress({ personality: 0, sonics: 0, total: 0, detailedAnalysis: { personality: {}, sonics: {} } });
    setActiveTab('catalog-analyzer');
    
    pushToast('New artist created');
  };

  const handleSwitchArtist = (artistId: string) => {
    const updatedPortfolio = switchActiveArtist(portfolio, artistId);
    setPortfolio(updatedPortfolio);
    
    const artist = updatedPortfolio.artists.find(a => a.id === artistId);
    if (artist) {
      setApp(artist.state);
      
      // Reset UI state for switched artist
      setShowWelcomeBack(artist.state.onboardingComplete && (artist.state.catalogAnalysisComplete || artist.state.roadmapGenerated));
      setChatComplete(artist.state.chatPlanningComplete);
      setChatMessages(generatePlanningMessages(artist.state.catalogAnalysisData));
      setActiveTab((artist.state.lastActiveTab || 'roadmap') as any);
      
      pushToast(`Switched to ${artist.profile.artistName || 'Unnamed Artist'}`);
    }
  };

  const handleDeleteArtist = (artistId: string) => {
    const artistToDelete = portfolio.artists.find(a => a.id === artistId);
    if (!artistToDelete) return;
    
    const confirmDelete = window.confirm(
      `Delete ${artistToDelete.profile.artistName || 'Unnamed Artist'}?\n\n` +
      `This will permanently remove all data for this artist. This action cannot be undone.`
    );
    
    if (confirmDelete) {
      const updatedPortfolio = deleteArtist(portfolio, artistId);
      setPortfolio(updatedPortfolio);
      
      // If we deleted the active artist, load the new active one
      if (artistId === portfolio.activeArtistId) {
        const newActive = getActiveArtist(updatedPortfolio);
        if (newActive) {
          setApp(newActive.state);
          setShowWelcomeBack(newActive.state.onboardingComplete && (newActive.state.catalogAnalysisComplete || newActive.state.roadmapGenerated));
          setChatComplete(newActive.state.chatPlanningComplete);
          setChatMessages(generatePlanningMessages(newActive.state.catalogAnalysisData));
          setActiveTab((newActive.state.lastActiveTab || 'roadmap') as any);
        } else {
          // No artists left, create a new one
          handleNewArtist();
        }
      }
      
      pushToast(`Deleted ${artistToDelete.profile.artistName || 'Unnamed Artist'}`);
    }
  };

  const getArtistCount = () => portfolio.artists.length;
  const getCurrentArtistName = () => {
    if (activeArtistRecord) {
      return activeArtistRecord.profile.artistName || 'Unnamed Artist';
    }
    return app.profile.artistName || 'Unnamed Artist';
  };

  const handleCompareArtists = (artistIds: string[]) => {
    setComparisonArtistIds(artistIds);
    setShowComparison(true);
  };

  const handleRemoveFromComparison = (artistId: string) => {
    const updatedIds = comparisonArtistIds.filter(id => id !== artistId);
    setComparisonArtistIds(updatedIds);
    if (updatedIds.length < 2) {
      setShowComparison(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Global studio background (color-only) */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-studio"></div>
      {/* Show onboarding welcome for first-time users */}
      {!app.onboardingComplete ? (
        <OnboardingWelcome
          onStart={() => {
            setApp(prev => ({...prev, onboardingComplete: true, lastActiveTab: 'catalog-analyzer'}));
            setActiveTab('catalog-analyzer');
            setShowWelcomeBack(false);
          }}
          onSkip={() => {
            setApp(prev => ({...prev, onboardingComplete: true}));
            setShowWelcomeBack(false);
          }}
          hasExistingData={app.profile.artistName !== "" || app.budget.length > 0}
        />
      ) : showWelcomeBack ? (
        /* Show welcome back dashboard for returning users */
        <WelcomeBackDashboard
          catalogAnalysisData={app.catalogAnalysisData}
          roadmapGenerated={app.roadmapGenerated}
          projectType={app.project.projectType}
          projectUnits={app.project.units}
          savedGrantsCount={app.savedGrants.length}
          applicationsCount={app.grantApplications.length}
          onContinue={() => {
            setShowWelcomeBack(false);
            // activeTab already set to last active from state
          }}
          onReAnalyze={() => {
            setShowWelcomeBack(false);
            setActiveTab('catalog-analyzer');
          }}
          onViewRoadmap={() => {
            setShowWelcomeBack(false);
            setActiveTab('roadmap');
          }}
          onViewGrants={() => {
            setShowWelcomeBack(false);
            setActiveTab('grants');
          }}
        />
      ) : (
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Studio banner header */}
        <header className="mb-6 relative rounded-2xl border border-surface-700 p-5 banner-studio z-50">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-surface-900/60 via-surface-900/40 to-transparent rounded-2xl overflow-hidden"></div>
          <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-surface-50">Artist Roadmap <span className="text-surface-300">PRO</span></h1>
                <p className="text-sm text-surface-300">Professional A&R tool for baseline assessment, strategic planning, and career development.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
            {/* TEMPORARILY DISABLED - Organization Switcher (Clerk auth not active)
            <OrganizationSwitcher
              appearance={{
                elements: {
                  rootBox: 'flex items-center',
                  organizationSwitcherTrigger: 'bg-surface-800 border border-surface-600 text-surface-100 hover:bg-surface-700 rounded-lg px-3 py-2 text-sm transition-colors',
                  organizationSwitcherTriggerIcon: 'text-primary-400',
                  organizationPreview: 'text-surface-100',
                  organizationPreviewTextContainer: 'text-surface-100',
                  organizationPreviewAvatarBox: 'border-primary-600',
                  organizationSwitcherPopoverCard: 'bg-surface-900 border border-surface-700',
                  organizationSwitcherPopoverActionButton: 'text-surface-200 hover:bg-surface-800',
                  organizationSwitcherPopoverActionButtonText: 'text-surface-200',
                },
              }}
              createOrganizationMode="navigation"
              createOrganizationUrl="/create-organization"
              organizationProfileMode="navigation"
              organizationProfileUrl="/organization-profile"
              afterCreateOrganizationUrl="/"
              afterSelectOrganizationUrl="/"
              afterSelectPersonalUrl="/"
              hidePersonal={false}
            />
            */}
            
            {/* Artist Switcher - Multi-Artist Management */}
            <ArtistSwitcher
              portfolio={portfolio}
              onSwitchArtist={handleSwitchArtist}
              onNewArtist={handleNewArtist}
              onDeleteArtist={handleDeleteArtist}
              currentArtistName={getCurrentArtistName()}
            />
            
            {/* TEMPORARILY DISABLED - User Profile & Logout (Clerk auth not active)
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                    userButtonPopoverCard: 'bg-surface-900 border border-surface-700',
                    userButtonPopoverActionButton: 'text-surface-200 hover:bg-surface-800',
                    userButtonPopoverActionButtonText: 'text-surface-200',
                    userButtonPopoverFooter: 'hidden',
                  },
                }}
              />
              <LogoutButton />
            </div>
            */}

            {/* Render Sign out only when authenticated (userId present) */}
            {userId && (
              <button
                className="rounded-lg border border-red-600 px-3 py-2 text-sm text-red-100 hover:bg-red-800/50 transition-colors"
                onClick={() => navigate('/sign-out')}
                title="Log out of this account"
              >
                Sign out
              </button>
            )}

            <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50 transition-colors" onClick={shareUrl}>Share</button>
            <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50 transition-colors" onClick={exportCSV}>Export CSV</button>
            <button className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50 transition-colors" onClick={exportJSON}>Export Data</button>
            <label className="rounded-lg border border-primary-600 px-3 py-2 text-sm text-primary-100 hover:bg-primary-800/50 transition-colors cursor-pointer">
              Import Data
              <input type="file" accept="application/json" className="hidden" onChange={e => e.target.files && importJSON(e.target.files[0])}/>
            </label>
            <button
              className="rounded-lg border border-red-600 px-3 py-2 text-sm text-red-100 hover:bg-red-800/50 transition-colors"
              onClick={() => { 
                if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                  localStorage.removeItem('artist-roadmap-vite-v1'); 
                  reset(); // Use reset function to set proper defaults
                }
              }}
            >
              Clear All Data
            </button>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {!chatComplete ? (
            // Initial Chat Interface - Professional Strategic Planning
            <section className="relative overflow-hidden rounded-2xl border border-surface-700 banner-studio p-6 h-[85vh] flex flex-col">
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-surface-900/40 via-transparent to-surface-900/40"></div>
              <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="mb-4 pb-4 border-b border-surface-700/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-xl font-semibold text-surface-50">Strategic Planning</h2>
                    <p className="text-xs md:text-sm text-surface-200 mt-1">
                      {app.catalogAnalysisComplete 
                        ? 'Based on your catalog analysis, let\'s create a data-driven release plan' 
                        : 'Share your goals and constraints to build a customized project roadmap'}
                    </p>
                  </div>
                  
                  {/* Progress Indicator - Responsive */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-surface-700 border border-surface-600 flex items-center justify-center font-semibold text-surface-200 text-sm">
                      {chatProgress.total}/3
                    </div>
                    <button
                      onClick={completeChatPhase}
                      className="hidden md:flex text-sm text-surface-300 hover:text-surface-200 px-3 py-2 rounded-lg hover:bg-surface-700/50 transition-colors items-center gap-1"
                      title="Skip to roadmap generation"
                    >
                      Skip
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Mobile skip button - Always visible */}
                <button
                  onClick={completeChatPhase}
                  className="md:hidden mt-3 w-full text-center text-sm text-surface-300 hover:text-surface-200 py-2.5 rounded-lg hover:bg-surface-700/50 transition-colors border border-surface-700/50"
                  title="Skip to roadmap generation"
                >
                  Skip to roadmap →
                </button>
              </div>

              {/* Main Chat Interface */}
              <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                {/* Chat area - Full width on mobile, flexible on desktop */}
                <div className="flex-1 flex flex-col min-w-0">
                  <Chat
                    messages={chatMessages}
                    onSendMessage={handleChatMessage}
                    className="flex-1"
                  />
                </div>

                {/* Suggestions Sidebar - Hidden on mobile, compact on desktop */}
                <div className="hidden md:flex md:w-72 lg:w-80 bg-surface-800/50 rounded-xl border border-surface-700/50 p-4 flex-col flex-shrink-0 max-h-full overflow-y-auto">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-surface-200 mb-1">Quick Topics</h3>
                    <p className="text-xs text-surface-300">Click to add</p>
                  </div>
                  
                  {/* Simplified suggestion list - Top 8 most useful */}
                  <div className="space-y-2 flex-1">
                    {PLANNING_SUGGESTIONS.slice(0, 8).map((suggestion, i) => (
                      <button
                        key={i}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg bg-surface-700/30 hover:bg-primary-600/20 border border-surface-600/30 hover:border-primary-500/30 transition-all text-surface-300 hover:text-surface-100"
                        onClick={() => handleChatMessage(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  {/* Compact Progress Summary */}
                  <div className="mt-4 pt-3 border-t border-surface-700/50">
                    <div className="text-xs text-surface-300 mb-2">
                      Progress: <span className="text-primary-400 font-semibold">{chatProgress.total} / 3</span>
                    </div>
                    <div className="w-full bg-surface-700 rounded-full h-1.5">
                      <div 
                        className="bg-primary-500 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (chatProgress.total / 3) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Continue Section */}
              {chatProgress.total >= 3 && (
                <div className="mt-6 bg-primary-600/10 border border-primary-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-primary-200">Planning Complete</div>
                      <div className="text-xs text-surface-200 mt-0.5">Ready to generate your strategic roadmap</div>
                    </div>
                    <button
                      onClick={completeChatPhase}
                      className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      Generate Roadmap
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Encourage continuation for partial progress */}
              {chatProgress.total >= 1 && chatProgress.total < 3 && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-yellow-300">
                      {3 - chatProgress.total} more response{3 - chatProgress.total !== 1 ? 's' : ''} recommended for better recommendations.
                    </div>
                    <button
                      onClick={completeChatPhase}
                      className="px-3 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-200 rounded-lg text-sm transition-colors"
                    >
                      Continue Anyway →
                    </button>
                  </div>
                </div>
              )}
              </div>
            </section>
          ) : (
            // Main App Content
            <>
            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 p-1 bg-surface-800/50 rounded-xl border border-surface-700">
                {/* Step 1: Catalog Analyzer */}
                <button
                  onClick={() => setActiveTab('catalog-analyzer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    activeTab === 'catalog-analyzer'
                      ? 'bg-primary-600 text-primary-50'
                      : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {app.catalogAnalysisComplete ? '✓' : '1.'} 📊 Catalog Analysis
                  </span>
                  {app.catalogAnalysisComplete && !activeTab.includes('catalog') && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>

                {/* Step 2: AI Planning Chat */}
                <button
                  onClick={() => {
                    if (!chatComplete && !app.chatPlanningComplete) {
                      setChatComplete(false); // Show chat interface
                    }
                    setActiveTab('roadmap'); // We'll handle this better later
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    !chatComplete && !app.chatPlanningComplete
                      ? 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                      : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {app.chatPlanningComplete ? '✓' : '2.'} 💬 AI Planning
                  </span>
                  {app.chatPlanningComplete && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>

                {/* Step 3: Project Roadmap */}
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    activeTab === 'roadmap'
                      ? 'bg-primary-600 text-primary-50'
                      : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {app.roadmapGenerated ? '✓' : '3.'} 📋 Roadmap
                  </span>
                  {app.roadmapGenerated && activeTab !== 'roadmap' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>

                {/* Master Plan - Complete project overview with ROI */}
                {app.roadmapGenerated && (
                  <button
                    onClick={() => setActiveTab('master-plan')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'master-plan'
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                        : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                    }`}
                  >
                    💎 Master Plan
                  </button>
                )}

                {/* Step 4: Mix Analyzer - Refine individual tracks */}
                <button
                  onClick={() => setActiveTab('mix-analyzer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'mix-analyzer'
                      ? 'bg-primary-600 text-primary-50'
                      : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                  }`}
                >
                  🎚️ Mix Analyzer
                </button>

                {/* Step 5: Grant Discovery */}
                <button
                  onClick={() => setActiveTab('grants')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'grants'
                      ? 'bg-primary-600 text-primary-50'
                      : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                  }`}
                >
                  🎯 Grants
                  {app.savedGrants.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-primary-500/30 text-primary-200 rounded text-xs">
                      {app.savedGrants.length}
                    </span>
                  )}
                </button>

                {/* Step 6: Applications */}
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'applications'
                      ? 'bg-primary-600 text-primary-50'
                      : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                  }`}
                >
                  📝 Applications
                  {app.grantApplications.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-accent-500/30 text-accent-200 rounded text-xs">
                      {app.grantApplications.length}
                    </span>
                  )}
                </button>

                {/* Portfolio View - Multi-artist management */}
                {portfolio.artists.length > 1 && (
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'portfolio'
                        ? 'bg-primary-600 text-primary-50'
                        : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                    }`}
                  >
                    👥 Portfolio
                    <span className="ml-1 px-1.5 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs">
                      {portfolio.artists.length}
                    </span>
                  </button>
                )}

                {/* Live Performance Planning */}
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'live'
                      ? 'bg-primary-600 text-primary-50'
                      : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
                  }`}
                >
                  🎸 Live
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'mix-analyzer' && (
              <div>
                <div className="mb-6 rounded-2xl border border-primary-700 bg-primary-900/20 p-6 backdrop-blur">
                  <h2 className="text-xl font-semibold text-primary-100 mb-2">🎚️ Mix Analyzer</h2>
                  <p className="text-surface-300 text-sm">
                    Upload your mix and get professional diagnostic feedback based on industry benchmarks for your genre. 
                    Identify technical issues, compare against reference tracks, and get actionable recommendations to improve your sound.
                  </p>
                </div>
                <MixAnalyzer />
              </div>
            )}

            {activeTab === 'catalog-analyzer' && (
              <div id="catalog-analysis">
                <div className="mb-6 rounded-2xl border border-primary-700 bg-primary-900/20 p-6 backdrop-blur">
                  <h2 className="text-xl font-semibold text-primary-100 mb-2">📊 Catalog Analyzer</h2>
                  <p className="text-surface-300 text-sm">
                    Upload multiple released tracks to analyze your artistic growth and consistency over time. 
                    Get insights on quality progression, sonic identity, genre consistency, and recommendations for your next release.
                  </p>
                  {app.catalogAnalysisComplete && app.catalogAnalysisData && (
                    <div className="mt-4 p-3 rounded-lg bg-green-600/10 border border-green-600/30">
                      <div className="text-sm text-green-300">
                        ✓ Last analysis: {app.catalogAnalysisData.total_tracks} tracks • {app.catalogAnalysisData.average_score.toFixed(0)}/100 avg score • {app.catalogAnalysisData.sonic_identity.consistency_score.toFixed(0)}% consistency
                      </div>
                    </div>
                  )}
                </div>
                <CatalogAnalyzer onAnalysisComplete={handleCatalogAnalysisComplete} />
              </div>
            )}

            {activeTab === 'grants' && (
              <GrantDiscovery
                profile={app.profile}
                assessment={app.assessment}
                savedGrants={app.savedGrants}
                applications={app.grantApplications}
                onSaveGrant={saveGrant}
                onStartApplication={startGrantApplication}
              />
            )}

            {activeTab === 'applications' && (
              <GrantApplicationTracker
                applications={app.grantApplications}
                grants={GRANT_OPPORTUNITIES}
                onUpdateApplication={updateGrantApplication}
                onDeleteApplication={deleteGrantApplication}
                onAddReminder={addApplicationReminder}
              />
            )}

            {activeTab === 'portfolio' && !showComparison && !showAnalytics && (
              <PortfolioDashboard
                portfolio={portfolio}
                onSelectArtist={handleSwitchArtist}
                onNewArtist={handleNewArtist}
                onDeleteArtist={handleDeleteArtist}
                onClose={() => setActiveTab('roadmap')}
                onCompareArtists={handleCompareArtists}
                onShowAnalytics={() => setShowAnalytics(true)}
              />
            )}

            {activeTab === 'portfolio' && showComparison && (
              <ArtistComparisonView
                artists={comparisonArtistIds.map(id => portfolio.artists.find(a => a.id === id)!).filter(Boolean)}
                onClose={() => setShowComparison(false)}
                onRemoveArtist={handleRemoveFromComparison}
              />
            )}

            {activeTab === 'portfolio' && showAnalytics && (
              <PortfolioAnalytics
                portfolio={portfolio}
                onClose={() => setShowAnalytics(false)}
              />
            )}

            {activeTab === 'master-plan' && (
              <MasterPlan
                profile={app.profile}
                projectConfig={app.project}
                budgetItems={app.budget}
                artistStage={app.profile.stage}
                estimatedDraw={app.estimatedDraw}
                genres={app.profile.genres.split(',').map(g => g.trim()).filter(Boolean)}
                onNavigate={(tab) => setActiveTab(tab as any)}
              />
            )}

            {activeTab === 'live' && (
              <TourPlanner
                artistStage={app.profile.stage}
                genres={app.profile.genres.split(',').map(g => g.trim()).filter(Boolean)}
                estimatedDraw={app.estimatedDraw}
                onEstimatedDrawChange={(draw) => setApp(prev => ({ ...prev, estimatedDraw: draw }))}
              />
            )}

            {activeTab === 'roadmap' && (
              <>
            {/* Smart Roadmap Banner */}
            {app.roadmapGenerated && app.catalogAnalysisData && (
              <section className="mb-6 rounded-2xl border border-accent-700 bg-accent-900/20 p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-600/20 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-accent-100 mb-2">Smart Roadmap Generated</h2>
                    <p className="text-surface-300 text-sm leading-relaxed">
                      {(() => {
                        const suggestion = generateSmartRoadmap(app.catalogAnalysisData, chatMessages);
                        return suggestion.rationale;
                      })()}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <div className="px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700">
                        <span className="text-surface-300">Project: </span>
                        <span className="text-surface-100 font-medium">{app.project.projectType}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700">
                        <span className="text-surface-300">Tracks: </span>
                        <span className="text-surface-100 font-medium">{app.project.units}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700">
                        <span className="text-surface-300">Timeline: </span>
                        <span className="text-surface-100 font-medium">{app.project.targetWeeks} weeks</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700">
                        <span className="text-surface-300">Est. Budget: </span>
                        <span className="text-surface-100 font-medium">{currency(totals.grand)}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-surface-200">
                      💡 These are smart defaults based on your data. Feel free to customize below!
                    </p>
                  </div>
                </div>
              </section>
            )}
            
            {/* Assessment Insights */}
            {app.assessment && (
              <section className="rounded-2xl border border-primary-700 bg-primary-900/20 p-6 backdrop-blur">
                <h2 className="mb-4 text-lg font-semibold text-primary-100">Assessment Insights</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Genre Analysis */}
                  <div className="bg-surface-800/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-surface-200 mb-2">Genre Profile</h3>
                    <div className="space-y-2">
                      {app.assessment.identity.primary_genres?.map(genre => (
                        <span key={genre} className="inline-block bg-primary-500/20 text-primary-300 px-2 py-1 rounded text-xs mr-1">
                          {genre}
                        </span>
                      ))}
                    </div>
                    {app.assessment.identity.subgenres_tags && app.assessment.identity.subgenres_tags.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-surface-300 mb-1">Subgenres:</div>
                        {app.assessment.identity.subgenres_tags.map(tag => (
                          <span key={tag} className="inline-block bg-surface-700 text-surface-300 px-2 py-1 rounded text-xs mr-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Audio Profile */}
                  <div className="bg-surface-800/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-surface-200 mb-2">Audio Profile</h3>
                    <div className="space-y-2 text-xs">
                      {app.assessment.audio_profile && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-surface-300">Tempo:</span>
                            <span className="text-surface-200">{Math.round(app.assessment.audio_profile.tempo_bpm)} BPM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-300">Danceability:</span>
                            <span className="text-surface-200">{Math.round(app.assessment.audio_profile.danceability * 100)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-300">Energy:</span>
                            <span className="text-surface-200">{Math.round(app.assessment.audio_profile.energy * 100)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-300">Valence:</span>
                            <span className="text-surface-200">{Math.round(app.assessment.audio_profile.valence * 100)}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Success Probability */}
                  <div className="bg-surface-800/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-surface-200 mb-2">Success Indicators</h3>
                    {(() => {
                      const benchmark = getBenchmarkForGenres(app.assessment.identity.primary_genres || []);
                      const probability = calculateSuccessProbability(app.assessment, benchmark);
                      const recommendations = generateRecommendations(app.assessment, benchmark);
                      
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-surface-300">Market Fit:</div>
                            <div className={`text-xs font-medium ${
                              probability > 0.7 ? 'text-green-400' : 
                              probability > 0.5 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {Math.round(probability * 100)}%
                            </div>
                          </div>
                          
                          {recommendations.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-surface-300 mb-1">Top Recommendation:</div>
                              <div className="text-xs text-surface-200 bg-surface-700/50 p-2 rounded">
                                {recommendations[0]}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Brand Themes */}
                {app.assessment.brand_narrative?.themes && (
                  <div className="mt-4 bg-surface-800/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-surface-200 mb-2">Brand Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {app.assessment.brand_narrative.themes.map(theme => (
                        <span key={theme} className="bg-accent-500/20 text-accent-300 px-3 py-1 rounded-full text-sm">
                          {theme}
                        </span>
                      ))}
                    </div>
                    {app.assessment.brand_narrative.positioning && (
                      <div className="mt-3">
                        <div className="text-xs text-surface-300 mb-1">Positioning:</div>
                        <div className="text-sm text-surface-200 italic">"{app.assessment.brand_narrative.positioning}"</div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Profile & Assessment */}
          <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold text-primary-100">Profile</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-surface-300">Artist / Project Name</label>
                <input className="w-full rounded-lg bg-surface-700/50 px-3 py-2 text-surface-100 placeholder-surface-500 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors" value={app.profile.artistName} onChange={e => setApp({...app, profile:{...app.profile, artistName: e.target.value}})} placeholder="e.g., Super Star" />
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
                <div>
                  <h3 className="text-base font-semibold">Maturity self‑assessment</h3>
                  <p className="text-xs text-surface-200 mt-0.5">Optional — used to calibrate timelines and budgets</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-surface-700/60 px-2 py-1 text-xs text-surface-200 border border-surface-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                    Stage: {app.profile.stage}
                  </span>
                  <button
                    className="text-xs rounded px-2 py-1 border border-primary-600 text-primary-100 hover:bg-primary-700/30 transition-colors"
                    onClick={() => { setShowWizard(true); }}
                  >
                    Refine assessment
                  </button>
                </div>
              </div>
              {/* Compact summary chips for quick glance on mobile */}
              <div className="flex flex-wrap gap-2">
                {(['craft','catalog','brand','team','audience','ops'] as const).map((k) => (
                  <span key={k} className="text-xs rounded-md border border-surface-700 bg-surface-800/60 px-2 py-1 text-surface-300">
                    {k}: {app.profile.stageScores[k]}/5
                  </span>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-6 pt-4 border-t border-surface-700/50">
              <button
                onClick={() => {
                  setActiveTab('catalog-analyzer');
                  setTimeout(() => {
                    const catalogSection = document.getElementById('catalog-analysis');
                    if (catalogSection) {
                      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className="w-full md:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Continue to Catalog Analysis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
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
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
