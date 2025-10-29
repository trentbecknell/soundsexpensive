import React from 'react';
import ReactDOM from 'react-dom/client';
import MixAnalyzer from './components/MixAnalyzer';
import './index.css';

function StandaloneMixAnalyzer() {
  return (
    <div className="min-h-screen w-full bg-surface-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-surface-50 mb-2">
            🎚️ Mix Analyzer
          </h1>
          <p className="text-surface-400 max-w-3xl">
            Professional audio mix diagnostics powered by genre-specific industry benchmarks. 
            Upload your mix to get instant feedback on loudness, dynamics, frequency balance, 
            stereo imaging, and more. Compare your sound against commercial reference tracks 
            and get actionable recommendations to improve your mix.
          </p>
        </header>

        <MixAnalyzer />

        <footer className="mt-12 pt-8 border-t border-surface-700">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-surface-200 mb-2">What We Analyze</h3>
              <ul className="text-sm text-surface-400 space-y-1">
                <li>• Loudness (LUFS) vs industry standards</li>
                <li>• Dynamic range and compression</li>
                <li>• Frequency balance across spectrum</li>
                <li>• Stereo width and imaging</li>
                <li>• Genre alignment and tempo</li>
                <li>• Commercial readiness</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-200 mb-2">Supported Formats</h3>
              <ul className="text-sm text-surface-400 space-y-1">
                <li>• MP3 (recommended: 320kbps)</li>
                <li>• WAV (uncompressed)</li>
                <li>• AAC / M4A</li>
                <li>• OGG Vorbis</li>
                <li>• FLAC (lossless)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-200 mb-2">How to Use</h3>
              <ul className="text-sm text-surface-400 space-y-1">
                <li>1. Select your target genre</li>
                <li>2. Upload your mixed audio file</li>
                <li>3. Review diagnostic feedback</li>
                <li>4. Apply recommendations</li>
                <li>5. Re-analyze to track progress</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-surface-500">
            <p>
              Part of the <a href="/" className="text-primary-400 hover:text-primary-300">Artist Roadmap</a> suite of tools for independent musicians
            </p>
            <p className="mt-2">
              💡 Tip: Reference your mix against 3-5 commercial tracks in your genre for best results
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StandaloneMixAnalyzer />
  </React.StrictMode>
);
