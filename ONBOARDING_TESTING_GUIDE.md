# Onboarding Overlay Testing Guide

## Overview
The onboarding overlay provides first-time user guidance that meets all acceptance criteria from user stories 2.1-2.3.

## Feature Details

### User Story 2.1: App Purpose (P1)
✅ **Implemented**: Short intro text overlay explaining what the app is for

**What to Test:**
- Overlay appears on first visit
- Title: "Welcome to Artist Roadmap"
- Description: "Plan your music project from idea to release with AI-powered budgeting, timeline planning, and industry insights."
- Message is < 2 sentences as required

### User Story 2.2: Interaction Guidance (P1)
✅ **Implemented**: Clear interactive prompts for how to use the app

**What to Test:**
- Three numbered steps are displayed:
  1. "Start with Assessment" - Answer questions about your music and goals
  2. "Build Your Budget" - Add budget items, explore grants, analyze catalog
  3. "Create Your Timeline" - Visualize roadmap with tasks and milestones
- Each step has clear description
- Visual numbering (1, 2, 3) in purple circles

### User Story 2.3: Dismissible Instructions (P1)
✅ **Implemented**: Overlay is dismissible and appears only first 1-2 uses

**What to Test:**
- Clicking anywhere on the overlay dismisses it
- Clicking "Get Started" button dismisses it
- Small text shows: "Tap anywhere to dismiss • This will show once more on your next visit"
- Overlay appears on first visit
- Overlay appears again on second visit
- Overlay does NOT appear on third visit (permanently hidden)
- Does not return excessively (max 2 times as designed)

## Testing Instructions

### Test 1: First Visit Experience
```bash
# In browser console:
localStorage.clear()
# Refresh page
```

**Expected:**
- Onboarding overlay appears immediately
- Full-screen dark backdrop with centered purple card
- Title and description visible
- Three step prompts displayed
- "Get Started" button visible
- Dismissal instructions at bottom

### Test 2: Dismissal via Tap
```bash
# Click anywhere on the dark backdrop (outside the card)
```

**Expected:**
- Overlay immediately disappears
- App is visible and usable
- localStorage contains: `artist-roadmap-onboarding-dismissed` with count: 1

### Test 3: Dismissal via Button
```bash
localStorage.clear()
# Refresh page
# Click "Get Started" button
```

**Expected:**
- Overlay immediately disappears
- Same localStorage behavior as Test 2

### Test 4: Second Visit
```bash
# Refresh page (don't clear localStorage)
```

**Expected:**
- Onboarding overlay appears again
- Same content as first visit
- localStorage count increments to 2

### Test 5: Third Visit (Permanent Hide)
```bash
# Refresh page again (localStorage count should be 2)
```

**Expected:**
- Onboarding does NOT appear
- App loads normally
- localStorage still contains count: 2
- Future visits will not show onboarding

### Test 6: Accessibility
```bash
# In browser console:
document.querySelector('[role="dialog"]')
```

**Expected:**
- Element has `role="dialog"`
- Element has `aria-labelledby="onboarding-title"`
- Element has `aria-describedby="onboarding-description"`
- Title has `id="onboarding-title"`
- Description has `id="onboarding-description"`

### Test 7: Reset for Testing
```bash
# In browser console:
localStorage.removeItem('artist-roadmap-onboarding-dismissed')
# Refresh page
```

**Expected:**
- Onboarding appears again as if first visit
- Can repeat all tests

## Developer Tools

### Check Onboarding State
```javascript
// In browser console:
JSON.parse(localStorage.getItem('artist-roadmap-onboarding-dismissed'))
// Returns: { count: 1 or 2, lastSeen: timestamp }
```

### Programmatic Reset
```javascript
// Import in component or test:
import { resetOnboarding } from './src/components/OnboardingOverlay';
resetOnboarding();
```

### Check if Should Show
```javascript
// Import in component or test:
import { shouldShowOnboarding } from './src/components/OnboardingOverlay';
console.log(shouldShowOnboarding()); // true or false
```

## Visual Design

### Colors
- Backdrop: `bg-black/80` with `backdrop-blur-sm`
- Card: `from-purple-900/90 to-indigo-900/90` gradient
- Border: `border-purple-500/30`
- Text: White with purple tints
- Step badges: `bg-purple-500` circles
- Button: `bg-purple-500 hover:bg-purple-600`

### Spacing
- Card: `max-w-lg` with `p-8`
- Steps: `space-y-6` between items
- Each step: `p-4` with `gap-4` for icon and text

### Responsive
- Card width: `max-w-lg` (responsive)
- Margin: `mx-4` (mobile padding)
- Centered: `flex items-center justify-center`

## Acceptance Criteria Checklist

- ✅ **2.1.1**: Overlay explains purpose in < 2 sentences
- ✅ **2.1.2**: Explanation is clear and concise
- ✅ **2.2.1**: Clear interactive guidance provided (3 steps)
- ✅ **2.2.2**: Prompts appear only first 1-2 uses
- ✅ **2.3.1**: Overlay dismissible with tap
- ✅ **2.3.2**: Tap to close implemented
- ✅ **2.3.3**: Does not return excessively (max 2 times)

## Known Behavior

1. **TesterWelcome vs OnboardingOverlay**: 
   - TesterWelcome: Small toast, bottom-left, shows session info
   - OnboardingOverlay: Full-screen, explains app purpose
   - Both can appear simultaneously on first visit (by design)
   
2. **Z-Index**: OnboardingOverlay has `z-50` to appear above all content

3. **Persistence**: Uses separate localStorage key from tester identity

4. **Analytics**: No analytics tracked (privacy-first design)

## Unit Tests

Run tests:
```bash
npm test
```

13 tests cover:
- ✅ First visit display
- ✅ Interactive prompts rendering
- ✅ Dismissal on backdrop click
- ✅ Dismissal on button click
- ✅ localStorage persistence
- ✅ Second visit behavior
- ✅ Third visit hiding
- ✅ Helper functions (shouldShowOnboarding, resetOnboarding)
- ✅ Corrupted data handling
- ✅ Accessibility attributes
- ✅ User-facing messages

All 39 tests passing ✅
