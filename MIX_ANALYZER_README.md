# Mix Analyzer 🎚️

Professional audio mix diagnostics tool that analyzes your music and provides genre-specific feedback based on industry benchmarks.

## Overview

The Mix Analyzer is a comprehensive diagnostic tool that helps artists, producers, and engineers evaluate their mixes against professional industry standards. Upload your audio file and receive detailed feedback on:

- **Loudness Analysis** - LUFS measurements vs. streaming platform standards
- **Dynamic Range** - Compression and punch assessment
- **Frequency Balance** - Full spectrum analysis (sub-bass to brilliance)
- **Stereo Imaging** - Width, mono compatibility, and spatial characteristics
- **Genre Alignment** - How well your mix fits genre conventions
- **Commercial Readiness** - Overall professional quality assessment

## Features

### 🎯 Genre-Specific Benchmarks

Analyzes your mix against industry standards for:
- R&B
- Pop
- Hip Hop
- Electronic
- Alternative

Each genre has unique target ranges for tempo, energy, loudness, and frequency balance based on top-performing commercial releases.

### 📊 Comprehensive Scoring

Receive an overall score (0-100) plus detailed breakdowns for:
- Loudness quality
- Dynamic range
- Frequency balance
- Stereo imaging
- Genre alignment
- Commercial readiness

### 🔍 Diagnostic Issues

Get categorized feedback with severity levels:
- **Critical** - Issues that need immediate attention
- **Warning** - Problems that impact quality
- **Suggestion** - Optimization opportunities

Each issue includes:
- Clear description of the problem
- Current vs. target values
- Specific recommendations
- Technical details for deeper understanding

### ✨ Strengths Identification

Not just problems - we highlight what's working well in your mix so you know what to preserve.

### 🎧 Reference Tracks

Get a curated list of commercial reference tracks that match your genre for A/B comparison.

### 📈 Detailed Metrics

Technical analysis includes:
- Tempo (BPM)
- Loudness (LUFS)
- Dynamic range (dB)
- Stereo width (%)
- Frequency balance across 7 bands
- Duration and structure analysis
- Energy and danceability scores

## How It Works

### 1. Analysis Process

```typescript
import { analyzeMix } from './lib/mixAnalysis';

// Analyze an audio file
const result = await analyzeMix(audioFile, 'Pop');

// Result includes:
// - audio_features: Technical measurements
// - score: Overall and breakdown scores
// - issues: Diagnostic problems found
// - strengths: What's working well
// - next_steps: Prioritized action items
```

### 2. Benchmark Comparison

The tool compares your mix against genre-specific targets:

```typescript
// Example Pop benchmarks
{
  tempo_bpm: [90, 130],
  danceability: [0.5, 0.9],
  energy: [0.5, 0.9],
  loudness_db: [-6, -4],
  dynamic_range_db: [5, 9],
  stereo_width: [0.7, 0.95]
}
```

### 3. Issue Generation

Automatically identifies problems like:
- Mix too quiet or over-compressed
- Limited dynamic range
- Weak low end or excessive bass
- Narrow stereo image
- Tempo outside genre norms
- Unusual song structure/duration

### 4. Recommendation Engine

Provides actionable advice:
- "Reduce compression on individual tracks"
- "Use high-pass filters on non-bass elements"
- "Add subtle high-shelf boost (8-12 kHz)"
- "Increase overall gain during mastering"

## Usage

### As Part of Artist Roadmap

1. Navigate to the **Mix Analyzer** tab
2. Select your target genre
3. Upload your audio file (MP3, WAV, AAC, OGG, FLAC, M4A)
4. Click "Analyze Mix"
5. Review results and apply recommendations

### As Standalone Tool

Access directly via `mix-analyzer.html`:

```bash
npm run dev
# Navigate to http://localhost:5173/mix-analyzer.html
```

### Programmatic Usage

```typescript
import { 
  analyzeMix, 
  getBenchmarksForGenre,
  calculateMixScore 
} from './lib/mixAnalysis';

// Get benchmarks
const benchmarks = getBenchmarksForGenre('R&B');

// Analyze file
const result = await analyzeMix(file, 'R&B');

// Custom analysis
const features = await analyzeAudioFile(file);
const score = calculateMixScore(features, benchmarks);
```

## Technical Implementation

### Audio Feature Extraction

Currently uses mock analysis for demo purposes. In production, implement using:

