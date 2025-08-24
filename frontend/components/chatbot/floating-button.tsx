import { MessageCircle, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function FloatingButton({ onClick, isOpen }: FloatingButtonProps) {
  if (isOpen) return null;

  return (
    <Button
      onClick={onClick}
      data-testid="button-open-chatbot"
      className="fixed bottom-6 right-6 w-16 h-16 bg-medical-blue hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 z-40 p-0 hover:scale-110 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-medical-blue focus:ring-opacity-50"
      aria-label="Open Thalassemia Assistant Chat"
    >
      <MessageCircle className="h-7 w-7" />
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-emergency-red text-white rounded-full flex items-center justify-center animate-pulse">
        <Plus className="h-4 w-4" />
      </div>
    </Button>
  );
}
