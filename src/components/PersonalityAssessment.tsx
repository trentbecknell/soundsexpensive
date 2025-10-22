import React, { useState } from 'react';
import type { 
  ArtistPersonalityTraits, 
  ArtistMaturityLevel,
  SonicProfile,
  ArtistProfile 
} from '../lib/artistProfiling';

// Questions mapped to personality dimensions
const PERSONALITY_QUESTIONS = [
  {
    dimension: 'experimentalness',
    text: 'How do you feel about experimenting with unconventional sounds or techniques?',
    options: [
      { value: 1, text: 'I prefer proven, traditional approaches' },
      { value: 3, text: 'I mix traditional with some new elements' },
      { value: 5, text: 'I constantly push boundaries and experiment' }
    ]
  },
  {
    dimension: 'genreFluidity',
    text: 'How do you approach different music genres?',
    options: [
      { value: 1, text: 'I stay focused on my core genre' },
      { value: 3, text: 'I occasionally blend different styles' },
      { value: 5, text: 'I freely mix multiple genres' }
    ]
  },
  // Add more questions for each personality dimension
];

// Sonic preference questions
const SONIC_QUESTIONS = [
  {
    dimension: 'energy',
    text: 'What energy level best describes your ideal sound?',
    options: [
      { value: 0.2, text: 'Calm and meditative' },
      { value: 0.5, text: 'Balanced and dynamic' },
      { value: 0.8, text: 'High energy and intense' }
    ]
  },
  // Add more questions for each sonic dimension
];

interface Props {
  onComplete: (profile: ArtistProfile) => void;
}

export default function PersonalityAssessment({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [textResponses, setTextResponses] = useState<string[]>([]);

  // Open-ended questions for NLP analysis
  const TEXT_PROMPTS = [
    "Describe your ideal musical journey and where you see yourself in 5 years.",
    "What emotions do you most want to evoke in your listeners?",
    "Who are your top 3 musical influences and why?",
    "Describe your creative process when writing/producing music."
  ];

  const handleAnswer = (dimension: string, value: number) => {
    setAnswers(prev => ({ ...prev, [dimension]: value }));
  };

  const handleTextResponse = (index: number, text: string) => {
    const newResponses = [...textResponses];
    newResponses[index] = text;
    setTextResponses(newResponses);
  };

  const generateProfile = () => {
    // TODO: Implement profile generation based on answers
    const profile: ArtistProfile = {
      personality: {} as ArtistPersonalityTraits,
      maturity: {} as ArtistMaturityLevel,
      sonics: {} as SonicProfile,
      primaryGenres: [],
      secondaryGenres: [],
      keyInfluences: [],
      targetAudience: {
        demographics: [],
        psychographics: [],
        platforms: []
      }
    };
    onComplete(profile);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <div className="h-2 bg-surface-700 rounded-full">
          <div 
            className="h-2 bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / (PERSONALITY_QUESTIONS.length + TEXT_PROMPTS.length)) * 100}%` }}
          />
        </div>
      </div>

      {step < PERSONALITY_QUESTIONS.length ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{PERSONALITY_QUESTIONS[step].text}</h3>
          <div className="grid gap-3">
            {PERSONALITY_QUESTIONS[step].options.map(option => (
              <button
                key={option.value}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  answers[PERSONALITY_QUESTIONS[step].dimension] === option.value
                    ? 'border-primary-500 bg-primary-900/50'
                    : 'border-surface-700 hover:border-primary-500'
                }`}
                onClick={() => handleAnswer(PERSONALITY_QUESTIONS[step].dimension, option.value)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : step < PERSONALITY_QUESTIONS.length + TEXT_PROMPTS.length ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{TEXT_PROMPTS[step - PERSONALITY_QUESTIONS.length]}</h3>
          <textarea
            className="w-full h-32 rounded-lg bg-surface-800 p-3 resize-none"
            value={textResponses[step - PERSONALITY_QUESTIONS.length] || ''}
            onChange={e => handleTextResponse(step - PERSONALITY_QUESTIONS.length, e.target.value)}
            placeholder="Share your thoughts..."
          />
        </div>
      ) : null}

      <div className="flex justify-between">
        <button
          className="px-4 py-2 rounded-lg border border-surface-700 hover:border-primary-500"
          onClick={() => setStep(prev => Math.max(0, prev - 1))}
          disabled={step === 0}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500"
          onClick={() => {
            if (step < PERSONALITY_QUESTIONS.length + TEXT_PROMPTS.length - 1) {
              setStep(prev => prev + 1);
            } else {
              generateProfile();
            }
          }}
        >
          {step < PERSONALITY_QUESTIONS.length + TEXT_PROMPTS.length - 1 ? 'Next' : 'Complete'}
        </button>
      </div>
    </div>
  );
}