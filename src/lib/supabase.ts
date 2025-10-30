import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase configuration. Cloud features will not work.');
  console.warn('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          org_id: string | null;
          active_artist_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          org_id?: string | null;
          active_artist_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          org_id?: string | null;
          active_artist_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      artists: {
        Row: {
          id: string;
          portfolio_id: string;
          name: string;
          data: any; // JSONB containing all artist data
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          name: string;
          data: any;
          created_at?: string;
          updated_at?: string;
          created_by: string;
          updated_by: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          name?: string;
          data?: any;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          updated_by?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          portfolio_id: string;
          user_id: string;
          user_name: string;
          action: string;
          entity_type: string;
          entity_id: string;
          entity_name: string;
          details: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          user_id: string;
          user_name: string;
          action: string;
          entity_type: string;
          entity_id: string;
          entity_name: string;
          details?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          user_id?: string;
          user_name?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          entity_name?: string;
          details?: any;
          created_at?: string;
        };
      };
    };
  };
}
