import { useState, useRef } from "react";
import { Mic, Camera, Send, Square } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useSpeechRecognition } from "../../hooks/use-speech-recognition";
import { type SendMessageFunction, type UploadImageFunction } from "../../types/chatbot";

interface ChatInputProps {
  onSendMessage: SendMessageFunction;
  onUploadImage: UploadImageFunction;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onUploadImage, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isListening,
    transcript,
    isSupported: speechSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const handleSend = async () => {
    const message = inputValue.trim() || transcript.trim();
    if (message && !disabled && !isSending) {
      setIsSending(true);
      try {
        await onSendMessage(message, true);
        setInputValue("");
        resetTranscript();
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const quickMessages = [
    { text: "I need blood urgently", emoji: "🩸", label: "Need Blood" },
    { text: "How to become a donor?", emoji: "❤️", label: "Become Donor" },
    { text: "Tell me about Thalassemia", emoji: "📚", label: "Learn More" },
  ];

  const currentValue = inputValue || transcript;
  const isDisabled = disabled || isSending || isListening;

  return (
    <div className="p-4 border-t border-gray-200 bg-white shadow-lg">
      {/* Multimodal Input Controls */}
      <div className="flex items-center space-x-2 mb-3">
        <Button
          onClick={toggleRecording}
          disabled={!speechSupported || isDisabled}
          data-testid="button-voice-input"
          className={`flex-1 py-3 px-4 text-sm transition-all duration-200 rounded-xl font-medium ${
            isListening
              ? "bg-red-100 text-red-600 hover:bg-red-200 border-red-200"
              : "bg-medical-light text-medical-blue hover:bg-blue-100 border-medical-blue border-opacity-20"
          }`}
          variant="outline"
        >
          {isListening ? (
            <>
              <Square className="h-4 w-4 mr-2 animate-pulse" />
              Recording...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Voice Input
            </>
          )}
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled}
          data-testid="button-image-upload"
          variant="outline"
          className="flex-1 bg-green-50 text-trust-green hover:bg-green-100 py-3 px-4 text-sm rounded-xl font-medium border-trust-green border-opacity-20"
        >
          <Camera className="h-4 w-4 mr-2" />
          Image
        </Button>
      </div>

      {/* Voice Recording Indicator */}
      {isListening && (
        <div className="mb-3 p-4 bg-red-50 border border-red-200 rounded-xl" data-testid="voice-recording-indicator">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-emergency-red rounded-full animate-pulse"></div>
            <span className="text-sm text-red-700 font-medium">Recording... Tap to stop</span>
            <Button
              onClick={stopListening}
              size="sm"
              variant="ghost"
              className="ml-auto text-red-700 hover:text-red-900 p-1 rounded-full"
              data-testid="button-stop-recording"
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
          {transcript && (
            <p className="text-sm text-gray-700 mt-3 italic bg-white p-2 rounded-lg border">"{transcript}"</p>
          )}
        </div>
      )}

      {/* Speech Error */}
      {speechError && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
          <p className="font-medium">Speech Recognition Error:</p>
          <p className="mt-1">{speechError}</p>
        </div>
      )}

      {/* Text Input */}
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={currentValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message or ask about Thalassemia support..."
          disabled={isDisabled}
          data-testid="input-chat-message"
          className="flex-1 text-sm focus:ring-2 focus:ring-medical-blue rounded-xl border-gray-200 py-3 px-4"
        />
        <Button
          onClick={handleSend}
          disabled={!currentValue.trim() || isDisabled}
          data-testid="button-send-message"
          className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* File Upload (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleImageUpload}
        className="hidden"
        data-testid="input-file-upload"
      />

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {quickMessages.map((msg, index) => (
          <Button
            key={index}
            onClick={async () => {
              setInputValue(msg.text);
              setTimeout(async () => {
                await handleSend();
              }, 100);
            }}
            disabled={isDisabled}
            variant="outline"
            size="sm"
            data-testid={`button-quick-${msg.label.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-full font-medium border-gray-200 transition-all duration-200 hover:scale-105"
          >
            {msg.emoji} {msg.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
