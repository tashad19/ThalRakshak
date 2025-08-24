import { useState, useEffect, useCallback } from 'react';
import { type VoiceRecognitionState } from '../types/chatbot';

export function useSpeechRecognition() {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    isSupported: false,
    error: null,
  });

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
          setState(prev => ({ ...prev, isListening: true, error: null }));
        };

        recognitionInstance.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setState(prev => ({ ...prev, transcript: finalTranscript.trim() }));
          }
        };

        recognitionInstance.onerror = (event) => {
          setState(prev => ({ 
            ...prev, 
            error: `Speech recognition error: ${event.error}`,
            isListening: false 
          }));
        };

        recognitionInstance.onend = () => {
          setState(prev => ({ ...prev, isListening: false }));
        };

        setRecognition(recognitionInstance);
        setState(prev => ({ ...prev, isSupported: true }));
      } else {
        setState(prev => ({ 
          ...prev, 
          isSupported: false, 
          error: 'Speech recognition is not supported in this browser' 
        }));
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !state.isListening) {
      setState(prev => ({ ...prev, transcript: '', error: null }));
      recognition.start();
    }
  }, [recognition, state.isListening]);

  const stopListening = useCallback(() => {
    if (recognition && state.isListening) {
      recognition.stop();
    }
  }, [recognition, state.isListening]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '' }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}
