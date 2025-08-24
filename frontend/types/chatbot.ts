import { type Intent, type ClassifyResponse } from "@shared/schema";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  intent?: string;
  metadata?: {
    label?: string;
    color?: string;
    action?: {
      text: string;
      icon: string;
      url: string;
    };
    extra?: string;
    imageType?: string;
    imageSize?: number;
    fileName?: string;
  };
}

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  isRecording: boolean;
  sessionId: string;
}

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
}

export interface TextToSpeechState {
  isSpeaking: boolean;
  isSupported: boolean;
  error: string | null;
}

export interface APIResponse {
  intent: string;
  response: string;
}

export type SendMessageFunction = (text: string, isUser?: boolean) => Promise<void>;
export type ToggleRecordingFunction = () => void;
export type UploadImageFunction = (file: File) => void;
