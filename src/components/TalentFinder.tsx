import React, { useMemo, useState } from 'react';
import { ArtistProfile, ProjectConfig, BudgetItem } from '../App';
import { TalentProfile, TalentRole, TalentFilter } from '../types/talent';
import { TALENT_DIRECTORY } from '../data/talent';
import { inferTalentNeeds, recommendTalent, filterTalent } from '../lib/talentRecommender';
import { generateOutreachBrief } from '../lib/talentOutreach';
import TesterContactPanel from './TesterContact';
import { getTesterContact, hasAnyContact } from '../lib/testerContact';
import type { TalentSourceResult, TalentSearchParams } from '../types/integrations';
import discogs from '../lib/integrations/discogs';
import musicbrainz from '../lib/integrations/musicbrainz';
import bandsintown from '../lib/integrations/bandsintown';

export default function TalentFinder({
  profile,
  project,
  budget
}: {
  profile: ArtistProfile;
  project: ProjectConfig;
  budget: BudgetItem[];
}) {
  const [filter, setFilter] = useState<TalentFilter>({});
  const [shortlist, setShortlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('ar-talent-shortlist') || '[]'); } catch { return []; }
  });
  const [includeContact, setIncludeContact] = useState<boolean>(() => hasAnyContact(getTesterContact()));
  const [contact, setContact] = useState(() => getTesterContact());
  const [extEnabled, setExtEnabled] = useState({ discogs: true, musicbrainz: true, bandsintown: true });
  const [extQuery, setExtQuery] = useState<TalentSearchParams>({});
  const [extLoading, setExtLoading] = useState(false);
  const [extResults, setExtResults] = useState<TalentSourceResult[]>([]);

  const needs = useMemo(() => inferTalentNeeds(profile, project, budget), [profile, project, budget]);
  const maxPerSong = useMemo(() => {
    // Estimate per-song budget target: mixing+mastering line items / units
    const post = budget.filter(b => b.phase === 'Post‑Production');
    const perSong = project.units ? Math.round(post.reduce((s,i)=> s + i.unitCost * i.qty, 0) / project.units) : undefined;
    return perSong && isFinite(perSong) ? perSong : undefined;
  }, [budget, project.units]);

  const recommendedByRole = useMemo(() => recommendTalent(TALENT_DIRECTORY, needs, profile, project, maxPerSong), [needs, profile, project, maxPerSong]);

  const filteredAll = useMemo(() => filterTalent(TALENT_DIRECTORY, filter), [filter]);

  const toggleShortlist = (id: string) => {
    setShortlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('ar-talent-shortlist', JSON.stringify(next));
      return next;
    });
  };

  const copyBrief = (role: TalentRole, candidate?: TalentProfile) => {
    const { subject, message } = generateOutreachBrief(profile, project, role, candidate, includeContact ? contact : undefined);
    navigator.clipboard.writeText(`${subject}\n\n${message}`);
    alert('Brief copied to clipboard');
  };

  const RoleSection: React.FC<{ role: TalentRole; candidates: TalentProfile[] }> = ({ role, candidates }) => (
    <div className="rounded-2xl border border-surface-700 bg-surface-800/70 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-surface-100">{role}</h3>
        <button
          className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30"
          onClick={() => copyBrief(role)}
        >
          Copy role brief
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {candidates.map(c => (
          <div key={c.id} className="rounded-xl bg-surface-900/60 border border-surface-700 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-surface-100">{c.name}</div>
                <div className="text-xs text-surface-300">{c.genres.join(', ')}{c.location ? ` • ${c.location}` : ''}{c.remote ? ' • Remote' : ''}</div>
              </div>
              <button
                className={`text-xs rounded px-2 py-1 border ${shortlist.includes(c.id) ? 'border-green-600 text-green-300' : 'border-surface-600 text-surface-300'} hover:bg-surface-700`}
                onClick={() => toggleShortlist(c.id)}
              >
                {shortlist.includes(c.id) ? 'Shortlisted' : 'Shortlist'}
              </button>
            </div>
            <div className="mt-2 text-sm text-surface-200">{c.blurb}</div>
            <div className="mt-2 text-xs text-surface-300 flex flex-wrap gap-2">
              {c.perSongRate && <span className="rounded bg-surface-800 px-2 py-1">${'{'}c.perSongRate{'}'}/song</span>}
              {c.dayRate && <span className="rounded bg-surface-800 px-2 py-1">${'{'}c.dayRate{'}'}/day</span>}
              {c.hourlyRate && <span className="rounded bg-surface-800 px-2 py-1">${'{'}c.hourlyRate{'}'}/hr</span>}
              {c.rating && <span className="rounded bg-surface-800 px-2 py-1">⭐ {c.rating}</span>}
              {c.responseTimeHours && <span className="rounded bg-surface-800 px-2 py-1">↩︎ {c.responseTimeHours}h</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.portfolio.map((p, i) => (
                <a key={i} href={p.url} target="_blank" rel="noreferrer" className="text-xs rounded border border-surface-600 px-2 py-1 text-surface-200 hover:bg-surface-700">
                  {p.platform}
                </a>
              ))}
              <button
                className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30"
                onClick={() => copyBrief(role, c)}
              >
                Copy outreach
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const runExternalSearch = async () => {
    setExtLoading(true);
    try {
      const tasks = [] as Promise<TalentSourceResult>[];
      if (extEnabled.discogs) tasks.push(discogs.search(extQuery));
      if (extEnabled.musicbrainz) tasks.push(musicbrainz.search(extQuery));
      if (extEnabled.bandsintown) tasks.push(bandsintown.search(extQuery));
      const results = await Promise.all(tasks);
      setExtResults(results);
    } finally {
      setExtLoading(false);
    }
  };

  return (
    <div>
      {/* Your contact info */}
      <div className="mb-6">
        <TesterContactPanel onChange={c => setContact(c)} />
        <div className="mt-2 flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-surface-300">
            <input type="checkbox" checked={includeContact} onChange={e => setIncludeContact(e.target.checked)} />
            Include my contact details in copied briefs
          </label>
        </div>
      </div>
      <div className="mb-6 rounded-2xl border border-primary-700 bg-primary-900/20 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-primary-100 mb-2">🤝 Talent Finder</h2>
        <p className="text-surface-300 text-sm">
          Recommended producers, mixers, musicians, and live collaborators based on your roadmap and genres. Copy a ready-to-send brief and contact via portfolio links.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-surface-700 bg-surface-800/70 p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <div>
            <label className="text-xs text-surface-300">Role</label>
            <select className="w-full rounded bg-surface-900 px-2 py-2 text-sm" value={filter.role || ''} onChange={e => setFilter(prev => ({ ...prev, role: (e.target.value || undefined) as TalentRole }))}>
              <option value="">Any</option>
              {Array.from(new Set(TALENT_DIRECTORY.flatMap(t => t.roles))).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-surface-300">Genre</label>
            <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="e.g., Pop" value={filter.genre || ''} onChange={e => setFilter(prev => ({ ...prev, genre: e.target.value || undefined }))} />
          </div>
          <div>
            <label className="text-xs text-surface-300">Max rate (USD)</label>
            <input type="number" className="w-full rounded bg-surface-900 px-2 py-2 text-sm" value={filter.maxRate || ''} onChange={e => setFilter(prev => ({ ...prev, maxRate: e.target.value ? parseInt(e.target.value) : undefined }))} />
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-xs text-surface-300"><input type="checkbox" checked={!!filter.remoteOnly} onChange={e => setFilter(prev => ({ ...prev, remoteOnly: e.target.checked || undefined }))} /> Remote only</label>
          </div>
          <div>
            <label className="text-xs text-surface-300">Location contains</label>
            <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="City/State" value={filter.locationContains || ''} onChange={e => setFilter(prev => ({ ...prev, locationContains: e.target.value || undefined }))} />
          </div>
        </div>
      </div>

      {/* External Sources (beta) */}
      <div className="mb-6 rounded-2xl border border-primary-700 bg-primary-900/10 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-primary-100">External Sources (beta)</h3>
          <div className="flex gap-3 text-xs text-surface-300">
            <label className="flex items-center gap-1"><input type="checkbox" checked={extEnabled.discogs} onChange={e => setExtEnabled(s => ({ ...s, discogs: e.target.checked }))} /> Discogs</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={extEnabled.musicbrainz} onChange={e => setExtEnabled(s => ({ ...s, musicbrainz: e.target.checked }))} /> MusicBrainz</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={extEnabled.bandsintown} onChange={e => setExtEnabled(s => ({ ...s, bandsintown: e.target.checked }))} /> Bandsintown</label>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs text-surface-300">Reference artist or release</label>
            <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="e.g., Billie Eilish" value={extQuery.referenceArtist || ''} onChange={e => setExtQuery(q => ({ ...q, referenceArtist: e.target.value || undefined }))} />
          </div>
          <div>
            <label className="text-xs text-surface-300">Genre (optional)</label>
            <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="Pop" value={extQuery.genre || ''} onChange={e => setExtQuery(q => ({ ...q, genre: e.target.value || undefined }))} />
          </div>
          <div>
            <label className="text-xs text-surface-300">City for live</label>
            <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="e.g., Los Angeles" value={extQuery.city || ''} onChange={e => setExtQuery(q => ({ ...q, city: e.target.value || undefined }))} />
          </div>
        </div>
        <div className="mt-3">
          <button className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30" onClick={runExternalSearch} disabled={extLoading}>
            {extLoading ? 'Searching…' : 'Search sources'}
          </button>
        </div>
        {extResults.length > 0 && (
          <div className="mt-4 space-y-3">
            {extResults.map(r => (
              <div key={r.source} className="rounded-xl border border-surface-700 bg-surface-900/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-surface-200 text-sm">{r.source} • {r.items.length} found{r.cached ? ' (cached)' : ''}</div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {r.items.map(c => (
                    <div key={c.id} className="rounded border border-surface-700 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-surface-100">{c.name}</div>
                          <div className="text-xs text-surface-300">{c.roles.join(', ')} • {c.genres.join(', ')}{c.location ? ` • ${c.location}` : ''}{c.remote ? ' • Remote' : ''}</div>
                        </div>
                        <button
                          className={`text-xs rounded px-2 py-1 border ${shortlist.includes(c.id) ? 'border-green-600 text-green-300' : 'border-surface-600 text-surface-300'} hover:bg-surface-700`}
                          onClick={() => toggleShortlist(c.id)}
                        >
                          {shortlist.includes(c.id) ? 'Shortlisted' : 'Shortlist'}
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-surface-200">{c.blurb}</div>
                      <div className="mt-2 text-xs text-surface-300 flex flex-wrap gap-2">
                        {c.rating && <span className="rounded bg-surface-800 px-2 py-1">⭐ {c.rating}</span>}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {c.portfolio.map((p, i) => (
                          <a key={i} href={p.url} target="_blank" rel="noreferrer" className="text-xs rounded border border-surface-600 px-2 py-1 text-surface-200 hover:bg-surface-700">
                            {p.platform}
                          </a>
                        ))}
                        <button
                          className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30"
                          onClick={() => copyBrief(c.roles[0] as TalentRole, c)}
                        >
                          Copy outreach
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended by role */}
      <div className="space-y-4">
        {Object.entries(recommendedByRole).map(([role, candidates]) => (
          <RoleSection key={role} role={role as TalentRole} candidates={candidates} />
        ))}
      </div>

      {/* All talent matching filters */}
      <div className="mt-8 rounded-2xl border border-surface-700 bg-surface-800/70 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-surface-100">All Talent</h3>
          <div className="text-xs text-surface-300">{filteredAll.length} found</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {filteredAll.map(c => (
            <div key={c.id} className="rounded-xl bg-surface-900/60 border border-surface-700 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-surface-100">{c.name}</div>
                  <div className="text-xs text-surface-300">{c.roles.join(', ')} • {c.genres.join(', ')}{c.location ? ` • ${c.location}` : ''}{c.remote ? ' • Remote' : ''}</div>
                </div>
                <button
                  className={`text-xs rounded px-2 py-1 border ${shortlist.includes(c.id) ? 'border-green-600 text-green-300' : 'border-surface-600 text-surface-300'} hover:bg-surface-700`}
                  onClick={() => toggleShortlist(c.id)}
                >
                  {shortlist.includes(c.id) ? 'Shortlisted' : 'Shortlist'}
                </button>
              </div>
              <div className="mt-2 text-sm text-surface-200">{c.blurb}</div>
              <div className="mt-2 text-xs text-surface-300 flex flex-wrap gap-2">
                {c.perSongRate && <span className="rounded bg-surface-800 px-2 py-1">${'{'}c.perSongRate{'}'}/song</span>}
                {c.dayRate && <span className="rounded bg-surface-800 px-2 py-1">${'{'}c.dayRate{'}'}/day</span>}
                {c.hourlyRate && <span className="rounded bg-surface-800 px-2 py-1">${'{'}c.hourlyRate{'}'}/hr</span>}
                {c.rating && <span className="rounded bg-surface-800 px-2 py-1">⭐ {c.rating}</span>}
                {c.responseTimeHours && <span className="rounded bg-surface-800 px-2 py-1">↩︎ {c.responseTimeHours}h</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.portfolio.map((p, i) => (
                  <a key={i} href={p.url} target="_blank" rel="noreferrer" className="text-xs rounded border border-surface-600 px-2 py-1 text-surface-200 hover:bg-surface-700">
                    {p.platform}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
