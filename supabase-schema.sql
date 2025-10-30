-- Artist Roadmap Database Schema for Supabase
-- Run this in your Supabase SQL Editor to create the database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Portfolios table - one per user or organization
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL, -- Clerk user ID
  org_id TEXT, -- Clerk organization ID (null for personal portfolios)
  active_artist_id UUID, -- Currently selected artist
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one portfolio per user or per organization
  UNIQUE(user_id, org_id)
);

-- Artists table - individual artist records in a portfolio
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL, -- All artist data (profile, assessment, budget, tasks, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL, -- Clerk user ID who created
  updated_by TEXT NOT NULL -- Clerk user ID who last updated
);

-- Indexes for faster queries on artists table
CREATE INDEX IF NOT EXISTS idx_artists_portfolio_id ON artists(portfolio_id);

-- Activity log table - track all changes for team collaboration
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Clerk user ID
  user_name TEXT NOT NULL, -- User's display name
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted'
  entity_type TEXT NOT NULL, -- 'artist', 'budget', 'task', etc.
  entity_id TEXT NOT NULL, -- ID of the entity affected
  entity_name TEXT NOT NULL, -- Name of the entity for display
  details JSONB, -- Additional details about the change
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_org_id ON portfolios(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_portfolio_id ON activity_log(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Portfolios policies
-- Users can see their own personal portfolios
CREATE POLICY "Users can view own portfolios"
  ON portfolios FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can create their own portfolios
CREATE POLICY "Users can create own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own portfolios
CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Users can delete their own portfolios
CREATE POLICY "Users can delete own portfolios"
  ON portfolios FOR DELETE
  USING (auth.uid()::text = user_id);

-- Artists policies
-- Users can view artists in their portfolios
CREATE POLICY "Users can view artists in their portfolios"
  ON artists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = artists.portfolio_id
      AND portfolios.user_id = auth.uid()::text
    )
  );

-- Users can create artists in their portfolios
CREATE POLICY "Users can create artists in their portfolios"
  ON artists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = artists.portfolio_id
      AND portfolios.user_id = auth.uid()::text
    )
  );

-- Users can update artists in their portfolios
CREATE POLICY "Users can update artists in their portfolios"
  ON artists FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = artists.portfolio_id
      AND portfolios.user_id = auth.uid()::text
    )
  );

-- Users can delete artists in their portfolios
CREATE POLICY "Users can delete artists in their portfolios"
  ON artists FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = artists.portfolio_id
      AND portfolios.user_id = auth.uid()::text
    )
  );

-- Activity log policies
-- Users can view activity in their portfolios
CREATE POLICY "Users can view activity in their portfolios"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = activity_log.portfolio_id
      AND portfolios.user_id = auth.uid()::text
    )
  );

-- Users can create activity logs in their portfolios
CREATE POLICY "Users can create activity in their portfolios"
  ON activity_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = activity_log.portfolio_id
      AND portfolios.user_id = auth.uid()::text
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on portfolios
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on artists
CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Copy your Supabase URL and anon key';
  RAISE NOTICE '2. Add them to your .env.local file';
  RAISE NOTICE '3. Restart your dev server';
END $$;
