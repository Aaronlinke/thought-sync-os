import { useState, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface IntentInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
  speechEnabled: boolean;
}

export const IntentInput = ({ onSubmit, isProcessing, speechEnabled }: IntentInputProps) => {
  const [input, setInput] = useState('');
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!isListening && transcript && !isProcessing) {
      onSubmit(transcript);
      setInput('');
    }
  }, [isListening, transcript, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleMicClick = () => {
    if (!speechEnabled || !isSupported) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Was möchtest du tun? (z.B. 'Analysiere meine Reisedaten', 'Zeig mir Japan-Erinnerungen')"
        className="pr-24 h-14 text-base border-primary/30 bg-card aether-glow"
        disabled={isProcessing || isListening}
      />
      <div className="absolute right-2 top-2 flex gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleMicClick}
          disabled={!speechEnabled || !isSupported}
          className={`${isListening ? 'text-secondary animate-pulse' : 'text-primary'} hover:bg-primary/20`}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
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
