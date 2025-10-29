import React, { useState, useCallback } from 'react';
import { analyzeMix, MIX_BENCHMARKS } from '../lib/mixAnalysis';
import type { MixAnalysisResult, DiagnosticIssue, MixingStage } from '../types/mixAnalysis';

interface MixAnalyzerProps {
  onAnalysisComplete?: (result: MixAnalysisResult) => void;
  className?: string;
}

export default function MixAnalyzer({ onAnalysisComplete, className = '' }: MixAnalyzerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetGenre, setTargetGenre] = useState<string>('Pop');
  const [mixingStage, setMixingStage] = useState<MixingStage>('not-sure');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MixAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableGenres = Object.keys(MIX_BENCHMARKS);
  
  const mixingStages: { value: MixingStage; label: string; description: string }[] = [
    { value: 'rough-mix', label: '🎚️ Rough Mix', description: 'Initial balance, basic levels' },
    { value: 'mixing', label: '🎛️ Active Mixing', description: 'EQ, compression, effects' },
    { value: 'mix-review', label: '✅ Mix Review', description: 'Near-final, refinement' },
    { value: 'pre-master', label: '🎯 Pre-Master', description: 'Final mix, ready for mastering' },
    { value: 'mastered', label: '✨ Mastered', description: 'After mastering' },
    { value: 'not-sure', label: '❓ Not Sure', description: 'Let us determine' },
  ];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate audio file
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/aac', 'audio/ogg', 'audio/flac'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|aac|ogg|flac|m4a)$/i)) {
      setError('Please upload a valid audio file (MP3, WAV, AAC, OGG, FLAC, M4A)');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await analyzeMix(selectedFile, targetGenre, mixingStage);
      setResult(analysisResult);
      onAnalysisComplete?.(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [selectedFile, targetGenre, mixingStage, onAnalysisComplete]);

  const getSeverityColor = (severity: DiagnosticIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'suggestion':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-lime-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.8) return 'bg-lime-500';
    if (score >= 0.7) return 'bg-yellow-500';
    if (score >= 0.6) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Section */}
      <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
        <h2 className="mb-4 text-lg font-semibold text-primary-100">Upload Your Mix</h2>
        
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-surface-300 mb-2">Target Genre</label>
              <select
                value={targetGenre}
                onChange={(e) => setTargetGenre(e.target.value)}
                className="w-full rounded-lg bg-surface-700/50 px-3 py-2 text-surface-100 focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-surface-400">
                Select your genre for accurate benchmarking
              </p>
            </div>

            <div>
              <label className="block text-sm text-surface-300 mb-2">Mixing Stage</label>
              <select
                value={mixingStage}
                onChange={(e) => setMixingStage(e.target.value as MixingStage)}
                className="w-full rounded-lg bg-surface-700/50 px-3 py-2 text-surface-100 focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                {mixingStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-surface-400">
                {mixingStages.find(s => s.value === mixingStage)?.description}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="audio-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-surface-600 rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-surface-700/30 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-12 h-12 mb-3 text-surface-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-surface-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-surface-400">
                  MP3, WAV, AAC, OGG, FLAC, M4A (Max 100MB)
                </p>
              </div>
              <input
                id="audio-upload"
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={handleFileSelect}
              />
            </label>

            {selectedFile && (
              <div className="mt-4 flex items-center justify-between bg-surface-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-200">{selectedFile.name}</p>
                    <p className="text-xs text-surface-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-surface-400 hover:text-surface-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || analyzing}
            className="w-full md:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-700 disabled:text-surface-500 disabled:cursor-not-allowed text-primary-50 rounded-lg font-medium transition-colors"
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              '🎵 Analyze Mix'
            )}
          </button>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <>
          {/* Overall Score */}
          <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-primary-100 mb-1">Analysis Complete</h2>
                <p className="text-sm text-surface-400">
                  {result.file_info.name} • {result.benchmarks_used.genre}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                  <span className="text-xs text-blue-300">
                    {mixingStages.find(s => s.value === result.mixing_stage)?.label || result.mixing_stage}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(result.score.overall)}`}>
                  {result.score.overall}
                </div>
                <div className="text-sm text-surface-400 mt-1">Overall Score</div>
              </div>
            </div>

            <div className="bg-surface-900/50 rounded-xl p-4">
              <p className="text-sm text-surface-200 leading-relaxed">{result.overall_assessment}</p>
            </div>
          </section>

          {/* Score Breakdown */}
          <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-primary-100 mb-4">Score Breakdown</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(result.score.breakdown).map(([category, score]) => (
                <div key={category} className="bg-surface-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-surface-300 capitalize">
                      {category.replace('_', ' ')}
                    </span>
                    <span className={`text-lg font-semibold ${getScoreColor(score * 100)}`}>
                      {Math.round(score * 100)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getScoreBarColor(score)}`}
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <section className="rounded-2xl border border-green-700/50 bg-green-900/20 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-green-100 mb-4">✨ Strengths</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {result.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-green-200">
                    <span className="mt-0.5">•</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Stage-Appropriate Tips */}
          {result.stage_appropriate_tips.length > 0 && (
            <section className="rounded-2xl border border-blue-700/50 bg-blue-900/20 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-blue-100 mb-4">
                💡 Tips for {mixingStages.find(s => s.value === result.mixing_stage)?.label || 'Your Stage'}
              </h3>
              <div className="space-y-2">
                {result.stage_appropriate_tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-blue-200">
                    <span className="text-blue-400 font-semibold flex-shrink-0">{idx + 1}.</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Issues */}
          {result.issues.length > 0 && (
            <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">
                🔍 Diagnostic Issues ({result.issues.length})
              </h3>
              <div className="space-y-4">
                {result.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-xl p-4 ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold mb-1">{issue.title}</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 bg-surface-800/50 rounded capitalize">
                            {issue.severity}
                          </span>
                          <span className="px-2 py-0.5 bg-surface-800/50 rounded capitalize">
                            {issue.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm mb-3 opacity-90">{issue.description}</p>

                    <div className="grid md:grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-surface-800/50 rounded px-3 py-2">
                        <span className="opacity-70">Current: </span>
                        <span className="font-medium">{issue.current_value}</span>
                      </div>
                      {issue.target_value && (
                        <div className="bg-surface-800/50 rounded px-3 py-2">
                          <span className="opacity-70">Target: </span>
                          <span className="font-medium">{issue.target_value}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 mb-3">
                      <p className="text-xs font-medium opacity-70">Recommendations:</p>
                      <ul className="text-xs space-y-1">
                        {issue.recommendations.map((rec, ridx) => (
                          <li key={ridx} className="flex items-start gap-2">
                            <span className="mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {issue.technical_details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer opacity-70 hover:opacity-100">
                          Technical Details
                        </summary>
                        <p className="mt-2 opacity-80">{issue.technical_details}</p>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Next Steps */}
          <section className="rounded-2xl border border-primary-700 bg-primary-900/20 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-primary-100 mb-4">🎯 Next Steps</h3>
            <div className="space-y-2">
              {result.next_steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-surface-200">
                  <span className="text-primary-400 font-semibold">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Reference Tracks */}
          {result.similar_reference_tracks && result.similar_reference_tracks.length > 0 && (
            <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">
                🎧 Reference Tracks for {result.benchmarks_used.genre}
              </h3>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {result.similar_reference_tracks.map((track, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-700/50 rounded-lg px-4 py-3 text-sm text-surface-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                    <span>{track}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-surface-400">
                A/B compare your mix with these tracks to identify differences in loudness, frequency balance, and stereo width.
              </p>
            </section>
          )}

          {/* Audio Features (Technical Details) */}
          <details className="rounded-2xl border border-surface-700 bg-surface-800/80 backdrop-blur">
            <summary className="cursor-pointer p-6 hover:bg-surface-700/30 transition-colors">
              <span className="text-lg font-semibold text-primary-100">📊 Technical Analysis Data</span>
            </summary>
            <div className="px-6 pb-6 space-y-4">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-sm">
                <div className="bg-surface-900/50 rounded p-3">
                  <span className="text-surface-400">Tempo:</span>
                  <span className="ml-2 text-surface-200 font-medium">
                    {Math.round(result.audio_features.tempo_bpm)} BPM
                  </span>
                </div>
                <div className="bg-surface-900/50 rounded p-3">
                  <span className="text-surface-400">Loudness:</span>
                  <span className="ml-2 text-surface-200 font-medium">
                    {result.audio_features.loudness_db.toFixed(1)} LUFS
                  </span>
                </div>
                <div className="bg-surface-900/50 rounded p-3">
                  <span className="text-surface-400">Dynamic Range:</span>
                  <span className="ml-2 text-surface-200 font-medium">
                    {result.audio_features.dynamic_range_db?.toFixed(1)} dB
                  </span>
                </div>
                <div className="bg-surface-900/50 rounded p-3">
                  <span className="text-surface-400">Stereo Width:</span>
                  <span className="ml-2 text-surface-200 font-medium">
                    {((result.audio_features.stereo_width || 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="bg-surface-900/50 rounded p-3">
                  <span className="text-surface-400">Duration:</span>
                  <span className="ml-2 text-surface-200 font-medium">
                    {Math.floor(result.audio_features.duration_seconds / 60)}:
                    {String(Math.floor(result.audio_features.duration_seconds % 60)).padStart(2, '0')}
                  </span>
                </div>
                <div className="bg-surface-900/50 rounded p-3">
                  <span className="text-surface-400">Energy:</span>
                  <span className="ml-2 text-surface-200 font-medium">
                    {(result.audio_features.energy * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
