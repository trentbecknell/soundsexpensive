import React, { useEffect, useState } from 'react';
import { TesterContact } from '../types/tester';
import { getTesterContact, saveTesterContact, clearTesterContact, hasAnyContact } from '../lib/testerContact';

export default function TesterContactPanel({ onChange }: { onChange?: (contact?: TesterContact) => void }) {
  const [contact, setContact] = useState<TesterContact>(() => getTesterContact() || {});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    onChange?.(contact && hasAnyContact(contact) ? contact : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact?.email, contact?.instagram, contact?.website, contact?.phone, contact?.name, contact?.city]);

  const handleSave = () => {
    saveTesterContact(contact);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const handleClear = () => {
    clearTesterContact();
    setContact({});
  };

  return (
    <div className="rounded-2xl border border-surface-700 bg-surface-800/70 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-surface-100">Your contact info (optional)</h3>
        {saved && <span className="text-xs text-green-300">Saved</span>}
      </div>
      <p className="text-xs text-surface-300 mb-3">Include ways for talent to reach you back. Stored locally on your device only.</p>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="text-xs text-surface-300">Name</label>
          <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" value={contact.name || ''} onChange={e => setContact(prev => ({ ...prev, name: e.target.value || undefined }))} />
        </div>
        <div>
          <label className="text-xs text-surface-300">City</label>
          <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="e.g., LA" value={contact.city || ''} onChange={e => setContact(prev => ({ ...prev, city: e.target.value || undefined }))} />
        </div>
        <div>
          <label className="text-xs text-surface-300">Email</label>
          <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" type="email" value={contact.email || ''} onChange={e => setContact(prev => ({ ...prev, email: e.target.value || undefined }))} />
        </div>
        <div>
          <label className="text-xs text-surface-300">Instagram</label>
          <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="@handle or URL" value={contact.instagram || ''} onChange={e => setContact(prev => ({ ...prev, instagram: e.target.value || undefined }))} />
        </div>
        <div>
          <label className="text-xs text-surface-300">Website</label>
          <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="example.com" value={contact.website || ''} onChange={e => setContact(prev => ({ ...prev, website: e.target.value || undefined }))} />
        </div>
        <div>
          <label className="text-xs text-surface-300">Phone</label>
          <input className="w-full rounded bg-surface-900 px-2 py-2 text-sm" placeholder="Optional" value={contact.phone || ''} onChange={e => setContact(prev => ({ ...prev, phone: e.target.value || undefined }))} />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="text-xs rounded border border-primary-600 text-primary-200 px-2 py-1 hover:bg-primary-700/30" onClick={handleSave}>Save</button>
        <button className="text-xs rounded border border-surface-600 text-surface-300 px-2 py-1 hover:bg-surface-700" onClick={handleClear}>Clear</button>
        {hasAnyContact(contact) ? (
          <span className="ml-auto text-xs text-green-300">Ready to include in briefs</span>
        ) : (
          <span className="ml-auto text-xs text-surface-400">No contact methods set</span>
        )}
      </div>
    </div>
  );
}
