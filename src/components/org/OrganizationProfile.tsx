import React from 'react';
import { OrganizationProfile as ClerkOrgProfile } from '@clerk/clerk-react';

/**
 * OrganizationProfile Component
 * 
 * Manages organization settings, members, and invitations.
 * Allows admins to invite team members and assign roles.
 */
export function OrganizationProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-surface-950 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-100 mb-3">
            Organization Settings
          </h1>
          <p className="text-lg text-surface-300">
            Manage your team, invite members, and configure settings
          </p>
        </div>

        {/* Clerk Organization Profile Component */}
        <div className="bg-surface-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-surface-700/50 p-8">
          <ClerkOrgProfile
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-primary-100 text-2xl',
                headerSubtitle: 'text-surface-300',
                navbar: 'bg-surface-800 border-surface-600',
                navbarButton: 'text-surface-300 hover:text-primary-400 hover:bg-surface-700',
                navbarButtonActive: 'text-primary-400 bg-surface-700',
                pageScrollBox: 'bg-transparent',
                formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
                formFieldInput: 'bg-surface-800 border-surface-600 text-surface-100',
                formFieldLabel: 'text-surface-200',
                memberListButton: 'bg-surface-800 hover:bg-surface-700 text-surface-100',
                badge: 'bg-primary-600 text-white',
                table: 'border-surface-700',
                tableHead: 'bg-surface-800 text-surface-200',
                tableBody: 'text-surface-300',
              },
            }}
          />
        </div>

        {/* Role Descriptions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-900/60 backdrop-blur-sm rounded-xl p-4 border border-surface-700/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">ADMIN</span>
            </div>
            <p className="text-surface-400 text-sm">
              Full access: Manage team, settings, and all portfolios. Can invite members and assign roles.
            </p>
          </div>
          <div className="bg-surface-900/60 backdrop-blur-sm rounded-xl p-4 border border-surface-700/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">MANAGER</span>
            </div>
            <p className="text-surface-400 text-sm">
              Can create, edit, and delete artists. Can view all analytics and export data. Cannot manage team.
            </p>
          </div>
          <div className="bg-surface-900/60 backdrop-blur-sm rounded-xl p-4 border border-surface-700/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-surface-600 text-white text-xs font-bold px-2 py-1 rounded">ANALYST</span>
            </div>
            <p className="text-surface-400 text-sm">
              View-only access: Can view portfolios and analytics. Cannot create, edit, or delete artists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
