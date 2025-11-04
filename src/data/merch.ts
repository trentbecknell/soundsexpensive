import { MerchCatalogItem, MerchVendor } from '../types/merch';

export const MERCH_CATALOG: MerchCatalogItem[] = [
  { category: 'T-Shirt', defaultMethod: 'Screen Print', baseCostRangeUSD: [6, 10], notes: 'Bulk screen print, 1-2 color front, 1 color back' },
  { category: 'Hoodie', defaultMethod: 'Screen Print', baseCostRangeUSD: [18, 28], notes: 'Midweight hoodie, 1-2 color front' },
  { category: 'Hat', defaultMethod: 'Embroidery', baseCostRangeUSD: [9, 14], notes: 'Dad hat or snapback, front embroidery' },
  { category: 'Sticker Pack', defaultMethod: 'Sticker Die-Cut', baseCostRangeUSD: [0.25, 0.6], notes: '3-5 small die-cut stickers per pack' },
  { category: 'Tote', defaultMethod: 'Screen Print', baseCostRangeUSD: [3, 6], notes: 'Canvas tote, 1 color print' },
  { category: 'Poster', defaultMethod: 'Sublimation', baseCostRangeUSD: [1, 2.5], notes: '11x17 digital print' },
  { category: 'Vinyl', defaultMethod: 'Vinyl Pressing', baseCostRangeUSD: [8, 15], notes: '12" black, basic jacket, 100-300 MOQ typical' },
  { category: 'CD', defaultMethod: 'CD Duplication', baseCostRangeUSD: [1.2, 2.2], notes: 'Jacket/wallet, 100 MOQ typical' },
];

export const MERCH_VENDORS: MerchVendor[] = [
  { id: 'v-printful', name: 'Printful', methods: ['DTG','Embroidery','Sublimation'], categories: ['T-Shirt','Hoodie','Hat','Poster'], dropship: true, ecoOptions: true, avgLeadDays: 5, url: 'https://www.printful.com' },
  { id: 'v-printify', name: 'Printify', methods: ['DTG','Embroidery','Sublimation'], categories: ['T-Shirt','Hoodie','Hat','Poster'], dropship: true, avgLeadDays: 7, url: 'https://printify.com' },
  { id: 'v-custom-ink', name: 'Custom Ink', methods: ['Screen Print','Embroidery'], categories: ['T-Shirt','Hoodie','Hat','Tote'], minOrder: 12, avgLeadDays: 10, url: 'https://www.customink.com' },
  { id: 'v-sticker-mule', name: 'Sticker Mule', methods: ['Sticker Die-Cut'], categories: ['Sticker Pack'], avgLeadDays: 5, url: 'https://www.stickermule.com' },
  { id: 'v-local-screen', name: 'Local Screen Printer', methods: ['Screen Print'], categories: ['T-Shirt','Hoodie','Tote'], location: 'Your City', minOrder: 24, avgLeadDays: 7, url: 'https://example.com' },
  { id: 'v-vinyl-press', name: 'Vinyl Press Co', methods: ['Vinyl Pressing'], categories: ['Vinyl'], minOrder: 100, avgLeadDays: 45, url: 'https://example-vinyl.com' },
  { id: 'v-cd-dup', name: 'CD Duplication Co', methods: ['CD Duplication'], categories: ['CD'], minOrder: 100, avgLeadDays: 10, url: 'https://example-cd.com' },
];
