import React, { useEffect, useMemo, useState } from 'react';
import { ArtistProfile, ProjectConfig } from '../App';
import { inferMerchPlan } from '../lib/merchRecommender';
import { MERCH_VENDORS } from '../data/merch';
import { MerchItemPlan } from '../types/merch';
import { generateMerchQuoteRequest } from '../lib/merchOutreach';
import { getTesterContact } from '../lib/testerContact';
import { loadMerchPlan, saveMerchPlan } from '../lib/merchStorage';
import { defaultSizeBreakdown, rebalanceBreakdown } from '../lib/merchSizing';
import { DEFAULT_SELL_PRICE_BY_CATEGORY, priceForMargin } from '../lib/pricing';

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

  const currency = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const updateQty = (id: string, qty: number) => setItems(prev => prev.map(i => i.id === id ? recalc({ ...i, quantity: Math.max(1, qty) }) : i));
  const updateUnit = (id: string, unit: number) => setItems(prev => prev.map(i => i.id === id ? recalc({ ...i, targetUnitCostUSD: Math.max(0, unit) }) : i));
  const updateColorways = (id: string, c: number) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, colorways: Math.max(1, Math.floor(c)) }) : i));
  const updateMethod = (id: string, method: string) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, method: method as any }) : i));
  const updateSell = (id: string, price: number) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, sellPriceUSD: Math.max(0, price) }) : i));
  const updateVendor = (id: string, vendorId: string) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, preferredVendorId: vendorId || undefined }) : i));
  const updateSize = (id: string, size: keyof NonNullable<MerchItemPlan['sizeBreakdown']>, qty: number) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, sizeBreakdown: { ...(i.sizeBreakdown || defaultSizeBreakdown(i.quantity)), [size]: Math.max(0, Math.floor(qty)) } }) : i));
  const rebalanceSizes = (id: string) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, sizeBreakdown: rebalanceBreakdown(i.sizeBreakdown || defaultSizeBreakdown(i.quantity), i.quantity) }) : i));
  const resetSizes = (id: string) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, sizeBreakdown: defaultSizeBreakdown(i.quantity) }) : i));

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
  const estRevenue = items.reduce((s, i) => s + ((i.sellPriceUSD || 0) * i.quantity), 0);
  const estMargin = Math.max(0, estRevenue - estTotal);
  const estMarginPct = estRevenue > 0 ? Math.round((estMargin / estRevenue) * 100) : 0;
  const [targetMarginPct, setTargetMarginPct] = useState<number>(50);

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

  function vendorHints(category: string, preferredVendorId?: string) {
    const vs = MERCH_VENDORS.filter(v => v.categories.includes(category as any));
    if (preferredVendorId) {
      const v = MERCH_VENDORS.find(v => v.id === preferredVendorId);
      return { minOrder: v?.minOrder, leadDays: v?.avgLeadDays };
    }
    const minOrder = Math.min(...vs.map(v => v.minOrder || 0).filter(n => n > 0));
    const lead = Math.round(
      (vs.map(v => v.avgLeadDays || 0).filter(n => n > 0).reduce((a,b)=>a+b,0)) /
      Math.max(1, vs.map(v => v.avgLeadDays || 0).filter(n => n > 0).length)
    );
    return { minOrder: Number.isFinite(minOrder) ? minOrder : undefined, leadDays: Number.isFinite(lead) && lead > 0 ? lead : undefined };
  }

  function vendorFeatures(category: string) {
    const vs = MERCH_VENDORS.filter(v => v.categories.includes(category as any));
    const hasDropship = vs.some(v => v.dropship);
    const hasEco = vs.some(v => v.ecoOptions);
    return { hasDropship, hasEco };
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
          <span>Estimated total cost: {currency(estTotal)}</span>
          <span className="text-surface-400">•</span>
          <span>Projected revenue: {currency(estRevenue)}</span>
          <span className="text-surface-400">•</span>
          <span>Gross margin: {currency(estMargin)} ({estMarginPct}%)</span>
          <span className="text-surface-400">•</span>
          <button className="text-xs rounded border border-surface-600 text-surface-200 px-2 py-1 hover:bg-surface-700" onClick={() => setItems(prev => prev.map(i => ({ ...i, sellPriceUSD: DEFAULT_SELL_PRICE_BY_CATEGORY[i.category] || i.sellPriceUSD || 0 })))}>Suggest sell prices</button>
          <div className="flex items-center gap-2 text-xs">
            <label className="text-surface-300">Target margin %</label>
            <input type="number" min={0} max={90} className="w-16 rounded bg-surface-900 px-2 py-1" value={targetMarginPct} onChange={e => setTargetMarginPct(Math.max(0, Math.min(90, parseInt(e.target.value || '0'))))} />
            <button className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30" onClick={() => setItems(prev => prev.map(i => (i.targetUnitCostUSD ? ({ ...i, sellPriceUSD: priceForMargin(i.targetUnitCostUSD, targetMarginPct/100) }) : i)))}>Apply</button>
          </div>
          <button className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30" onClick={addAllToBudget}>Add all to budget</button>
          <button className="text-xs rounded border border-surface-600 text-surface-200 px-2 py-1 hover:bg-surface-700" onClick={exportCSV}>Export CSV</button>
          <button className="text-xs rounded border border-red-600 text-red-200 px-2 py-1 hover:bg-red-700/30" onClick={() => setItems(inferMerchPlan(profile, project, estimatedDraw).items)}>Reset to recommended</button>
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
                    {((i.preferredVendorId ? (MERCH_VENDORS.find(v => v.id === i.preferredVendorId)?.methods || []) : (METHODS_BY_CATEGORY[i.category] || [i.method])) as string[]).map(m => (
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
                  <span className="text-surface-500">•</span>
                  <label className="text-surface-400">Vendor</label>
                  <select className="rounded bg-surface-900 px-2 py-1" value={i.preferredVendorId || ''} onChange={e => updateVendor(i.id, e.target.value)}>
                    <option value="">Any</option>
                    {MERCH_VENDORS.filter(v => v.categories.includes(i.category)).map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-right">
                <label className="text-xs text-surface-400 block">Qty</label>
                <input type="number" className="w-24 rounded bg-surface-900 px-2 py-1 text-sm" value={i.quantity} onChange={e => updateQty(i.id, parseInt(e.target.value || '1'))} />
              </div>
            </div>
            {i.sizeBreakdown && (
              <div className="mt-2 text-xs text-surface-300">
                <details>
                  <summary className="cursor-pointer select-none text-surface-200">Sizes: {Object.entries(i.sizeBreakdown).map(([k,v]) => `${k} ${v}`).join(', ')}</summary>
                  <div className="mt-2 grid grid-cols-6 gap-2">
                    {(Object.keys(i.sizeBreakdown) as Array<keyof NonNullable<MerchItemPlan['sizeBreakdown']>>).map(sz => (
                      <div key={String(sz)} className="flex flex-col items-start text-[11px]">
                        <label className="text-surface-400 mb-1">{String(sz)}</label>
                        <input type="number" min={0} className="w-full rounded bg-surface-900 px-2 py-1" value={i.sizeBreakdown?.[sz] ?? 0} onChange={e => updateSize(i.id, sz, parseInt(e.target.value || '0'))} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="text-xs rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={() => rebalanceSizes(i.id)}>Rebalance to {i.quantity}</button>
                    <button className="text-xs rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={() => resetSizes(i.id)}>Reset default sizes</button>
                  </div>
                </details>
              </div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-300">
              <label className="text-surface-400">Unit cost (USD)</label>
              <input type="number" min={0} step="0.01" className="w-28 rounded bg-surface-900 px-2 py-1" value={i.targetUnitCostUSD ?? 0} onChange={e => updateUnit(i.id, parseFloat(e.target.value || '0'))} />
              <span className="text-surface-500">•</span>
              <span>Est. total: {i.estTotalCostUSD ? currency(i.estTotalCostUSD) : '—'}</span>
              <span className="text-surface-500">•</span>
              <label className="text-surface-400">Sell price</label>
              <input type="number" min={0} step="0.01" className="w-24 rounded bg-surface-900 px-2 py-1" value={i.sellPriceUSD ?? 0} onChange={e => updateSell(i.id, parseFloat(e.target.value || '0'))} />
              <span className="text-surface-500">•</span>
              <span>Revenue: {i.sellPriceUSD ? currency((i.sellPriceUSD || 0) * i.quantity) : '—'}</span>
              {i.sellPriceUSD && i.estTotalCostUSD ? (
                <>
                  <span className="text-surface-500">•</span>
                  <span>Margin: {currency(((i.sellPriceUSD || 0) * i.quantity) - (i.estTotalCostUSD || 0))}</span>
                </>
              ) : null}
            </div>
            {(() => { const h = vendorHints(i.category, i.preferredVendorId); const f = vendorFeatures(i.category); return (h.minOrder || h.leadDays || f.hasDropship || f.hasEco) ? (
              <div className="mt-2 text-[11px] text-surface-400">
                {h.minOrder && (
                  <span className="mr-3">Typical MOQ: {h.minOrder}</span>
                )}
                {h.leadDays && (<span>Avg lead: ~{h.leadDays} days</span>)}
                {f.hasDropship && (<span className="ml-3 inline-flex items-center gap-1 text-surface-300"><span className="w-1.5 h-1.5 bg-surface-500 rounded-full"></span> Dropship options</span>)}
                {f.hasEco && (<span className="ml-2 inline-flex items-center gap-1 text-green-300"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Eco options</span>)}
              </div>
            ) : null; })()}
            {(() => { const h = vendorHints(i.category, i.preferredVendorId); return (h.minOrder && i.quantity < h.minOrder) ? (
              <div className="mt-2 inline-flex items-center text-[11px] text-red-300 bg-red-900/20 border border-red-700/40 rounded px-2 py-1">Below typical MOQ for this item</div>
            ) : null; })()}
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30" onClick={() => addToBudget(i)}>Add to budget</button>
              <button className="text-xs rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={() => copyQuote(i)}>Copy quote (generic)</button>
              {MERCH_VENDORS.filter(v => v.categories.includes(i.category)).slice(0,3).map(v => (
                <button key={v.id} className="text-xs rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={() => copyQuote(i, v.name)}>Copy quote: {v.name}</button>
              ))}
              <button className="text-xs rounded border border-surface-700 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={() => setItems(prev => prev.filter(x => x.id !== i.id))}>Remove</button>
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
