# Clerk Authentication Setup Guide

## Step 1: Create Clerk Account

1. Go to https://dashboard.clerk.com/sign-up
2. Sign up with your email or GitHub
3. Create a new application:
   - Name: "Artist Roadmap PRO"
   - Type: "React"
   - Enable: Email, Google OAuth

## Step 2: Get Your API Keys

1. In Clerk Dashboard, go to "API Keys"
2. Copy your **Publishable Key** (starts with `pk_test_...`)
3. Create `.env.local` file in project root (gitignored)
4. Add:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

## Step 3: Configure Clerk Settings

### Authentication

1. Go to "User & Authentication" → "Email, Phone, Username"
2. Enable:
   - ✅ Email address (required)
   - ✅ Google (optional but recommended)
3. Set email verification: **Verify at sign-up**

### Sessions

1. Go to "Sessions"
2. Set session lifetime: **7 days** (inactive)
3. Set max lifetime: **30 days**

### Organizations (for Day 2)

1. Go to "Organizations"
2. Enable organizations: ✅
3. Set: "Anyone can create organizations"
4. Enable: "Members can leave"
5. Max members per org: **Unlimited**

### Paths

1. Go to "Paths"
2. Set paths:
   - Sign-in: `/sign-in`
   - Sign-up: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

## Step 4: Update .gitignore

Make sure `.env.local` is in `.gitignore`:

```
# Environment variables
.env
.env.local
.env.*.local
```

## Step 5: Restart Dev Server

```bash
npm run dev
```

Your Clerk keys will now be available in the app!

## Testing Authentication

Once setup is complete, you can test:

1. Visit http://localhost:5173
2. You should see sign-in page
3. Create an account
4. Verify email
5. You should be redirected to the app

## Troubleshooting

### "Clerk: Missing publishable key"
- Check that `.env.local` exists
- Check that variable starts with `VITE_`
- Restart dev server after creating `.env.local`

### "Invalid publishable key"
- Copy key exactly from Clerk Dashboard
- No spaces or extra characters
- Use `pk_test_...` for development

### "Redirect URL mismatch"
- Add `http://localhost:5173` to allowed redirect URLs in Clerk
- Also add `https://trentbecknell.github.io` for production

## Next Steps

After Clerk is set up:
- ✅ Day 1: Basic auth (sign-in/sign-up)
- ⏳ Day 2: Organizations (teams)
- ⏳ Day 3: Supabase (data storage)
- ⏳ Day 4: Roles (permissions)
- ⏳ Day 5: Polish (activity log, analytics)

## Support

- Clerk Docs: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
- React SDK: https://clerk.com/docs/references/react/overview
