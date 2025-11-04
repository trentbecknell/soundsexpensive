import React, { useMemo, useState } from 'react';
import { ArtistProfile, ProjectConfig } from '../App';
import { inferMerchPlan } from '../lib/merchRecommender';
import { MERCH_VENDORS } from '../data/merch';
import { MerchItemPlan } from '../types/merch';
import { generateMerchQuoteRequest } from '../lib/merchOutreach';
import { getTesterContact } from '../lib/testerContact';

export default function MerchPlanner({ profile, project, estimatedDraw, onAddToBudget }: {
  profile: ArtistProfile;
  project: ProjectConfig;
  estimatedDraw: number;
  onAddToBudget: (items: { description: string; totalCost: number }) => void;
}) {
  const plan = useMemo(() => inferMerchPlan(profile, project, estimatedDraw), [profile, project, estimatedDraw]);
  const [items, setItems] = useState<MerchItemPlan[]>(plan.items);
  const contact = getTesterContact();

  const updateQty = (id: string, qty: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty), estTotalCostUSD: i.targetUnitCostUSD ? Math.round(i.targetUnitCostUSD * Math.max(1, qty)) : i.estTotalCostUSD } : i));

  const addToBudget = (i: MerchItemPlan) => {
    onAddToBudget({ description: `Merch — ${i.category}${i.colorways ? ` x${i.colorways} colorways` : ''} (${i.quantity})`, totalCost: i.estTotalCostUSD || 0 });
    alert('Added to budget');
  };

  const copyQuote = (i: MerchItemPlan, vendorName?: string) => {
    const { subject, message } = generateMerchQuoteRequest(profile, project, i, vendorName, contact);
    navigator.clipboard.writeText(`${subject}\n\n${message}`);
    alert('Quote request copied to clipboard');
  };

  const estTotal = items.reduce((s, i) => s + (i.estTotalCostUSD || 0), 0);

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-primary-700 bg-primary-900/20 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-primary-100 mb-2">🛍️ Merch Planner</h2>
        <p className="text-surface-300 text-sm">Recommended merch lineup based on your project and expected draw. Adjust quantities, copy a vendor quote request, or add items to your budget.</p>
        <div className="mt-3 text-sm text-primary-200">Estimated total cost: ${'{'}estTotal.toLocaleString(){'}'}</div>
      </div>

      <div className="space-y-4">
        {items.map(i => (
          <div key={i.id} className="rounded-2xl border border-surface-700 bg-surface-800/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-surface-100">{i.category}</div>
                <div className="text-xs text-surface-300">Method: {i.method}{i.colorways ? ` • ${i.colorways} colorways` : ''}</div>
              </div>
              <div className="text-right">
                <label className="text-xs text-surface-400 block">Qty</label>
                <input type="number" className="w-24 rounded bg-surface-900 px-2 py-1 text-sm" value={i.quantity} onChange={e => updateQty(i.id, parseInt(e.target.value || '1'))} />
              </div>
            </div>
            {i.sizeBreakdown && (
              <div className="mt-2 text-xs text-surface-300">Sizes: {Object.entries(i.sizeBreakdown).map(([k,v]) => `${k} ${v}`).join(', ')}</div>
            )}
            <div className="mt-2 text-xs text-surface-300">Est. unit cost: {i.targetUnitCostUSD ? `$${'{'}i.targetUnitCostUSD.toFixed(2){'}'}` : '—'} • Est. total: {i.estTotalCostUSD ? `$${'{'}i.estTotalCostUSD.toLocaleString(){'}'}` : '—'}</div>
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
