import React from 'react';
import { OrganizationList as ClerkOrgList } from '@clerk/clerk-react';

/**
 * OrganizationList Component
 * 
 * Shows all organizations the user belongs to and allows switching between them.
 * Also provides option to create a new organization.
 */
export function OrganizationList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-surface-950 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-100 mb-3">
            Your Organizations
          </h1>
          <p className="text-lg text-surface-300">
            Switch between your labels and teams
          </p>
        </div>

        {/* Clerk Organization List Component */}
        <div className="bg-surface-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-surface-700/50 p-8">
          <ClerkOrgList
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-primary-100 text-2xl',
                headerSubtitle: 'text-surface-300',
                organizationSwitcherTrigger: 'bg-surface-800 border-surface-600 text-surface-100 hover:bg-surface-700',
                organizationPreview: 'text-surface-200',
                organizationSwitcherPreviewButton: 'text-primary-400 hover:text-primary-300',
                formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
              },
            }}
            hidePersonal={false}
          />
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-surface-900/60 backdrop-blur-sm rounded-xl p-4 border border-surface-700/30">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="text-surface-100 font-semibold mb-1">Personal vs Organization</h3>
              <p className="text-surface-400 text-sm">
                Your personal account is for individual use. Organizations allow team collaboration with shared portfolios and role-based permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
