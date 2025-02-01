export class SpeechManager {
  private speechSynthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private wordCallback: ((word: string) => void) | null = null;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices = () => {
    this.voices = this.speechSynthesis.getVoices();
    if (this.voices.length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        this.voices = this.speechSynthesis.getVoices();
      });
    }
  };

  private getPreferredVoice = () => {
    return (
      this.voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google')) ||
      this.voices.find(voice => voice.lang === 'en-US') ||
      this.voices[0]
    );
  };

  setWordCallback = (callback: (word: string) => void) => {
    this.wordCallback = callback;
  };

  speak = (text: string, onStart?: () => void, onEnd?: () => void) => {
    // Cancel any ongoing speech
    if (this.currentUtterance) {
      this.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.getPreferredVoice();
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Split text into words for lip sync
    const words = text.split(/\s+/);
    let wordIndex = 0;

    utterance.onboundary = (event) => {
      if (event.name === 'word' && this.wordCallback && wordIndex < words.length) {
        this.wordCallback(words[wordIndex]);
        wordIndex++;
      }
    };

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
      wordIndex = 0;
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      onEnd?.();
      wordIndex = 0;
    };

    this.currentUtterance = utterance;
    this.speechSynthesis.speak(utterance);
  };

  stop = () => {
    if (this.currentUtterance) {
      this.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  };
}