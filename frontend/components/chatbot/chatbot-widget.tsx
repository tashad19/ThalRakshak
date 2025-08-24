import { useState, useEffect } from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { FloatingButton } from "./floating-button";
import { useToast } from "../../hooks/use-toast";
import { type ChatMessage, type ChatbotState } from "../../types/chatbot";

export default function ChatbotWidget() {
  const { toast } = useToast();

  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [],
    isTyping: false,
    isRecording: false,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  });

  const sendMessageToAPI = async (text: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  };

  const processImageAPI = async (file: File) => {
    console.log('File details:', file.name, file.type, file.size);
    const formData = new FormData();
    formData.append('file', file);
    console.log('FormData created:', formData);
    try {
        const response = await fetch('http://localhost:5002/api/process-image', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log('API response:', data);
        if (!response.ok || data.error) {
            throw new Error(data.error || 'Failed to process image on server');
        }
        return data;
    } catch (error) {
        console.error('Error processing image:', error.message);
        throw error;
    }
  };

  const toggleChatbot = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const sendMessage = async (text: string, isUser = false) => {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      isUser,
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    if (isUser) {
      setState(prev => ({ ...prev, isTyping: true }));
      try {
        const apiResponse = await sendMessageToAPI(text);
        const botMessage: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: apiResponse.response,
          isUser: false,
          timestamp: new Date().toISOString(),
          intent: apiResponse.intent,
          metadata: {
            label: apiResponse.intent.replace('_', ' ').toUpperCase(),
            color: 'bg-medical-blue',
            action: apiResponse.response.includes('👉') ? {
              text: 'Visit Link',
              icon: '🔗',
              url: apiResponse.response.match(/https:\/\/[^\s)]+/)?.[0] || '#'
            } : undefined
          },
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
          isTyping: false,
        }));
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later.",
          isUser: false,
          timestamp: new Date().toISOString(),
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          isTyping: false,
        }));

        toast({
          title: "Connection Error",
          description: "Failed to connect to the chatbot server.",
          variant: "destructive",
        });
      }
    }
  };

  const uploadImage = async (file: File) => {
    // Add user message for image upload
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: `📷 Image uploaded: ${file.name}`,
      isUser: true,
      timestamp: new Date().toISOString(),
      metadata: {
        imageType: file.type,
        imageSize: file.size,
        fileName: file.name,
      },
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true, // Show typing indicator while processing image
    }));

    try {
      const apiResponse = await processImageAPI(file);
      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: apiResponse.response,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      }));
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: "I'm sorry, there was an error processing your image. Please try again later.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false,
      }));

      toast({
        title: "Image Processing Error",
        description: "Failed to process the uploaded image.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <FloatingButton onClick={toggleChatbot} isOpen={state.isOpen} />
      <div
        className={`fixed inset-0 z-50 flex items-end justify-end transition-all duration-300 ease-out ${state.isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        data-testid="chatbot-overlay"
      >
        <div
          className="absolute inset-0 bg-black/70 transition-opacity duration-300"
          onClick={toggleChatbot}
        />
        <div
          className={`relative h-[90vh] w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col mr-4 mb-4 rounded-tl-2xl rounded-bl-2xl ${state.isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          data-testid="chatbot-popup"
        >
          <ChatHeader onClose={toggleChatbot} />
          <ChatMessages
            messages={state.messages}
            isTyping={state.isTyping}
          />
          <ChatInput
            onSendMessage={sendMessage}
            onUploadImage={uploadImage}
            disabled={state.isTyping}
          />
        </div>
      </div>
    </>
  );
}