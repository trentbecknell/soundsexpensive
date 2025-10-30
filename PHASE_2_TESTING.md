# Phase 2: Local Clerk Testing Checklist

**Date**: October 30, 2025  
**Status**: Testing in Progress  
**Environment**: Development (localhost:5173)

---

## ✅ Pre-Test Setup

- [x] Clerk publishable key configured in `.env.local`
- [x] `ENABLE_CLERK = import.meta.env.DEV` (enabled in dev mode only)
- [x] AuthenticatedApp wrapper implemented
- [x] User-scoped localStorage ready
- [x] Authentication routes configured
- [ ] Clerk Dashboard configured with dev URLs

---

## 🎯 Test Scenarios

### Scenario 1: Initial Authentication Flow

#### Test 1.1: First Visit - Unauthenticated
**Steps**:
1. Clear browser localStorage
2. Visit `http://localhost:5173`

**Expected Results**:
- [ ] Redirects to `/#/sign-in`
- [ ] Shows Clerk sign-in component
- [ ] No errors in console
- [ ] No infinite redirect loop

**Actual Results**:
```
[Record results here]
```

---

#### Test 1.2: Sign Up New User
**Steps**:
1. Click "Sign up" link
2. Enter email and password
3. Verify email (if required)
4. Complete sign-up

**Expected Results**:
- [ ] Sign-up form loads correctly
- [ ] Email verification works (if enabled)
- [ ] After sign-up, redirects to `/#/` (main app)
- [ ] Lands on **Roadmap tab** (not chat planning)
- [ ] Console shows: `✅ Authenticated as: {email}`
- [ ] localStorage key is `artist-roadmap-portfolio-{clerkUserId}`

**Actual Results**:
```
[Record results here]
```

---

#### Test 1.3: Sign In Existing User
**Steps**:
1. Sign out (if signed in)
2. Visit `http://localhost:5173`
3. Enter credentials
4. Click "Sign in"

**Expected Results**:
- [ ] Sign-in form loads correctly
- [ ] Authentication succeeds
- [ ] Redirects to `/#/` (main app)
- [ ] Lands on **Roadmap tab**
- [ ] Console shows authenticated user info
- [ ] User sees their own data (not anonymous data)

**Actual Results**:
```
[Record results here]
```

---

### Scenario 2: Multi-User Data Isolation

#### Test 2.1: User A Creates Portfolio
**Steps**:
1. Sign in as User A (test1@example.com)
2. Create an artist: "Test Artist A"
3. Add budget items, tasks
4. Note the Clerk user ID from console
5. Check localStorage key

**Expected Results**:
- [ ] Data saved to `artist-roadmap-portfolio-user_xxxxx`
- [ ] Portfolio contains "Test Artist A"
- [ ] Data persists on page refresh

**Actual Results**:
```
User A Clerk ID: [record here]
localStorage key: [record here]
Data saved correctly: [ ]
```

---

#### Test 2.2: User B Sees Empty Portfolio
**Steps**:
1. Sign out User A
2. Sign up/in as User B (test2@example.com)
3. Check what data is shown

**Expected Results**:
- [ ] Empty portfolio (no artists)
- [ ] Does NOT see "Test Artist A"
- [ ] localStorage key is different: `artist-roadmap-portfolio-user_yyyyy`
- [ ] Can create their own artist: "Test Artist B"

**Actual Results**:
```
User B Clerk ID: [record here]
localStorage key: [record here]
Sees User A data: [ ] (should be NO)
Can create own data: [ ]
```

---

#### Test 2.3: User A Returns and Sees Original Data
**Steps**:
1. Sign out User B
2. Sign back in as User A
3. Check portfolio

**Expected Results**:
- [ ] Sees "Test Artist A" (original data)
- [ ] Does NOT see "Test Artist B"
- [ ] localStorage switched to User A's key
- [ ] All original budget/tasks intact

**Actual Results**:
```
User A data preserved: [ ]
User B data not visible: [ ]
Data integrity confirmed: [ ]
```

---

### Scenario 3: Session Management

#### Test 3.1: Page Refresh While Signed In
**Steps**:
1. Sign in as User A
2. Navigate to Grants tab
3. Refresh page (F5)

**Expected Results**:
- [ ] Shows "Loading authentication..." briefly
- [ ] User remains signed in
- [ ] Still on Grants tab (or redirects to lastActiveTab)
- [ ] No flash of unauthenticated state
- [ ] Data still visible

**Actual Results**:
```
[Record results here]
```

---

#### Test 3.2: Sign Out
**Steps**:
1. Sign in as User A
2. Click sign-out button (if visible)
3. OR manually call Clerk signOut

**Expected Results**:
- [ ] User signed out successfully
- [ ] Redirects to `/#/sign-in`
- [ ] localStorage data PERSISTS (not deleted)
- [ ] Can sign back in and see data

**Actual Results**:
```
[Record results here]
```

---

### Scenario 4: Edge Cases

#### Test 4.1: Direct URL Navigation While Signed Out
**Steps**:
1. Sign out
2. Try to visit `http://localhost:5173/#/roadmap` directly

**Expected Results**:
- [ ] Redirects to `/#/sign-in`
- [ ] After sign-in, redirects back to `/#/roadmap`
- [ ] OR redirects to `/#/` (acceptable)

**Actual Results**:
```
[Record results here]
```

---

#### Test 4.2: Browser Back Button During Auth
**Steps**:
1. Visit `/#/sign-in`
2. Click "Sign up"
3. Press browser back button

