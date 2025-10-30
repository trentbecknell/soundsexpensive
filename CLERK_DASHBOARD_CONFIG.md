# Clerk Dashboard Configuration for Phase 2 Testing

## Required Settings

### Application Settings

**Application Name**: Artist Roadmap  
**Environment**: Development

### Allowed Redirect URLs

Add these URLs to your Clerk Dashboard:

```
Development URLs (localhost):
http://localhost:5173
http://localhost:5173/soundsexpensive
http://localhost:5173/soundsexpensive/
http://localhost:5173/soundsexpensive/#/
http://localhost:5173/soundsexpensive/#/sign-in
http://localhost:5173/soundsexpensive/#/sign-up
```

### Allowed Origins

```
http://localhost:5173
```

### Sign-in/Sign-up Settings

- **Email/Password**: ✅ Enabled
- **Email Verification**: Optional (can disable for testing)
- **Social Logins**: Optional (Google, GitHub for faster testing)

### Session Settings

- **Session Lifetime**: Default (7 days)
- **Multi-Session**: Enabled (for testing multiple users)

---

## How to Configure

1. Go to: https://dashboard.clerk.com
2. Select your application: "Artist Roadmap"
3. Navigate to: **Paths** → **Component paths**
4. Set:
   - Sign-in path: `/sign-in`
   - Sign-up path: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

5. Navigate to: **Paths** → **Redirect URLs**
6. Add all localhost URLs listed above

7. Navigate to: **Settings** → **Restrictions**
8. Ensure "Allow multiple sessions" is **enabled**

---

## Test Accounts

Create these test accounts for multi-user testing:

**User A**:
- Email: test1@example.com (or your test email)
- Password: TestPassword123!

**User B**:
- Email: test2@example.com (or another test email)
- Password: TestPassword123!

---

## Verification

After configuring, verify in Clerk Dashboard:

1. **Paths** tab shows correct routes
2. **Redirect URLs** includes all localhost variants
3. **Email/Password** authentication enabled
4. **Multi-session** enabled

---

## Next Step

Once Clerk Dashboard is configured, open:

🌐 **http://localhost:5173/soundsexpensive/**

You should see:
- Redirect to sign-in page
- Clerk sign-in component loads
- No console errors

If you see errors, check:
1. Publishable key in `.env.local` is correct
2. Redirect URLs match exactly
3. Console for specific error messages
