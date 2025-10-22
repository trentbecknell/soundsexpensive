// Sound effects manager for AI character interactions
export class SoundEffectsManager {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
      this.isEnabled = false;
    }
  }

  private async createTone(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.audioContext || !this.isEnabled) return;

    try {
      // Resume audio context if suspended (required for user interaction)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.log('Error playing sound effect:', error);
    }
  }

  // Character mood-based sound effects
  async playMoodTransition(mood: 'neutral' | 'excited' | 'listening' | 'thinking' | 'encouraging') {
    switch (mood) {
      case 'excited':
        // Uplifting chord progression
        await this.createTone(523, 0.2, 0.05); // C5
        setTimeout(() => this.createTone(659, 0.2, 0.05), 100); // E5
        setTimeout(() => this.createTone(784, 0.3, 0.05), 200); // G5
        break;
        
      case 'encouraging':
        // Warm, supportive tones
        await this.createTone(440, 0.3, 0.04); // A4
        setTimeout(() => this.createTone(554, 0.3, 0.04), 150); // C#5
        break;
        
      case 'listening':
        // Gentle, attentive sound
        await this.createTone(349, 0.4, 0.03); // F4
        break;
        
      case 'thinking':
        // Contemplative, mysterious tone
        await this.createTone(293, 0.5, 0.03); // D4
        setTimeout(() => this.createTone(329, 0.3, 0.03), 400); // E4
        break;
        
      default:
        // Neutral, gentle tone
        await this.createTone(261, 0.3, 0.03); // C4
        break;
    }
  }

  // Message interaction sounds
  async playMessageSent() {
    // Quick, positive confirmation
    await this.createTone(880, 0.1, 0.04); // A5
    setTimeout(() => this.createTone(1047, 0.15, 0.04), 50); // C6
  }

  async playTypingStart() {
    // Subtle typing notification
    await this.createTone(1319, 0.08, 0.02); // E6
  }

  async playCharacterAppear() {
    // Magical entrance sound
    await this.createTone(523, 0.2, 0.05); // C5
    setTimeout(() => this.createTone(659, 0.2, 0.05), 100); // E5
    setTimeout(() => this.createTone(784, 0.2, 0.05), 200); // G5
    setTimeout(() => this.createTone(1047, 0.3, 0.05), 300); // C6
  }

  // Sparkle and magic effects
  async playSparkle() {
    // Random sparkly tones
    const frequencies = [1047, 1175, 1319, 1397, 1568]; // C6, D6, E6, F6, G6
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    await this.createTone(frequency, 0.15, 0.02);
  }

  async playProgressMilestone() {
    // Achievement sound
    await this.createTone(659, 0.2, 0.06); // E5
    setTimeout(() => this.createTone(784, 0.2, 0.06), 100); // G5
    setTimeout(() => this.createTone(1047, 0.4, 0.06), 200); // C6
  }

  // Ambient background music
  async startAmbientLoop() {
    if (!this.audioContext || !this.isEnabled) return;

    const playAmbientChord = async (delay: number = 0) => {
      setTimeout(async () => {
        // Soft major seventh chord
        await this.createTone(261, 2, 0.008); // C4
        setTimeout(() => this.createTone(329, 2, 0.008), 50); // E4
        setTimeout(() => this.createTone(392, 2, 0.008), 100); // G4
        setTimeout(() => this.createTone(493, 2, 0.008), 150); // B4
      }, delay);
    };

    // Play ambient chords every 8 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // Only occasionally play
        playAmbientChord();
      }
    }, 8000);

    return () => clearInterval(interval);
  }

  // Enable/disable sound effects
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled && this.audioContext !== null;
  }
}

// Singleton instance
export const soundEffects = new SoundEffectsManager();