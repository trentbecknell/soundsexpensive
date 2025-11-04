import { ArtistProfile, ProjectConfig, BudgetItem } from '../App';
import { TalentProfile, TalentRole, TalentFilter } from '../types/talent';

export interface TalentNeed {
  role: TalentRole;
  count: number;
  when: 'Discovery' | 'Pre‑Production' | 'Production' | 'Post‑Production' | 'Release' | 'Growth';
  rationale: string;
}

// Map phases + budget categories to likely roles needed
export function inferTalentNeeds(
  profile: ArtistProfile,
  project: ProjectConfig,
  budget: BudgetItem[]
): TalentNeed[] {
  const needs: TalentNeed[] = [];

  const add = (role: TalentRole, when: TalentNeed['when'], rationale: string, count = 1) => {
    const existing = needs.find(n => n.role === role && n.when === when);
    if (existing) existing.count += count; else needs.push({ role, when, count, rationale });
  };

  // Discovery / Pre-production
  add('Songwriter', 'Discovery', 'Co-writing to refine material and hooks', Math.max(1, Math.ceil(project.units / 3)));
  add('Producer', 'Pre‑Production', 'Pre-pro, arrangement, and sonic direction');

  // Production
  add('Recording Engineer', 'Production', 'Tracking sessions setup and capture');
  add('Session Musician', 'Production', 'Additional parts and layers', Math.max(1, Math.ceil(project.units / 2)));
  if ((profile.genres || '').toLowerCase().includes('rock')) {
    add('Drummer', 'Production', 'Live drum tracking to elevate groove');
    add('Guitarist', 'Production', 'Guitar textures and riffs');
  }
  if ((profile.genres || '').toLowerCase().includes('pop') || (profile.genres || '').toLowerCase().includes('r&b')) {
    add('Vocal Producer', 'Production', 'Comping, tuning, doubles/adlibs');
  }

  // Post-production
  add('Mixer', 'Post‑Production', 'Professional mix translation');
  add('Mastering Engineer', 'Post‑Production', 'Streaming-safe loudness and polish');

  // Growth (live)
  add('Live Musician', 'Growth', 'Assemble a live band for release shows', profile.city ? 2 : 1);
  if (project.targetMarkets.includes('Live')) {
    add('Live MD', 'Growth', 'Show design, stems, playback rigs');
  }

  // Adjust count based on units
  needs.forEach(n => {
    if (n.role === 'Mixer' || n.role === 'Mastering Engineer') {
      n.count = project.units; // per song work
    }
  });

  return needs;
}

export function filterTalent(
  directory: TalentProfile[],
  filter: TalentFilter
): TalentProfile[] {
  return directory.filter(p => {
    if (filter.role && !p.roles.includes(filter.role)) return false;
    if (filter.genre && !p.genres.some(g => g.toLowerCase() === filter.genre!.toLowerCase())) return false;
    if (filter.remoteOnly && !p.remote) return false;
    if (filter.locationContains && !(p.location || '').toLowerCase().includes(filter.locationContains.toLowerCase())) return false;
    if (filter.maxRate) {
      const candidateRate = p.perSongRate || p.dayRate || p.hourlyRate || 0;
      if (candidateRate > filter.maxRate) return false;
    }
    return true;
  });
}

export function recommendTalent(
  directory: TalentProfile[],
  needs: TalentNeed[],
  profile: ArtistProfile,
  project: ProjectConfig,
  maxPerSong?: number
): Record<TalentRole, TalentProfile[]> {
  const byRole: Record<TalentRole, TalentProfile[]> = {} as any;
  for (const need of needs) {
    const allForRole = directory.filter(p => p.roles.includes(need.role));
    let candidates = allForRole
      .filter(p => !maxPerSong || (p.perSongRate || p.dayRate || p.hourlyRate || 0) <= maxPerSong)
      .sort((a,b) => (b.rating || 0) - (a.rating || 0));

    // Fallback: if rate filter yields nothing, ignore rate
    if (candidates.length === 0) {
      candidates = allForRole.sort((a,b) => (b.rating || 0) - (a.rating || 0));
    }

    // Prefer genre match
    const genreSet = new Set((profile.genres || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean));
    const scored = candidates.map(c => {
      const gMatch = c.genres.some(g => genreSet.has(g.toLowerCase())) ? 1 : 0;
      const rate = c.perSongRate || c.dayRate || c.hourlyRate || 0;
      const affordability = maxPerSong ? (maxPerSong - rate) / Math.max(1, maxPerSong) : 0.5;
      const score = (gMatch * 0.5) + ((c.rating || 0)/5 * 0.3) + (affordability * 0.2);
      return { c, score };
    });
    scored.sort((a,b)=> b.score - a.score);
    const top = scored.slice(0, 5).map(s => s.c);
    if (top.length) {
      byRole[need.role] = top;
    }
  }
  return byRole;
}
