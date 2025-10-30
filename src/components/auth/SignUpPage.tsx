import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-studio p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-surface-50 mb-2">
            Artist Roadmap <span className="text-primary-400">PRO</span>
          </h1>
          <p className="text-surface-300">
            Join music industry professionals managing their rosters
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-surface-900 border border-surface-700 shadow-2xl',
                headerTitle: 'text-surface-50',
                headerSubtitle: 'text-surface-300',
                socialButtonsBlockButton: 'bg-surface-800 border-surface-700 text-surface-100 hover:bg-surface-700',
                formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
                formFieldInput: 'bg-surface-800 border-surface-700 text-surface-50',
                formFieldLabel: 'text-surface-200',
                footerActionLink: 'text-primary-400 hover:text-primary-300',
                identityPreviewText: 'text-surface-200',
                identityPreviewEditButton: 'text-primary-400',
              },
            }}
            routing="hash"
            signInUrl="/sign-in"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          />
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-900/50 border border-surface-700">
            <div className="text-green-400 mt-0.5">✓</div>
            <div className="text-sm text-surface-200">
              <div className="font-medium">Free Forever</div>
              <div className="text-xs text-surface-400 mt-0.5">
                Manage up to 20 artists, 3 team members
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-900/50 border border-surface-700">
            <div className="text-green-400 mt-0.5">✓</div>
            <div className="text-sm text-surface-200">
              <div className="font-medium">Cloud Sync</div>
              <div className="text-xs text-surface-400 mt-0.5">
                Access your portfolio from any device
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-900/50 border border-surface-700">
            <div className="text-green-400 mt-0.5">✓</div>
            <div className="text-sm text-surface-200">
              <div className="font-medium">Team Collaboration</div>
              <div className="text-xs text-surface-400 mt-0.5">
                Invite colleagues to your label workspace
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-surface-400">
          <p>
            By signing up, you agree to our{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