**Client-side:**
- Web Audio API for real-time analysis
- `AudioContext` for frequency analysis
- `AnalyserNode` for spectrum data

**Server-side (recommended):**
- FFmpeg for audio processing
- Librosa (Python) for advanced analysis
- Essentia (C++/Python) for music information retrieval
- Commercial APIs like Spotify Audio Features

### Key Algorithms

**Loudness Scoring:**
```typescript
function scoreLoudness(features, benchmarks) {
  const [min, max] = benchmarks.loudness_db;
  const ideal = (min + max) / 2;
  const deviation = Math.abs(features.loudness_db - ideal);
  return Math.max(0, 1 - deviation / tolerance);
}
```

**Frequency Balance:**
- 7-band analysis: sub-bass, bass, low-mid, mid, high-mid, presence, brilliance
- Variance calculation to detect imbalances
- Genre-specific target ranges

**Dynamic Range:**
- Peak-to-RMS ratio
- Crest factor analysis
- Genre-appropriate compression levels

## File Structure

```
src/
  lib/
    mixAnalysis.ts          # Core analysis engine
  types/
    mixAnalysis.ts          # TypeScript interfaces
  components/
    MixAnalyzer.tsx         # React UI component
  mix-analyzer.tsx          # Standalone entry point
mix-analyzer.html           # Standalone HTML
```

## Extending the Tool

### Add New Genre

```typescript
// In lib/mixAnalysis.ts
MIX_BENCHMARKS['Your Genre'] = {
  genre: 'Your Genre',
  tempo_bpm: [min, max],
  danceability: [min, max],
  // ... other parameters
  reference_tracks: ['Artist - Song', ...]
};
```

### Custom Diagnostic Rules

```typescript
// Add to generateDiagnostics()
if (features.your_metric > threshold) {
  issues.push({
    category: 'your_category',
    severity: 'warning',
    title: 'Your Issue Title',
    description: 'Detailed description',
    recommendations: [
      'Specific action 1',
      'Specific action 2'
    ]
  });
}
```

### Integrate Real Audio Analysis

Replace mock `analyzeAudioFile()` with Web Audio API:

```typescript
async function analyzeAudioFile(file: File): Promise<AudioFeatures> {
  const audioContext = new AudioContext();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Extract features using Web Audio API
  // ... implementation
  
  return features;
}
```

## Best Practices

### For Users

1. **Export Properly** - Use high-quality exports (WAV or 320kbps MP3)
2. **Choose Correct Genre** - Accurate genre selection improves analysis
3. **A/B Reference** - Compare with reference tracks manually
4. **Iterate** - Analyze, improve, re-analyze
5. **Take Breaks** - Fresh ears are critical

### For Developers

1. **Validate Input** - Check file type and size
2. **Handle Errors** - Graceful degradation for unsupported formats
3. **Optimize Performance** - Audio analysis can be CPU-intensive
4. **Cache Results** - Consider caching analysis results
5. **User Privacy** - Process audio client-side when possible

## Limitations

**Current Implementation:**
- Mock audio analysis (for demo purposes)
- Client-side processing only
- Limited to file formats supported by HTML5 Audio

**Recommended Improvements:**
- Implement actual audio analysis via Web Audio API
- Add backend processing for advanced features
- Support for batch analysis
- Historical tracking of mix versions
- Integration with DAW plugins
- AI-powered mixing suggestions

## Related Tools

Part of the Artist Roadmap suite:
- **Assessment Wizard** - Artist maturity evaluation
- **Grant Discovery** - Find funding opportunities
- **Project Roadmap** - Timeline and budget planning

## Resources

### Learning More About Mixing

- **Loudness:** Understanding LUFS and streaming normalization
- **Dynamics:** Compression, limiting, and transient design
- **EQ:** Frequency balance and masking
- **Stereo:** Width, correlation, and mono compatibility
- **Mastering:** Final polish for commercial release

### Industry Standards

- **Streaming Platforms:** -14 LUFS typical normalization
- **Dynamic Range:** 6-12 dB for most genres
- **Stereo Width:** 0.7-0.9 ideal for most music
- **Frequency Balance:** Genre-dependent targets

## Contributing

Contributions welcome! Focus areas:
- Real audio analysis implementation
- Additional genre benchmarks
- More diagnostic rules
- UI/UX improvements
- Performance optimizations

## License

Part of the Artist Roadmap project - see main LICENSE file.

---

**Ready to analyze your mix?** Upload your track and get professional feedback in seconds! 🎵
