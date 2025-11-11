import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Intent } from '@/types/brain';
import { CheckCircle2, Clock } from 'lucide-react';

interface IntentHistoryProps {
  intents: Intent[];
}

export const IntentHistory = ({ intents }: IntentHistoryProps) => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="text-lg font-semibold text-foreground mb-4">Intent History</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-3">
          {intents.slice().reverse().map((intent) => (
            <div key={intent.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
              {intent.processed ? (
                <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              ) : (
                <Clock className="h-4 w-4 text-secondary animate-pulse mt-1 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium line-clamp-2">{intent.text}</p>
                {intent.response && (
                  <p className="text-sm text-primary/80 mt-1 line-clamp-2 italic">
                    → {intent.response}
                  </p>
                )}
                {intent.entities && intent.entities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {intent.entities.slice(0, 3).map((entity, idx) => (
                      <span key={idx} className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {entity.word}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {intent.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-primary font-mono">
                    {(intent.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
          {intents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Keine Intents verarbeitet
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
