import { ArtistProfile, ProjectConfig } from '../App';
import { MerchItemPlan } from '../types/merch';
import type { TesterContact } from '../types/tester';

export interface MerchQuoteRequest {
  subject: string;
  message: string;
}

export function generateMerchQuoteRequest(
  artist: ArtistProfile,
  project: ProjectConfig,
  item: MerchItemPlan,
  vendorName?: string,
  contact?: TesterContact
): MerchQuoteRequest {
  const subject = `${artist.artistName || 'Artist'} — Quote request for ${item.category} (${item.quantity})`;
  const lines: string[] = [];
  lines.push(`Hi${vendorName ? ` ${vendorName}` : ''},`);
  lines.push('');
  lines.push(`I’m planning merch for an upcoming ${project.projectType.toLowerCase()} cycle and need a quote for:`);
  lines.push(`- Item: ${item.category}`);
  lines.push(`- Method: ${item.method}`);
  lines.push(`- Quantity: ${item.quantity}`);
  if (item.colorways) lines.push(`- Colorways: ${item.colorways}`);
  if (item.sizeBreakdown) lines.push(`- Sizes: ${Object.entries(item.sizeBreakdown).map(([k,v]) => `${k} ${v}`).join(', ')}`);
  if (item.targetUnitCostUSD) lines.push(`- Target unit cost: ~$${item.targetUnitCostUSD.toFixed(2)}`);
  lines.push('');
  lines.push('Please include: total cost, setup fees, lead time, and any minimum order requirements.');
  lines.push('Artwork is ready in vector/print specs.');
  lines.push('');
  lines.push('Thanks!');
  lines.push(`${artist.artistName || 'Artist'}`);
  if (contact && (contact.email || contact.instagram || contact.website || contact.phone)) {
    lines.push('');
    lines.push('—');
    lines.push('Contact me:');
    if (contact.name || contact.city) lines.push(`- ${contact.name || 'Artist'}${contact.city ? ` • ${contact.city}` : ''}`);
    if (contact.email) lines.push(`- Email: ${contact.email}`);
    if (contact.instagram) {
      const v = contact.instagram.trim();
      const ig = /^https?:\/\//i.test(v) ? v : `https://instagram.com/${v.replace(/^@/, '')}`;
      lines.push(`- Instagram: ${ig}`);
    }
    if (contact.website) {
      const v = contact.website.trim();
      const url = /^https?:\/\//i.test(v) ? v : `https://${v}`;
      lines.push(`- Website: ${url}`);
    }
    if (contact.phone) lines.push(`- Phone: ${contact.phone}`);
  }
  return { subject, message: lines.join('\n') };
}