**Expected Results**:
- [ ] Returns to sign-in page
- [ ] No errors
- [ ] No redirect loop
- [ ] Can navigate forward again

**Actual Results**:
```
[Record results here]
```

---

#### Test 4.3: Network Timeout Simulation
**Steps**:
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Try to sign in

**Expected Results**:
- [ ] Shows "Loading authentication..." message
- [ ] Eventually completes (or times out gracefully)
- [ ] No white screen or crash
- [ ] User can retry

**Actual Results**:
```
[Record results here]
```

---

#### Test 4.4: Third-Party Cookies Blocked
**Steps**:
1. Enable strict tracking prevention (Safari) or block third-party cookies
2. Try to sign in

**Expected Results**:
- [ ] Either works (if Clerk handles it)
- [ ] OR shows helpful error message
- [ ] Doesn't silently fail

**Actual Results**:
```
[Record results here]
```

---

### Scenario 5: Migration from Anonymous

#### Test 5.1: Existing Anonymous User
**Steps**:
1. Clear all Clerk sessions
2. Ensure `artist-roadmap-portfolio-anonymous` has data
3. Sign in for the first time

**Expected Results**:
- [ ] User sees authenticated view
- [ ] OLD anonymous data still exists in localStorage
- [ ] NEW user-scoped key created (empty)
- [ ] User can manually import anonymous data (future feature)

**Actual Results**:
```
Anonymous data preserved: [ ]
New user key created: [ ]
Keys isolated correctly: [ ]
```

---

### Scenario 6: Chat Planning Flow (Critical!)

#### Test 6.1: Post-Auth Landing Page
**Steps**:
1. Sign in as new user
2. Observe what page loads

**Expected Results**:
- [ ] Lands on **Roadmap tab** (NOT chat planning)
- [ ] Sees tabbed navigation
- [ ] Can navigate freely between tabs
- [ ] No forced chat interface

**Actual Results**:
```
Landing page: [record here]
Chat forced: [ ] (should be NO)
Free navigation: [ ]
```

---

#### Test 6.2: Returning User Experience
**Steps**:
1. Create data as User A
2. Sign out
3. Sign back in

**Expected Results**:
- [ ] Lands on `lastActiveTab` (likely Roadmap)
- [ ] Does NOT force chat planning
- [ ] Can access all tabs immediately

**Actual Results**:
```
[Record results here]
```

---

## 🐛 Known Issues to Watch For

### Issue 1: Redirect Loops
**Symptoms**: Infinite redirects between `/` and `/sign-in`  
**Cause**: SignedIn/SignedOut components fighting  
**Fix**: Check route configuration

**Observed**: [ ]

---

### Issue 2: 404 Errors on Auth Routes
**Symptoms**: `/sign-in` returns 404  
**Cause**: HashRouter path issues  
**Fix**: Ensure routes use `#/sign-in` format

**Observed**: [ ]

---

### Issue 3: localStorage Key Conflicts
**Symptoms**: Data mixing between users  
**Cause**: userId not passed correctly  
**Fix**: Verify AuthenticatedApp passes userId to App

**Observed**: [ ]

---

### Issue 4: Chat Planning Forced
**Symptoms**: User sees chat interface after sign-in  
**Cause**: chatComplete state issue  
**Fix**: Verify chatComplete defaults to true

**Observed**: [ ]

---

### Issue 5: Flash of Unauthenticated Content
**Symptoms**: Brief flash of wrong UI before auth loads  
**Cause**: ClerkLoader not working  
**Fix**: Check ClerkLoader implementation

**Observed**: [ ]

---

## 📊 Success Criteria

### Must Pass (Critical)
- [ ] Sign-in flow completes without errors
- [ ] Post-auth lands on Roadmap tab (not chat)
- [ ] Multi-user data isolation works
- [ ] No redirect loops
- [ ] No 404 errors during auth
- [ ] Session persists across refreshes

### Should Pass (Important)
- [ ] Sign-out preserves data
- [ ] Direct URL navigation works
- [ ] Browser back button works
- [ ] Network delays handled gracefully

### Nice to Have
- [ ] Third-party cookie blocking handled
- [ ] Anonymous → authenticated migration (future)
- [ ] Error messages are helpful

---

## 🚨 Rollback Conditions

If ANY of these occur, immediately disable Clerk:

- [ ] Users locked out of app
- [ ] Data loss or corruption
- [ ] Infinite redirect loops in production
- [ ] Sign-in fails for > 50% of test attempts
- [ ] Critical functionality broken

**Rollback Command**:
```typescript
// src/main.tsx
const ENABLE_CLERK = false;
```

---

## 📝 Test Results Summary

**Tester**: [Your Name]  
**Date Tested**: [Date]  
**Total Tests**: 24  
**Passed**: ___  
**Failed**: ___  
**Blocked**: ___  

**Overall Status**: ⬜ PASS / ⬜ FAIL / ⬜ NEEDS WORK

**Notes**:
```
[Add any observations, bugs found, or improvements needed]
```

---

## ✅ Next Steps After Testing

If all tests pass:
- [ ] Document any workarounds needed
- [ ] Create list of Clerk Dashboard settings
- [ ] Plan Phase 3: Staging deployment
- [ ] Update CLERK_REINTRODUCTION_PLAN.md with findings

If tests fail:
- [ ] Document specific failures
- [ ] Identify root causes
- [ ] Create fix plan
- [ ] Retest after fixes
- [ ] Consider if Clerk is viable for this app
