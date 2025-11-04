import React, { useEffect, useMemo, useState } from 'react';
import { ArtistProfile, ProjectConfig } from '../App';
import { inferMerchPlan } from '../lib/merchRecommender';
import { MERCH_VENDORS } from '../data/merch';
import { MerchItemPlan } from '../types/merch';
import { generateMerchQuoteRequest } from '../lib/merchOutreach';
import { getTesterContact } from '../lib/testerContact';
import { loadMerchPlan, saveMerchPlan } from '../lib/merchStorage';

export default function MerchPlanner({ profile, project, estimatedDraw, onAddToBudget, onToast }: {
  profile: ArtistProfile;
  project: ProjectConfig;
  estimatedDraw: number;
  onAddToBudget: (items: { description: string; totalCost: number }) => void;
  onToast?: (msg: string) => void;
}) {
  const projectKey = `${project.projectType}-${project.units}`;
  const initial = useMemo(() => loadMerchPlan(profile.artistName, projectKey) || inferMerchPlan(profile, project, estimatedDraw).items, [profile, project, estimatedDraw]);
  const [items, setItems] = useState<MerchItemPlan[]>(initial);
  const contact = getTesterContact();

  useEffect(() => { saveMerchPlan(items, profile.artistName, projectKey); }, [items, profile.artistName, projectKey]);

  const updateQty = (id: string, qty: number) => setItems(prev => prev.map(i => i.id === id ? recalc({ ...i, quantity: Math.max(1, qty) }) : i));
  const updateUnit = (id: string, unit: number) => setItems(prev => prev.map(i => i.id === id ? recalc({ ...i, targetUnitCostUSD: Math.max(0, unit) }) : i));
  const updateColorways = (id: string, c: number) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, colorways: Math.max(1, Math.floor(c)) }) : i));
  const updateMethod = (id: string, method: string) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, method: method as any }) : i));

  function recalc(i: MerchItemPlan): MerchItemPlan {
    if (i.targetUnitCostUSD) {
      return { ...i, estTotalCostUSD: Math.round(i.targetUnitCostUSD * i.quantity) };
    }
    return i;
  }

  const addToBudget = (i: MerchItemPlan) => {
    onAddToBudget({ description: `Merch — ${i.category}${i.colorways ? ` x${i.colorways} colorways` : ''} (${i.quantity})`, totalCost: i.estTotalCostUSD || 0 });
    onToast?.('Merch item added to budget');
  };

  const addAllToBudget = () => {
    let count = 0;
    for (const i of items) {
      onAddToBudget({ description: `Merch — ${i.category}${i.colorways ? ` x${i.colorways} colorways` : ''} (${i.quantity})`, totalCost: i.estTotalCostUSD || 0 });
      count++;
    }
    onToast?.(`Added ${count} merch items to budget`);
  };

  const copyQuote = (i: MerchItemPlan, vendorName?: string) => {
    const { subject, message } = generateMerchQuoteRequest(profile, project, i, vendorName, contact);
    navigator.clipboard.writeText(`${subject}\n\n${message}`);
    onToast?.('Quote request copied to clipboard');
  };

  const estTotal = items.reduce((s, i) => s + (i.estTotalCostUSD || 0), 0);

  const METHODS_BY_CATEGORY: Record<string, string[]> = {
    'T-Shirt': ['Screen Print','DTG'],
    'Hoodie': ['Screen Print','DTG'],
    'Hat': ['Embroidery'],
    'Sticker Pack': ['Sticker Die-Cut'],
    'Tote': ['Screen Print'],
    'Poster': ['Sublimation'],
    'Vinyl': ['Vinyl Pressing'],
    'CD': ['CD Duplication']
  };

  function vendorHints(category: string) {
    const vs = MERCH_VENDORS.filter(v => v.categories.includes(category as any));
    const minOrder = Math.min(...vs.map(v => v.minOrder || 0).filter(n => n > 0));
    const lead = Math.round(
      (vs.map(v => v.avgLeadDays || 0).filter(n => n > 0).reduce((a,b)=>a+b,0)) /
      Math.max(1, vs.map(v => v.avgLeadDays || 0).filter(n => n > 0).length)
    );
    return { minOrder: Number.isFinite(minOrder) ? minOrder : undefined, leadDays: Number.isFinite(lead) && lead > 0 ? lead : undefined };
  }

  const toCSV = (rows: any[]) => {
    if (!rows.length) return '';
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(',')];
    for (const r of rows) {
      lines.push(headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','));
    }
    return lines.join('\n');
  };
  const download = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };
  const exportCSV = () => {
    const rows = items.map(i => ({
      category: i.category,
      method: i.method,
      quantity: i.quantity,
      colorways: i.colorways || '',
      unitCost: i.targetUnitCostUSD || '',
      total: i.estTotalCostUSD || ''
    }));
    download(`${(profile.artistName||'artist').replaceAll(' ','-')}-merch.csv`, toCSV(rows));
    onToast?.('Merch CSV exported');
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-primary-700 bg-primary-900/20 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-primary-100 mb-2">🛍️ Merch Planner</h2>
        <p className="text-surface-300 text-sm">Recommended merch lineup based on your project and expected draw. Adjust quantities, copy a vendor quote request, or add items to your budget.</p>
        <div className="mt-3 flex items-center gap-3 text-sm text-primary-200">
          <span>Estimated total cost: {`$${estTotal.toLocaleString()}`}</span>
          <button className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30" onClick={addAllToBudget}>Add all to budget</button>
          <button className="text-xs rounded border border-surface-600 text-surface-200 px-2 py-1 hover:bg-surface-700" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map(i => (
          <div key={i.id} className="rounded-2xl border border-surface-700 bg-surface-800/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-surface-100">{i.category}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-surface-300">
                  <label className="text-surface-400">Method</label>
                  <select className="rounded bg-surface-900 px-2 py-1" value={i.method} onChange={e => updateMethod(i.id, e.target.value)}>
                    {(METHODS_BY_CATEGORY[i.category] || [i.method]).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {['T-Shirt','Hoodie'].includes(i.category) && (
                    <>
                      <span className="text-surface-500">•</span>
                      <label className="text-surface-400">Colorways</label>
                      <input type="number" min={1} className="w-16 rounded bg-surface-900 px-2 py-1" value={i.colorways || 1} onChange={e => updateColorways(i.id, parseInt(e.target.value || '1'))} />
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <label className="text-xs text-surface-400 block">Qty</label>
                <input type="number" className="w-24 rounded bg-surface-900 px-2 py-1 text-sm" value={i.quantity} onChange={e => updateQty(i.id, parseInt(e.target.value || '1'))} />
              </div>
            </div>
            {i.sizeBreakdown && (
              <div className="mt-2 text-xs text-surface-300">Sizes: {Object.entries(i.sizeBreakdown).map(([k,v]) => `${k} ${v}`).join(', ')}</div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-300">
              <label className="text-surface-400">Unit cost (USD)</label>
              <input type="number" min={0} step="0.01" className="w-28 rounded bg-surface-900 px-2 py-1" value={i.targetUnitCostUSD ?? 0} onChange={e => updateUnit(i.id, parseFloat(e.target.value || '0'))} />
              <span className="text-surface-500">•</span>
              <span>Est. total: {i.estTotalCostUSD ? `$${i.estTotalCostUSD.toLocaleString()}` : '—'}</span>
            </div>
            {(() => { const h = vendorHints(i.category); return (h.minOrder || h.leadDays) ? (
              <div className="mt-2 text-[11px] text-surface-400">
                {h.minOrder && (<span className="mr-3">Typical MOQ: {h.minOrder}</span>)}
                {h.leadDays && (<span>Avg lead: ~{h.leadDays} days</span>)}
              </div>
            ) : null; })()}
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30" onClick={() => addToBudget(i)}>Add to budget</button>
              <button className="text-xs rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={() => copyQuote(i)}>Copy quote (generic)</button>
              {MERCH_VENDORS.filter(v => v.categories.includes(i.category)).slice(0,3).map(v => (
                <button key={v.id} className="text-xs rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={() => copyQuote(i, v.name)}>Copy quote: {v.name}</button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {MERCH_VENDORS.filter(v => v.categories.includes(i.category)).map(v => (
                <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="text-xs rounded border border-surface-600 px-2 py-1 text-surface-200 hover:bg-surface-700">
                  {v.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
