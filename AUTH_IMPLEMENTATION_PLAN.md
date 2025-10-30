# Authentication & Team Collaboration Implementation Plan

**Timeline**: 5-day sprint  
**Goal**: Industry-standard auth with team workspaces for label A&R teams  
**Status**: Day 1 - In Progress

---

## Architecture Overview

### Tech Stack
- **Auth**: Clerk (industry-standard, team features built-in)
- **Database**: Supabase (PostgreSQL with RLS)
- **Frontend**: React + TypeScript (existing)
- **Deployment**: GitHub Pages (existing)

### Key Features
1. User authentication (email, Google, passwordless)
2. Organizations/workspaces (labels, management companies)
3. Role-based access (Admin, Manager, Analyst)
4. Team invitations and management
5. Cloud data sync with offline support
6. Migration from localStorage (backward compatible)

---

## Day 1: Clerk Auth Setup ✅ IN PROGRESS

### Goals
- Users can sign up and log in
- Protected routes (auth required)
- User profile in header
- Maintain existing functionality behind auth

### Tasks
1. Install Clerk dependencies
2. Create Clerk account and get API keys
3. Add environment variables
4. Wrap app in `<ClerkProvider>`
5. Create sign-in/sign-up pages
6. Add `<UserButton>` to header
7. Protect main app with auth
8. Test auth flow

### Files to Create
```
src/components/auth/
├── SignInPage.tsx          # Landing + sign in
├── SignUpPage.tsx          # Registration
└── ProtectedLayout.tsx     # Auth wrapper

.env.local                  # Clerk API keys (gitignored)
```

### Files to Modify
```
src/App.tsx                 # Wrap in ClerkProvider, add routing
src/main.tsx                # Add Clerk initialization
package.json                # Add Clerk dependencies
```

### Environment Variables
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## Day 2: Organizations & Teams

### Goals
- Labels can create organizations
- Team members can be invited
- Users can switch between orgs
- Each org has separate portfolio

### Tasks
1. Enable organizations in Clerk dashboard
2. Add `<OrganizationSwitcher>` to header
3. Create organization management UI
4. Add team invitation flow
5. Test multi-org scenarios

### Files to Create
```
src/components/organization/
├── OrgSwitcher.tsx         # Switch between labels
├── CreateOrg.tsx           # New organization flow
├── InviteMembers.tsx       # Team invitations
└── OrgSettings.tsx         # Org management

src/hooks/
└── useActiveOrg.ts         # Get current org context
```

### Data Model Changes
```typescript
// Portfolio now belongs to organization
interface Portfolio {
  id: string;
  org_id: string;           // NEW: Clerk organization ID
  user_id: string;          // Owner
  settings: PortfolioSettings;
  created_at: string;
}
```

---

## Day 3: Data Migration to Cloud

### Goals
- Migrate from localStorage to Supabase
- No data loss for existing users
- Real-time sync across team
- Offline support

### Tasks
1. Create Supabase project
2. Design database schema
3. Set up Row Level Security (RLS)
4. Create migration script
5. Update save/load functions
6. Add sync indicators
7. Handle conflicts

### Supabase Schema
```sql
-- Portfolios (one per organization)
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Artists (many per portfolio)
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL,
  profile JSONB NOT NULL,
  state JSONB NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

-- Activity log (audit trail)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their org's data)
CREATE POLICY "Org members can view portfolios"
  ON portfolios FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM user_org_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "Org members can update portfolios"
  ON portfolios FOR UPDATE
  USING (org_id IN (
    SELECT org_id FROM user_org_memberships WHERE user_id = auth.uid()
  ));
```

### Files to Create
```
src/lib/
├── supabase.ts             # Supabase client
├── sync.ts                 # Sync logic
└── migration.ts            # localStorage → Supabase

src/hooks/
├── usePortfolio.ts         # Portfolio CRUD with sync
└── useArtists.ts           # Artists CRUD with sync
```

### Migration Strategy
```typescript
// On first login:
1. Check for localStorage data
2. If exists:
   - Show "Migrate Data" dialog
   - Upload to Supabase with org_id
   - Keep local backup for 30 days
   - Mark as migrated
3. If not exists:
   - Fresh start with cloud data
```

---

## Day 4: Role-Based Access Control

### Goals
- Admin, Manager, Analyst roles
- Permission checks throughout app
- UI adapts to user role
- Team management by admins

### Roles & Permissions
```typescript
enum Role {
  Admin = 'admin',      // Full access, team management
  Manager = 'manager',  // Add/edit artists, generate roadmaps
  Analyst = 'analyst'   // View-only, comparisons, analytics
}

const permissions = {
  admin: ['*'],
  manager: [
    'artists.create',
    'artists.update',
    'artists.delete',
    'roadmap.generate',
    'analytics.view',
    'comparison.use'
  ],
  analyst: [
    'artists.view',
    'analytics.view',
    'comparison.use'
  ]
};
```

### Tasks
1. Define roles in Clerk dashboard
2. Create permission helper functions
3. Add permission checks to UI
4. Add permission checks to API calls
5. Test each role thoroughly

