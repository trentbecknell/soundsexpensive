# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Non‑technical user notes (latest v1.3.3): You can now manage multiple artists, compare 2–3 side‑by‑side, see portfolio‑wide analytics, and bulk select/export/delete. Existing single‑artist projects are migrated automatically—no setup required.

## [1.3.3] - 2025-10-30

### 🚀 Major Release: Multi‑Artist Portfolio Management

Briefly: Manage 20+ artists in one place. Compare artists with radar charts and a readiness score, view portfolio analytics (quality, genre, stage, top performers), and run bulk actions (export/delete). Backward compatible—no data loss.

#### Highlights
- Portfolio dashboard with search, filter, sort, grid/list views
- Artist comparison (2–3 artists): radar charts + investment readiness scoring
- Portfolio analytics: quality distribution, genre and stage breakdowns, top performers
- Bulk operations: select all, export selected to JSON, delete with confirmation
- Portfolio tab appears automatically when you have 2+ artists

#### Migration & Compatibility
- Automatic migration from single‑artist data to portfolio format
- No breaking changes; existing workflows unchanged for single‑artist users

#### Learn More
- Release notes: `RELEASE_NOTES_v1.3.3.md`
- Release summary: `RELEASE_SUMMARY_v1.3.3.md`

## [1.3.2] - 2025-10-29

### 🎨 Major Release: Mobile UX & Light Theme

#### **Complete Design Transformation**
- **Light Theme**: Beautiful natural aesthetic with warm wood tones, soft greys, sage green accents
- **Color Palette**: Warm wood brown primary, pure white to soft grey surfaces, terracotta highlights
- **Visual Design**: Light gradient backgrounds, organic feel, clean minimalist aesthetic
- **Readability**: Dark grey to black text on light backgrounds for excellent contrast

#### **Mobile-First Strategic Planning**
- **Responsive Chat Interface**: Full-width chat on mobile, sidebar hidden on small screens
- **Compact Desktop Sidebar**: Reduced from 320px to 272px (tablet) / 320px (large screens)
- **Simplified Suggestions**: Streamlined from 12 to 8 most useful planning topics
- **Mobile Optimization**: Flex layout switches from column (mobile) to row (desktop)
- **Progress Indicator**: Compact, non-intrusive progress display

#### **Complete Skip Functionality**
- **Onboarding Skip**: Skip button available on welcome screen
- **Profile Skip**: "Continue to Catalog Analysis" button with auto-navigation
- **Planning Skip (Desktop)**: Always-visible skip button in header
- **Planning Skip (Mobile)**: Prominent full-width skip button (removed message requirement)
- **Tab Navigation**: Removed catalog analysis requirement, all tabs freely accessible

#### **Navigation Improvements**
- **Clear Paths**: Prominent navigation buttons between sections
- **Auto-Scrolling**: Smooth scroll to relevant sections when navigating
- **Tab Freedom**: Users can access any section in any order
- **Mobile Buttons**: Full-width on mobile, auto-width on desktop for better UX

#### **Technical Infrastructure**
- **Tailwind Config**: Complete color system overhaul with light theme scales
- **CSS Gradients**: Natural wood and sage glows over white base
- **Responsive Breakpoints**: Proper md: (768px+) breakpoints throughout
- **Component Updates**: All 20+ components automatically inherit new theme

### Added
- Light theme with natural wood, sage, and terracotta color palette
- "Continue to Catalog Analysis" button in Profile section with smooth scrolling
- Always-visible skip button in Strategic Planning (mobile & desktop)
- Mobile-responsive Strategic Planning chat interface
- Prominent navigation buttons between major sections
- Title tooltips on skip buttons for clarity

### Changed
- **Complete color transformation** from dark slate/purple to light wood/sage theme
- Strategic Planning sidebar: hidden on mobile (<768px), compact on desktop
- Simplified planning suggestions from 12 items to 8 most relevant
- Removed catalog analysis requirement for accessing AI Planning tab
- Mobile skip button now always visible (removed 1+ message restriction)
- Improved responsive layouts across all sections with mobile-first approach
- Enhanced button prominence and sizing for mobile usability

### Improved
- Mobile Strategic Planning interface usability (no more "messy" layout)
- Skip button visibility, prominence, and consistency across all flows
- Navigation flow between Profile → Catalog → Planning sections
- Text readability with high-contrast dark-on-light design
- Overall visual hierarchy with clean, minimalist aesthetic
- Responsive design patterns throughout the application

### Fixed
- Strategic Planning appearing "messy" on mobile screens
- Missing skip button on initial planning screen (mobile)
- Assessment section navigation being unclear
- Tab switching restrictions preventing free navigation
- Catalog analysis blocking access to planning features

## [1.2.0] - 2024-10-22

### 🚀 Major Release: Production Deployment Ready

#### **New Deployment Infrastructure**
- **GitHub Pages Integration**: Automated CI/CD pipeline with GitHub Actions
- **Squarespace Integration**: Complete deployment guide with iframe embedding options
- **Mobile Testing Suite**: Network-accessible development server with live reload
- **Multi-Platform Access**: PWA-ready application accessible across all devices

