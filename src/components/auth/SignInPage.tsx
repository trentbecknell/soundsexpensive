import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-studio p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-surface-50 mb-2">
            Artist Roadmap <span className="text-primary-400">PRO</span>
          </h1>
          <p className="text-surface-300">
            Professional A&R tools for music industry professionals
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn
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
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          />
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-surface-900/50 border border-surface-700">
            <div className="text-2xl mb-2">🎵</div>
            <div className="text-sm font-medium text-surface-200">Multi-Artist</div>
            <div className="text-xs text-surface-400 mt-1">Manage 20+ artists</div>
          </div>
          <div className="p-4 rounded-lg bg-surface-900/50 border border-surface-700">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium text-surface-200">Team Workspaces</div>
            <div className="text-xs text-surface-400 mt-1">Collaborate with A&R team</div>
          </div>
          <div className="p-4 rounded-lg bg-surface-900/50 border border-surface-700">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-surface-200">Analytics</div>
            <div className="text-xs text-surface-400 mt-1">Data-driven decisions</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-surface-400">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
