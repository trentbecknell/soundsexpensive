import React, { useState, useEffect } from 'react';
import { voiceManager, VoiceSettings } from '../lib/voiceManager';

interface VoiceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceSettingsModal({ isOpen, onClose }: VoiceSettingsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    speechRate: 0.9,
    speechPitch: 1.2,
    speechVolume: 0.8,
    voiceIndex: 0,
    language: 'en-US'
  });
  const [isTestSpeaking, setIsTestSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVoices(voiceManager.getAvailableVoices());
    }
  }, [isOpen]);

  const handleSettingChange = (key: keyof VoiceSettings, value: number | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    voiceManager.updateVoiceSettings(newSettings);
  };

  const testVoice = async () => {
    setIsTestSpeaking(true);
    try {
      await voiceManager.speak("Hey gorgeous! This is how your diva mentor sounds. Isn't it fabulous?", settings);
    } catch (error) {
      console.error('Test voice error:', error);
    } finally {
      setIsTestSpeaking(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings: VoiceSettings = {
      speechRate: 0.9,
      speechPitch: 1.2,
      speechVolume: 0.8,
      voiceIndex: 0,
      language: 'en-US'
    };
    setSettings(defaultSettings);
    voiceManager.updateVoiceSettings(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-800 rounded-2xl border border-surface-700 max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-surface-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-100 flex items-center gap-2">
              🎤 Voice Settings
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-surface-400 hover:text-surface-200 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-surface-400 mt-2">
            Customize your diva's voice to match your vibe
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-3">
              Voice Character
            </label>
            <select
              value={settings.voiceIndex}
              onChange={(e) => handleSettingChange('voiceIndex', parseInt(e.target.value))}
              className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-surface-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              {voices.map((voice, index) => (
                <option key={index} value={index}>
                  {voice.name} ({voice.lang})
                  {voice.name.toLowerCase().includes('female') || 
                   voice.name.toLowerCase().includes('woman') ? ' 👑' : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-surface-500 mt-1">
              👑 indicates recommended diva voices
            </p>
          </div>

          {/* Speech Rate */}
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-3">
              Speech Rate: {settings.speechRate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.speechRate}
              onChange={(e) => handleSettingChange('speechRate', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-surface-500 mt-1">
              <span>Slow & Dramatic</span>
              <span>Quick & Energetic</span>
            </div>
          </div>

          {/* Speech Pitch */}
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-3">
              Voice Pitch: {settings.speechPitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.speechPitch}
              onChange={(e) => handleSettingChange('speechPitch', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-surface-500 mt-1">
              <span>Deep & Sultry</span>
              <span>High & Bright</span>
            </div>
          </div>

          {/* Speech Volume */}
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-3">
              Volume: {Math.round(settings.speechVolume * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.speechVolume}
              onChange={(e) => handleSettingChange('speechVolume', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-3">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-surface-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="en-AU">English (AU)</option>
              <option value="fr-FR">French</option>
              <option value="es-ES">Spanish</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-700 bg-surface-800/50">
          <div className="flex gap-3">
            <button
              onClick={testVoice}
              disabled={isTestSpeaking}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isTestSpeaking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Speaking...
                </>
              ) : (
                <>
                  🎤 Test Voice
                </>
              )}
            </button>
            
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-surface-700 hover:bg-surface-600 text-surface-200 rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}