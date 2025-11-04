import { TesterContact } from '../types/tester';

const CONTACT_KEY = 'tester-contact-v1';

export function getTesterContact(): TesterContact | undefined {
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as TesterContact;
    // basic sanity
    if (typeof parsed !== 'object' || parsed === null) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function saveTesterContact(contact: TesterContact): void {
  try {
    const sanitized = sanitize(contact);
    localStorage.setItem(CONTACT_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error('Failed to save tester contact', e);
  }
}

export function clearTesterContact(): void {
  try {
    localStorage.removeItem(CONTACT_KEY);
  } catch (e) {
    console.error('Failed to clear tester contact', e);
  }
}

export function hasAnyContact(contact?: TesterContact): boolean {
  if (!contact) return false;
  return !!(contact.email || contact.instagram || contact.website || contact.phone);
}

function sanitize(c: TesterContact): TesterContact {
  const out: TesterContact = { ...c };
  // normalize instagram to a URL if it's just a handle
  if (out.instagram) {
    const v = out.instagram.trim();
    if (!/^https?:\/\//i.test(v)) {
      const handle = v.replace(/^@/, '');
      out.instagram = `https://instagram.com/${handle}`;
    }
  }
  if (out.website) {
    const v = out.website.trim();
    if (v && !/^https?:\/\//i.test(v)) {
      out.website = `https://${v}`;
    }
  }
  return out;
}