### Files to Create
```
src/lib/auth/
├── permissions.ts          # RBAC helpers
└── roles.ts                # Role definitions

src/hooks/
└── usePermissions.ts       # Check permissions hook
```

### UI Changes
```typescript
// Example: Conditional rendering based on role
const { hasPermission } = usePermissions();

{hasPermission('artists.delete') && (
  <button onClick={deleteArtist}>Delete</button>
)}

{hasPermission('artists.create') ? (
  <button onClick={createArtist}>New Artist</button>
) : (
  <button disabled title="View-only access">
    New Artist (Request Access)
  </button>
)}
```

---

## Day 5: Polish & Team Features

### Goals
- Professional team experience
- Activity logging
- Onboarding for labels
- Pro features gating

### Features
1. **Activity Log**
   - "John added Artist X"
   - "Sarah updated roadmap for Artist Y"
   - "Mike compared 3 artists"

2. **Team Analytics**
   - Who's most active
   - Portfolio health over time
   - Team usage metrics

3. **Onboarding Tour**
   - First-time org setup guide
   - Role explanations
   - Feature walkthrough

4. **Pro Features Gate**
   - Free: 20 artists, 3 team members
   - Pro ($49/mo): Unlimited everything
   - Show upgrade prompts

### Files to Create
```
src/components/team/
├── ActivityFeed.tsx        # Activity log UI
├── TeamAnalytics.tsx       # Team usage stats
└── OnboardingTour.tsx      # First-time setup

src/components/billing/
├── PlanSelector.tsx        # Free vs Pro
├── UpgradePrompt.tsx       # Upgrade modal
└── BillingSettings.tsx     # Manage subscription
```

---

## Testing Checklist

### Individual User Flow
- [ ] Sign up with email
- [ ] Verify email
- [ ] Complete profile
- [ ] Create first artist
- [ ] Migrate localStorage data
- [ ] Generate roadmap
- [ ] Log out / log back in
- [ ] Data persists

### Team Flow (Label)
- [ ] Admin creates organization
- [ ] Admin invites 2 team members
- [ ] Manager accepts invite
- [ ] Analyst accepts invite
- [ ] Manager adds artist
- [ ] Analyst views artist (read-only)
- [ ] Admin deletes artist
- [ ] All see activity log
- [ ] Manager tries to invite (blocked)
- [ ] Analyst tries to edit (blocked)

### Multi-Org Flow
- [ ] User creates personal org
- [ ] User joins label org
- [ ] Switch between orgs
- [ ] Each org has separate data
- [ ] No data leakage

### Edge Cases
- [ ] Offline mode
- [ ] Slow network (sync indicators)
- [ ] Concurrent edits (conflict resolution)
- [ ] Account deletion (data cleanup)
- [ ] Org deletion (cascade)
- [ ] Role changes take effect immediately

---

## Deployment Strategy

### Phase 1: Soft Launch (Week 1)
- Deploy auth to beta.artistroadmap.pro
- Keep main app on GitHub Pages
- Invite 5 labels for testing
- Gather feedback

### Phase 2: Migration Period (Week 2)
- Deploy to main domain
- Both localStorage + cloud work
- Show migration banner
- Gradual rollout

### Phase 3: Full Launch (Week 3)
- Remove localStorage fallback
- Force authentication
- Public announcement
- Documentation & support

---

## Cost Breakdown

### Development Costs
- Your time: 5 days

### Operational Costs (Monthly)
- Clerk: $0 (free tier: 10k users)
- Supabase: $0 (free tier: 500MB DB)
- GitHub Pages: $0 (existing)
- **Total: $0/mo** until scale

### Revenue Potential
- Free tier: 20 artists, 3 team
- Pro tier: $49/mo × 50 labels = $2,450/mo
- Enterprise: $299/mo × 5 labels = $1,495/mo
- **Potential: $3,945/mo** at 55 paying customers

---

## Risk Mitigation

### Technical Risks
- **Clerk outage**: Rare, but implement localStorage fallback
- **Supabase limits**: Free tier is generous, upgrade at $25/mo
- **Data loss**: Daily backups, 30-day retention

### Business Risks
- **Adoption**: Free tier removes barrier to entry
- **Competition**: First-mover advantage in A&R tools
- **Support load**: Documentation + community Slack

### Security Risks
- **Data breach**: Clerk + Supabase handle security
- **Unauthorized access**: RLS policies enforce isolation
- **GDPR compliance**: Both providers are compliant

---

## Success Metrics

### Week 1
- 10 signups
- 3 organizations created
- 5 team invitations accepted

### Month 1
- 100 signups
- 20 organizations
- 50 artists managed
- 5 paying customers

### Month 3
- 500 signups
- 100 organizations
- 500 artists managed
- 25 paying customers
- $1,225 MRR

---

## Next Steps (Day 1 Implementation)

1. Create Clerk account
2. Install dependencies
3. Set up environment variables
4. Create auth components
5. Test sign-in/sign-up flow

**Ready to start!** 🚀
