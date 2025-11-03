import React, { useEffect, useRef, useState } from 'react';
import { QUESTIONS, Key } from '../data/assessment-questions';
import { ASSESSMENT_PROMPTS } from '../data/assessment-prompts';
import Chat, { ChatMessage } from './Chat';

const uid = () => Math.random().toString(36).slice(2, 9);

export default function AssessmentWizard({ initialAnswers, onFinish, onCancel }: { initialAnswers: Record<Key, number>, onFinish: (answers: Record<Key, number>) => void, onCancel: () => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<Key, number>>(() => ({ ...initialAnswers }));
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const prompt = ASSESSMENT_PROMPTS[0];
    return [{ id: uid(), type: 'system', content: prompt.systemMessage }];
  });
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Update system message when moving to new question
  useEffect(() => {
    if (index < ASSESSMENT_PROMPTS.length) {
      const prompt = ASSESSMENT_PROMPTS[index];
      setMessages(prev => [...prev, { id: uid(), type: 'system', content: prompt.systemMessage }]);
    }
  }, [index]);

  const handleChat = (message: string) => {
    setMessages(prev => [...prev, { id: uid(), type: 'user', content: message }]);
  };

  // keyboard navigation: left/right for prev/next, Enter to finish on review
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!rootRef.current) return;
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(0, i-1));
      if (e.key === 'ArrowRight') setIndex(i => Math.min(QUESTIONS.length, i+1));
      if (e.key === 'Enter' && index === QUESTIONS.length) onFinish(answers);
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, answers, onFinish, onCancel]);

  const q = QUESTIONS[index];
  const isReview = index === QUESTIONS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="wizard-title" ref={rootRef}>
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} role="presentation" />
      <div className="relative w-full max-w-5xl rounded-2xl bg-surface-800 p-6" role="document">
        <h3 className="text-lg font-semibold mb-2 text-primary-100">Guided assessment</h3>
        <p className="text-sm text-surface-300 mb-4">Answer a few short prompts to help compute your maturity baseline. You can edit values later.</p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Assessment controls */}
          <div className="flex-1">
            {!isReview ? (
              <div className="mb-4">
                <div className="text-sm font-medium" id="wizard-title">{q.title}</div>
                <div className="text-xs text-surface-400 mb-2">{q.help}</div>
                <div className="flex items-center gap-4">
                  <input aria-label={`${q.title} score`} type="range" min={1} max={5} step={1} value={answers[q.key]} onChange={e => setAnswers(prev => ({...prev, [q.key]: parseInt(e.target.value)}))} className="w-full" />
                  <div className="w-12 text-center text-surface-100" aria-live="polite">{answers[q.key]}</div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="text-sm font-medium">Review your answers</div>
                <div className="mt-3 grid gap-2">
                  {QUESTIONS.map(q => (
                    <div key={q.key} className="flex items-center justify-between rounded p-2 bg-surface-700/40">
                      <div className="text-sm">{q.title}</div>
                      <div className="text-sm font-medium">{answers[q.key]} / 5</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-surface-400">Note: These values will be used as the baseline for the automated maturity calculation. You can tweak them later from the profile screen.</div>
              </div>
            )}
          </div>

          {/* Chat section */}
          <div className="w-full md:w-96">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Need help?</h4>
              <button
                onClick={() => setShowChat(!showChat)}
                className="text-xs px-2 py-1 rounded border border-surface-600 hover:bg-surface-700"
              >
                {showChat ? 'Hide chat' : 'Show chat'}
              </button>
            </div>
            {showChat && !isReview && (
              <div className="h-[400px] border border-surface-700 rounded-lg">
                <Chat
                  messages={messages}
                  onSendMessage={handleChat}
                  suggestions={ASSESSMENT_PROMPTS[Math.min(index, ASSESSMENT_PROMPTS.length - 1)].suggestions}
                  placeholder="Type your message..."
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <button className="rounded px-3 py-2 border border-surface-700 text-xs" onClick={() => setIndex(i => Math.max(0, i-1))} disabled={index === 0}>Prev</button>
            <button className="ml-2 rounded px-3 py-2 border border-primary-600 text-xs text-primary-100" onClick={() => setAnswers(prev => ({...prev, [QUESTIONS[Math.max(0, Math.min(QUESTIONS.length-1, index))].key]: Math.min(5, (prev[QUESTIONS[Math.max(0, Math.min(QUESTIONS.length-1, index))].key]||1)+1) }))}>+1</button>
          </div>
          <div>
            {!isReview ? (
              <button className="rounded px-3 py-2 bg-primary-600 text-xs text-primary-50" onClick={() => setIndex(i => Math.min(QUESTIONS.length, i+1))}>Next</button>
            ) : (
              <div className="flex gap-2">
                <button className="rounded px-3 py-2 border border-surface-700 text-xs" onClick={() => setIndex(QUESTIONS.length - 1)}>Back</button>
                <button className="rounded px-3 py-2 bg-accent-600 text-xs text-accent-50" onClick={() => onFinish(answers)}>Save & Finish</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}