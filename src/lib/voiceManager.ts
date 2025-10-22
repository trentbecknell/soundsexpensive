// Voice interaction manager for speech-to-text and text-to-speech
export interface VoiceSettings {
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  voiceIndex: number;
  language: string;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class VoiceManager {
  private speechRecognition: any = null;
  private speechSynthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private isSupported: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  
  // Diva character voice settings
  private voiceSettings: VoiceSettings = {
    speechRate: 0.9,     // Slightly slower for dramatic effect
    speechPitch: 1.2,    // Higher pitch for diva personality
    speechVolume: 0.8,   // Confident volume
    voiceIndex: 0,       // Will be set to best female voice
    language: 'en-US'
  };

  // Callbacks for events
  private onTranscriptCallback?: (result: SpeechRecognitionResult) => void;
  private onListeningChangeCallback?: (isListening: boolean) => void;
  private onErrorCallback?: (error: string) => void;
  private onSpeakingChangeCallback?: (isSpeaking: boolean) => void;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
    this.initializeVoices();
  }

  private initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.maxAlternatives = 1;
    this.speechRecognition.lang = this.voiceSettings.language;

    // Event handlers
    this.speechRecognition.onstart = () => {
      this.isListening = true;
      this.onListeningChangeCallback?.(true);
    };

    this.speechRecognition.onend = () => {
      this.isListening = false;
      this.onListeningChangeCallback?.(false);
    };

    this.speechRecognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      const isFinal = result.isFinal;

      this.onTranscriptCallback?.({
        transcript: transcript.trim(),
        confidence,
        isFinal
      });
    };

    this.speechRecognition.onerror = (event: any) => {
      const errorMessage = this.getErrorMessage(event.error);
      this.onErrorCallback?.(errorMessage);
      this.isListening = false;
      this.onListeningChangeCallback?.(false);
    };

    this.isSupported = true;
  }

  private async initializeVoices() {
    // Wait for voices to load
    if (this.speechSynthesis.getVoices().length === 0) {
      await new Promise<void>(resolve => {
        this.speechSynthesis.onvoiceschanged = () => resolve();
      });
    }

    this.voices = this.speechSynthesis.getVoices();
    
    // Find the best diva voice (prefer female, English voices)
    const preferredVoices = this.voices.filter(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('victoria') ||
       voice.name.toLowerCase().includes('karen') ||
       voice.name.toLowerCase().includes('susan'))
    );

    if (preferredVoices.length > 0) {
      const bestVoice = preferredVoices.find(v => v.name.toLowerCase().includes('premium')) || preferredVoices[0];
      this.voiceSettings.voiceIndex = this.voices.indexOf(bestVoice);
    } else {
      // Fallback to any English female voice
      const englishVoices = this.voices.filter(voice => voice.lang.startsWith('en'));
      if (englishVoices.length > 0) {
        this.voiceSettings.voiceIndex = this.voices.indexOf(englishVoices[0]);
      }
    }
  }

  private getErrorMessage(error: string): string {
    switch (error) {
      case 'no-speech':
        return 'No speech detected. Try speaking closer to the microphone.';
      case 'audio-capture':
        return 'Microphone access denied or not available.';
      case 'not-allowed':
        return 'Microphone permission denied. Please allow microphone access.';
      case 'network':
        return 'Network error occurred during speech recognition.';
      case 'service-not-allowed':
        return 'Speech recognition service not allowed.';
      default:
        return `Speech recognition error: ${error}`;
    }
  }

  // Speech Recognition Methods
  startListening() {
    if (!this.isSupported || !this.speechRecognition) {
      this.onErrorCallback?.('Speech recognition not supported');
      return;
    }

    if (this.isListening) {
      return;
    }

    try {
      this.speechRecognition.start();
    } catch (error) {
      this.onErrorCallback?.('Failed to start speech recognition');
    }
  }

  stopListening() {
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  // Text-to-Speech Methods
  speak(text: string, options?: Partial<VoiceSettings>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any ongoing speech
      this.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const settings = { ...this.voiceSettings, ...options };

      // Apply voice settings
      utterance.rate = settings.speechRate;
      utterance.pitch = settings.speechPitch;
      utterance.volume = settings.speechVolume;
      utterance.lang = settings.language;

      // Set voice
      if (this.voices[settings.voiceIndex]) {
        utterance.voice = this.voices[settings.voiceIndex];
      }

      // Event handlers
      utterance.onstart = () => {
        this.onSpeakingChangeCallback?.(true);
      };

      utterance.onend = () => {
        this.onSpeakingChangeCallback?.(false);
        resolve();
      };

      utterance.onerror = (event) => {
        this.onSpeakingChangeCallback?.(false);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Add some diva flair to the text
      const divaText = this.addDivaInflection(text);
      utterance.text = divaText;

      this.speechSynthesis.speak(utterance);
    });
  }

  private addDivaInflection(text: string): string {
    // Add subtle pauses and emphasis for diva personality
    return text
      .replace(/\b(honey|darling|gorgeous|beautiful|stunning|amazing)\b/gi, '$1,') // Add pauses after endearments
      .replace(/!/g, '!') // Keep exclamations strong
      .replace(/\?/g, '?') // Keep questions clear
      .replace(/\.\.\./g, '... ') // Add space after ellipses
      .replace(/✨|💫|🌟|💎|🔥/g, ''); // Remove emojis for cleaner speech
  }

  stopSpeaking() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.onSpeakingChangeCallback?.(false);
    }
  }

  // Configuration Methods
  updateVoiceSettings(settings: Partial<VoiceSettings>) {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getCurrentVoice(): SpeechSynthesisVoice | null {
    return this.voices[this.voiceSettings.voiceIndex] || null;
  }

  // Event Listeners
  onTranscript(callback: (result: SpeechRecognitionResult) => void) {
    this.onTranscriptCallback = callback;
  }

  onListeningChange(callback: (isListening: boolean) => void) {
    this.onListeningChangeCallback = callback;
  }

  onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  onSpeakingChange(callback: (isSpeaking: boolean) => void) {
    this.onSpeakingChangeCallback = callback;
  }

  // Status Methods
  getIsListening(): boolean {
    return this.isListening;
  }

  getIsSupported(): boolean {
    return this.isSupported;
  }

  getIsSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Cleanup
  destroy() {
    this.stopListening();
    this.stopSpeaking();
    if (this.speechRecognition) {
      this.speechRecognition.onstart = null;
      this.speechRecognition.onend = null;
      this.speechRecognition.onresult = null;
      this.speechRecognition.onerror = null;
    }
  }
}

// Singleton instance
export const voiceManager = new VoiceManager();