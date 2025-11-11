import { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface IntentInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

export const IntentInput = ({ onSubmit, isProcessing }: IntentInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Was möchtest du tun? (z.B. 'Analysiere meine Reisedaten', 'Zeig mir Japan-Erinnerungen')"
        className="pr-24 h-14 text-base border-primary/30 bg-card aether-glow"
        disabled={isProcessing}
      />
      <div className="absolute right-2 top-2 flex gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-primary hover:bg-primary/20"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isProcessing}
          className="bg-primary text-primary-foreground hover:bg-primary/90 aether-glow-strong"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
