# Supabase Setup Guide

This guide will help you set up Supabase for cloud data storage and real-time team collaboration.

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in (or create an account)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `artist-roadmap` (or your preferred name)
   - **Database Password**: Generate a strong password (save this somewhere safe)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free (sufficient for testing and small teams)
4. Click **"Create new project"**
5. Wait 2-3 minutes for project initialization

## Step 2: Run the Database Schema

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` from this repository
4. Paste it into the SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see success messages confirming tables were created

## Step 3: Get Your API Keys

1. In your Supabase project, click **"Project Settings"** (gear icon at bottom left)
2. Click **"API"** in the settings menu
3. Copy the following values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string starting with eyJ)

## Step 4: Configure Your App

1. Open your `.env.local` file (or create it if it doesn't exist)
2. Add your Supabase credentials:

```bash
# Clerk (already configured)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Supabase (add these)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

3. Save the file
4. Restart your dev server: `npm run dev`

## Step 5: Configure Row Level Security (RLS)

The schema automatically sets up RLS policies, but you need to configure authentication:

1. In Supabase, go to **Authentication** → **Providers**
2. Enable **"Custom"** provider (for Clerk integration)
3. Go to **SQL Editor** and run this query to link Clerk with Supabase:

```sql
-- Allow Clerk user IDs to work with Supabase RLS
-- This tells Supabase to trust the user_id from your app
CREATE OR REPLACE FUNCTION auth.uid() RETURNS TEXT AS $$
  SELECT current_setting('request.jwt.claims', true)::json->>'sub';
$$ LANGUAGE sql STABLE;
```

## Step 6: Test the Connection

1. Run your app: `npm run dev`
2. Sign in with your Clerk account
3. Open browser console (F12)
4. You should see: "Supabase connected successfully" (if configured)
5. Create or edit an artist - data should now save to cloud!

## Step 7: Deploy to Production

1. Add Supabase environment variables to GitHub Secrets:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

2. Your GitHub Actions workflow will automatically use these in production builds

## Data Migration

When you first sign in after Supabase setup:
- Your existing localStorage data will automatically migrate to the cloud
- All artists, budgets, and tasks will be preserved
- Activity log will show the migration event
- You can safely clear localStorage after successful migration

## Troubleshooting

### "Supabase not configured" warning
- Check that your `.env.local` file has the correct keys
- Restart your dev server after adding keys
- Verify keys are prefixed with `VITE_`

### "Failed to fetch" errors
- Check your Supabase Project URL is correct
- Verify your anon key is the full key (starts with `eyJ`)
- Check that RLS policies are enabled on all tables

### Data not saving
- Open browser console to see detailed error messages
- Verify you're signed in with Clerk
- Check that the SQL schema was run successfully
- Ensure RLS policies allow your user to insert/update

### Can't see team member's changes
- This will be implemented in Day 4 with real-time subscriptions
- For now, refresh the page to see latest data
- Activity log shows who made what changes

## Free Tier Limits

Supabase Free tier includes:
- **500 MB database space** (plenty for artist data)
- **5 GB bandwidth** per month
- **50,000 monthly active users**
- **2 GB file storage**
- Unlimited API requests

Perfect for testing and small label teams!

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check `DAY_3_PROGRESS.md` for implementation details
