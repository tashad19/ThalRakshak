import { useEffect, useRef } from "react";
import { Bot, User, ExternalLink } from "lucide-react";
import { type ChatMessage } from "../../types/chatbot";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessageText = (text: string) => {
    // Convert markdown-style links to clickable links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(linkRegex);
    
    if (parts.length === 1) {
      return <span>{text}</span>;
    }

    const elements = [];
    for (let i = 0; i < parts.length; i += 3) {
      if (parts[i]) elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
      if (parts[i + 1] && parts[i + 2]) {
        elements.push(
          <a
            key={`link-${i}`}
            href={parts[i + 2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-medical-blue hover:text-blue-700 underline font-medium"
          >
            {parts[i + 1]}
          </a>
        );
      }
    }
    
    return <>{elements}</>;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-medical-lighter to-white">
      {/* Welcome Message */}
      <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300">
        <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center text-white shadow-md">
          <Bot className="h-5 w-5" />
        </div>
        <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg max-w-72 border border-gray-100">
          <p className="text-sm text-gray-800 font-medium">
            Hello! I'm your Thalassemia support assistant. I can help you with:
          </p>
          <ul className="text-xs text-gray-600 mt-3 space-y-1">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-medical-blue rounded-full"></span>
              <span>Blood donation requests</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-medical-blue rounded-full"></span>
              <span>Donor registration</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-medical-blue rounded-full"></span>
              <span>Thalassemia information</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-medical-blue rounded-full"></span>
              <span>Government schemes</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-medical-blue rounded-full"></span>
              <span>Financial assistance</span>
            </li>
          </ul>
          <p className="text-sm text-gray-800 mt-3 font-medium">
            You can type, speak, or upload images. How can I help you today?
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300 ${
            message.isUser ? "justify-end" : ""
          }`}
          data-testid={`message-${message.id}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {message.isUser ? (
            <>
              <div className="bg-medical-blue text-white rounded-2xl rounded-tr-none p-4 shadow-lg max-w-72">
                <p className="text-sm font-medium">{message.text}</p>
                <span className="text-xs text-blue-100 mt-2 block opacity-80">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center text-white shadow-md">
                <User className="h-5 w-5" />
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center text-white shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg max-w-72 border border-gray-100">
                {message.metadata?.label && (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`text-xs ${message.metadata.color || 'bg-medical-blue'} text-white px-3 py-1 rounded-full font-medium`}>
                      {message.metadata.label}
                    </span>
                  </div>
                )}
                <div className="text-sm text-gray-800 leading-relaxed">
                  {renderMessageText(message.text)}
                </div>
                {message.metadata?.action && (
                  <a
                    href={message.metadata.action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center mt-3 ${message.metadata.color || 'bg-medical-blue'} text-white text-xs px-4 py-2 rounded-full hover:opacity-90 transition-all duration-200 font-medium shadow-sm`}
                    data-testid={`link-${message.metadata.action.text.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    {message.metadata.action.text}
                  </a>
                )}
                {message.metadata?.extra && (
                  <p className="text-xs text-gray-600 mt-3 p-2 bg-gray-50 rounded-lg">
                    {message.metadata.extra}
                  </p>
                )}
                <span className="text-xs text-gray-500 mt-2 block opacity-70">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300" data-testid="typing-indicator">
          <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center text-white shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg border border-gray-100">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-medical-blue rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-medical-blue rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-3 h-3 bg-medical-blue rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
