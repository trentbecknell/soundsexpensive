export type Key = 'craft' | 'catalog' | 'brand' | 'team' | 'audience' | 'ops';

export const QUESTIONS: { key: Key; title: string; help: string }[] = [
  { key: 'craft', title: 'Craft (writing & performance)', help: 'How consistent and developed are your songwriting, vocal or instrumental skills? 1 = emerging, 5 = world-class' },
  { key: 'catalog', title: 'Catalog (song inventory)', help: 'How many finished, releasable songs do you have and how strong are they? 1 = a few rough ideas, 5 = large, release-ready catalog' },
  { key: 'brand', title: 'Brand & Visuals', help: 'Do you have a clear sound, visual identity, and assets (photos, artwork, colors)?' },
  { key: 'team', title: 'Team & Partners', help: 'Do you have consistent collaborators, management, booking, or label partners?' },
  { key: 'audience', title: 'Audience & Engagement', help: 'Do you have a measurable and engaged audience across platforms?' },
  { key: 'ops', title: 'Ops (finance & legal)', help: 'Are your business operations, rights ownership, and finances organised?' },
];
