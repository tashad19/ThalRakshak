import { useState, useCallback } from 'react';
import { type TextToSpeechState } from '../../types/chatbot';

export function useTextToSpeech() {
  const [state, setState] = useState<TextToSpeechState>({
    isSpeaking: false,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    error: null,
  });

  const speak = useCallback((text: string) => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Text-to-speech is not supported in this browser' }));
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isSpeaking: true, error: null }));
    };

    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = (event) => {
      setState(prev => ({ 
        ...prev, 
        isSpeaking: false, 
        error: `Speech synthesis error: ${event.error}` 
      }));
    };

    window.speechSynthesis.speak(utterance);
  }, [state.isSupported]);

  const stop = useCallback(() => {
    if (state.isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, [state.isSupported]);

  return {
    ...state,
    speak,
    stop,
  };
}