#### **Enhanced User Experience**  
- **Chat Progress Tracking**: Real-time assessment progress with detailed trait analysis
- **Personality Insights**: Advanced artist matching with sonic and style profiling
- **Assessment Completion Flow**: Improved onboarding with flexible completion options
- **Success Probability Indicators**: Data-driven recommendations based on artist profile

#### **Production Features**
- **URL State Sharing**: Base64-encoded project sharing via shareable links
- **Local State Management**: Clear data options with localStorage persistence
- **Cross-Platform Compatibility**: Optimized responsive design for mobile/desktop
- **Performance Optimization**: Vite build configuration for fast loading

#### **Technical Infrastructure**
- **GitHub Actions Workflow**: Automated build and deployment to GitHub Pages
- **Base Path Configuration**: Proper asset loading for subdirectory deployment
- **Network Development Server**: `--host` flag support for local network testing
- **Build Optimization**: Production-ready bundling with asset optimization

#### **Documentation & Deployment**
- **Squarespace Deployment Guide**: Step-by-step integration instructions
- **Mobile Testing Instructions**: Local network and public URL access methods
- **Installation Documentation**: Comprehensive setup and development guide
- **Deployment Workflows**: Automated release pipeline documentation

#### **Developer Experience**
- **Hot Reload Testing**: Live mobile testing during development
- **Development Tools**: Enhanced debugging and testing capabilities
- **Modular Architecture**: Clean separation of concerns for maintainability
- **TypeScript Coverage**: Full type safety across deployment configurations

### Files Added
- `.github/workflows/deploy.yml` - GitHub Actions deployment automation
- `SQUARESPACE_DEPLOYMENT.md` - Complete integration guide
- `INSTALL.md` - Installation and setup instructions

### Files Modified
- `vite.config.ts` - Base path configuration for GitHub Pages
- `package.json` - Version bump to 1.2.0
- `CHANGELOG.md` - Comprehensive release documentation

## [1.1.0] - 2024-10-25

### Added
- **Grant Discovery System**: Comprehensive database of 500+ real grant opportunities
- **Intelligent Grant Matching**: AI-powered recommendation engine with compatibility scoring
- **Application Tracking Dashboard**: Full lifecycle management from discovery to funding outcome
- **Grant Database**: Curated collection including NEA, ASCAP Foundation, Grammy Foundation, state arts agencies
- **Smart Filtering**: Multi-criteria search by amount, deadline, category, and eligibility
- **Deadline Alerts**: Automated reminders with urgency indicators
- **Success Probability Analysis**: Data-driven predictions for grant applications
- **Grant Types Interface**: Complete TypeScript schema for grant opportunities and applications
- **Personalized Recommendations**: Tailored grant suggestions based on artist assessment
- **Application Materials Tracking**: Interactive checklists for required documents
- **Real-Time Progress Indicators**: Visual status tracking for application completion
- **Export Functionality**: Download grant lists and application data

### Enhanced
- **Navigation System**: New tabbed interface separating roadmap, grants, and assessment
- **State Management**: Persistent storage for grant data and application tracking
- **User Experience**: Mobile-responsive design optimized for grant research
- **TypeScript Architecture**: Comprehensive interfaces for grant management system

### Technical
- Added `/src/types/grants.ts` - Grant opportunity and application type definitions
- Added `/src/lib/grantMatching.ts` - Intelligent matching algorithms
- Added `/src/data/grants.ts` - Comprehensive grant database
- Added `/src/components/GrantDiscovery.tsx` - Main grant search and filtering UI
- Added `/src/components/GrantApplicationTracker.tsx` - Application lifecycle management
- Enhanced `/src/App.tsx` - Integrated grant system with existing functionality

## [1.0.0] - 2024-10-25

### Added
- **AI-Powered Artist Assessment**: Natural language chat interface for artistic profiling
- **Project Management System**: Dynamic timeline generation and budget estimation
- **Assessment Matrix**: Six-factor maturity evaluation with progress tracking
- **Industry Benchmarking**: Genre-specific targets and success probability calculations
- **Data Visualization**: Interactive charts using Recharts library
- **Export/Import**: JSON and CSV export with shareable project URLs
- **Professional UI**: Responsive design with Tailwind CSS

### Technical Foundation
- React 18 + TypeScript development stack
- Vite build system for optimized performance
- localStorage persistence with URL state sharing
- Comprehensive TypeScript interfaces
- Modular component architecture

### Core Components
- `/src/App.tsx` - Main application logic and state management
- `/src/components/AssessmentWizard.tsx` - Artist assessment interface
- `/src/components/Chat.tsx` - AI-powered conversation system
- `/src/components/PersonalityAssessment.tsx` - Personality trait analysis
- `/src/lib/artistProfiling.ts` - Artist profile analysis algorithms
- `/src/lib/computeStage.ts` - Project stage computation logic
- `/src/data/assessment-questions.ts` - Assessment question database

[1.1.0]: https://github.com/username/artist-roadmap/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/username/artist-roadmap/releases/tag/v1.0.0