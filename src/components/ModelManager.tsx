import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Brain, Eye, Workflow } from 'lucide-react';
import { AIModel } from '@/types/brain';

interface ModelManagerProps {
  models: AIModel[];
  onToggle: (modelId: string) => void;
}

export const ModelManager = ({ models, onToggle }: ModelManagerProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'llm': return Brain;
      case 'vision': return Eye;
      case 'workflow': return Workflow;
      default: return Brain;
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="text-lg font-semibold text-foreground mb-4">AI Models</h3>
      <div className="space-y-4">
        {models.map((model) => {
          const Icon = getIcon(model.type);
          return (
            <div key={model.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{model.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {model.size.toFixed(1)}GB • {model.loaded ? `${model.usage}% usage` : 'Unloaded'}
                  </div>
                </div>
              </div>
              <Switch
                checked={model.loaded}
                onCheckedChange={() => onToggle(model.id)}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
