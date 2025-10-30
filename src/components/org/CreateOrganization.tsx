import React from 'react';
import { CreateOrganization as ClerkCreateOrg } from '@clerk/clerk-react';

/**
 * CreateOrganization Component
 * 
 * Allows users to create a new organization (label/team).
 * Wraps Clerk's CreateOrganization with custom theming.
 */
export function CreateOrganization() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-surface-950 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-100 mb-3">
            Create Your Organization
          </h1>
          <p className="text-lg text-surface-300">
            Set up your label or team workspace to collaborate with your A&R staff
          </p>
        </div>

        {/* Clerk Create Organization Component */}
        <div className="bg-surface-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-surface-700/50 p-8">
          <ClerkCreateOrg
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-primary-100 text-2xl',
                headerSubtitle: 'text-surface-300',
                formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
                formFieldInput: 'bg-surface-800 border-surface-600 text-surface-100',
                formFieldLabel: 'text-surface-200',
                identityPreviewText: 'text-surface-200',
                identityPreviewEditButton: 'text-primary-400 hover:text-primary-300',
              },
            }}
            skipInvitationScreen={false}
          />
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-900/60 backdrop-blur-sm rounded-xl p-4 border border-surface-700/30">
            <div className="text-primary-400 text-2xl mb-2">👥</div>
            <h3 className="text-surface-100 font-semibold mb-1">Team Collaboration</h3>
            <p className="text-surface-400 text-sm">
              Invite A&R staff, managers, and analysts to collaborate on your roster
            </p>
          </div>
          <div className="bg-surface-900/60 backdrop-blur-sm rounded-xl p-4 border border-surface-700/30">
            <div className="text-primary-400 text-2xl mb-2">🎯</div>
            <h3 className="text-surface-100 font-semibold mb-1">Role-Based Access</h3>
            <p className="text-surface-400 text-sm">
              Admin, Manager, and Analyst roles with different permission levels
            </p>
          </div>
          <div className="bg-surface-900/60 backdrop-blur-sm rounded-xl p-4 border border-surface-700/30">
            <div className="text-primary-400 text-2xl mb-2">📊</div>
            <h3 className="text-surface-100 font-semibold mb-1">Shared Portfolio</h3>
            <p className="text-surface-400 text-sm">
              Manage up to 50 artists together with team analytics and insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
