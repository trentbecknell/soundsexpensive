# Design System - Artist Roadmap PRO

## Color Palette & Usage Guidelines

### Primary Colors
- **Sky Blue** (#0ea5e9) - `primary-500`
  - Use for: Primary buttons, links, interactive elements
  - Text on: Dark backgrounds only
  - Contrast ratio: 4.5:1+ on dark backgrounds

### Accent Colors  
- **Magenta** (#d946ef) - `accent-500`
  - Use for: Secondary actions, highlights, badges
  - Text on: Dark backgrounds only
  - Contrast ratio: 4.5:1+ on dark backgrounds

### Surface Colors (Backgrounds)
- **Darkest** (#18181b) - `surface-900` - Main backgrounds
- **Dark** (#27272a) - `surface-800` - Cards, sections
- **Medium Dark** (#3f3f46) - `surface-700` - Elevated surfaces, inputs
- **Medium** (#52525b) - `surface-600` - Borders
- **Light** (#a1a1aa) - `surface-400` - Disabled text
- **Lighter** (#d4d4d8) - `surface-300` - Secondary text (USE SPARINGLY)
- **Lightest** (#fafafa) - `surface-50` - Primary text

## Text Color Guidelines (WCAG AA Compliant)

### On Dark Backgrounds (#18181b to #3f3f46)
✅ **Primary Text**: `text-surface-50` (white) - Contrast 15:1
✅ **Secondary Text**: `text-surface-200` or `text-surface-300` - Contrast 7:1+
✅ **Tertiary Text**: `text-surface-400` - Contrast 4.5:1+ (use carefully)
❌ **Never use**: `text-surface-500` or darker on dark backgrounds

### On Light Surfaces  
✅ **Primary Text**: `text-surface-900` - Contrast 15:1
✅ **Secondary Text**: `text-surface-700` or `text-surface-600` - Contrast 7:1+

## Component-Specific Rules

### Cards & Sections
- **Background**: `bg-surface-800/50` or `bg-surface-800`
- **Border**: `border-surface-700` or `border-surface-600`
- **Primary Text**: `text-surface-50` (white)
- **Secondary Text**: `text-surface-200` (light grey)
- **Tertiary Text**: `text-surface-300` (use sparingly)

### Buttons
- **Primary**: `bg-primary-600 hover:bg-primary-700 text-white`
- **Secondary**: `bg-surface-700 hover:bg-surface-600 text-surface-100`
- **Accent**: `bg-accent-600 hover:bg-accent-700 text-white`

### Inputs
- **Background**: `bg-surface-700/50 focus:bg-surface-700`
- **Text**: `text-surface-100` (light, high contrast)
- **Placeholder**: `placeholder-surface-500` (medium contrast)
- **Border**: `border-surface-600 focus:border-primary-500`

### Badges & Tags
- **Primary**: `bg-primary-600/20 text-primary-300`
- **Accent**: `bg-accent-600/20 text-accent-300`
- **Success**: `bg-green-600/20 text-green-300`
- **Warning**: `bg-yellow-600/20 text-yellow-300`

## Typography Scale

### Headings
- **H1**: `text-4xl md:text-5xl font-bold text-surface-50`
- **H2**: `text-2xl md:text-3xl font-semibold text-surface-50`
- **H3**: `text-xl font-semibold text-surface-100`
- **H4**: `text-lg font-semibold text-surface-100`

### Body Text
- **Large**: `text-lg text-surface-200`
- **Base**: `text-base text-surface-200`
- **Small**: `text-sm text-surface-300`
- **Extra Small**: `text-xs text-surface-400`

## Common Mistakes to Avoid

❌ `text-surface-400` on `bg-surface-800` - Too low contrast
❌ `text-surface-500` on dark backgrounds - Unreadable
❌ Mixing light and dark theme patterns
❌ Using accent colors for body text

✅ Use `text-surface-50` or `text-surface-100` for primary content
✅ Use `text-surface-200` for secondary content
✅ Use `text-surface-300` sparingly for tertiary content
✅ Always check contrast ratios with WCAG tools
