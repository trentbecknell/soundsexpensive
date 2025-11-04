import { ArtistProfile, ProjectConfig } from '../App';
import { MerchPlan, MerchItemPlan, MerchCatalogItem } from '../types/merch';
import { MERCH_CATALOG } from '../data/merch';

function uid() { return Math.random().toString(36).slice(2, 9); }

function pickCatalog(category: MerchCatalogItem['category']): MerchCatalogItem {
  const found = MERCH_CATALOG.find(c => c.category === category);
  if (!found) throw new Error(`Unknown merch category: ${category}`);
  return found;
}

function estimateUnitCost(cat: MerchCatalogItem, methodOverride?: MerchCatalogItem['defaultMethod']): number {
  const [lo, hi] = cat.baseCostRangeUSD;
  // Simple midpoint; can be refined based on methodVendor later.
  return Math.round(((lo + hi) / 2) * 100) / 100;
}

export function inferMerchPlan(profile: ArtistProfile, project: ProjectConfig, estimatedDraw: number): MerchPlan {
  const items: MerchItemPlan[] = [];

  // Always: Sticker pack for attendees (low cost giveaway)
  const stickerCat = pickCatalog('Sticker Pack');
  const stickerQty = Math.max(50, Math.ceil(estimatedDraw * 1.1));
  items.push({ id: uid(), category: 'Sticker Pack', method: stickerCat.defaultMethod, quantity: stickerQty, targetUnitCostUSD: estimateUnitCost(stickerCat) });

  // T-Shirt for on-site sales; quantity based on draw and release scope
  const tshirtCat = pickCatalog('T-Shirt');
  const colorways = project.projectType === 'Album' ? 2 : 1;
  const shirtQty = Math.max(50, Math.ceil(estimatedDraw * (project.projectType === 'Album' ? 0.8 : 0.5)));
  const sizeBreakdown = { XS: Math.round(shirtQty * 0.05), S: Math.round(shirtQty * 0.18), M: Math.round(shirtQty * 0.3), L: Math.round(shirtQty * 0.28), XL: Math.round(shirtQty * 0.14), XXL: Math.max(0, shirtQty - Math.round(shirtQty * (0.05+0.18+0.3+0.28+0.14))) };
  items.push({ id: uid(), category: 'T-Shirt', method: tshirtCat.defaultMethod, quantity: shirtQty, colorways, sizeBreakdown, targetUnitCostUSD: estimateUnitCost(tshirtCat) });

  // Hoodie in colder climates or album cycles
  if (project.projectType !== 'Singles' || (profile.city && /ny|chicago|toronto|seattle|london|berlin/i.test(profile.city))) {
    const hoodieCat = pickCatalog('Hoodie');
    const hoodieQty = Math.max(24, Math.ceil(estimatedDraw * 0.2));
    items.push({ id: uid(), category: 'Hoodie', method: hoodieCat.defaultMethod, quantity: hoodieQty, targetUnitCostUSD: estimateUnitCost(hoodieCat) });
  }

  // Physical media for longer formats
  if (project.projectType !== 'Singles') {
    if (project.projectType === 'Album') {
      const vinylCat = pickCatalog('Vinyl');
      items.push({ id: uid(), category: 'Vinyl', method: vinylCat.defaultMethod, quantity: 100, targetUnitCostUSD: estimateUnitCost(vinylCat) });
    }
    const cdCat = pickCatalog('CD');
    items.push({ id: uid(), category: 'CD', method: cdCat.defaultMethod, quantity: 100, targetUnitCostUSD: estimateUnitCost(cdCat) });
  }

  // Tote as low-cost add-on if Growth is targeted
  if (project.targetMarkets.includes('Live')) {
    const toteCat = pickCatalog('Tote');
    const toteQty = Math.max(24, Math.ceil(estimatedDraw * 0.15));
    items.push({ id: uid(), category: 'Tote', method: toteCat.defaultMethod, quantity: toteQty, targetUnitCostUSD: estimateUnitCost(toteCat) });
  }

  // Estimate totals
  for (const i of items) {
    if (i.targetUnitCostUSD) i.estTotalCostUSD = Math.round(i.targetUnitCostUSD * i.quantity);
  }
  const estBudgetUSD = items.reduce((s, i) => s + (i.estTotalCostUSD || 0), 0);

  return { items, estBudgetUSD };
}
