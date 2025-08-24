import { Bot, X } from "lucide-react";
import { Button } from "../../components/ui/button";

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="bg-medical-blue text-white p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Bot className="h-6 w-6 text-black" />
        </div>
        <div>
          <h3 className="font-bold text-lg" data-testid="text-chatbot-title">Thalassemia Assistant</h3>
          <p className="text-sm text-blue-100 opacity-90">Always here to help</p>
        </div>
      </div>
      <Button
        onClick={onClose}
        data-testid="button-close-chatbot"
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 p-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="Close chat"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
