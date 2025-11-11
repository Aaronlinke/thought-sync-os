import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { WorkflowStep } from '@/types/brain';

interface WorkflowVisualizerProps {
  workflow: WorkflowStep[] | null;
}

export const WorkflowVisualizer = ({ workflow }: WorkflowVisualizerProps) => {
  if (!workflow) return null;

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-scale-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Active Workflow</h3>
      <div className="space-y-3">
        {workflow.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-3">
            {step.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            ) : step.status === 'running' ? (
              <Loader2 className="h-5 w-5 text-secondary animate-spin flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${step.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{step.progress}%</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
