import { Activity, Brain, Database, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SystemMetrics as Metrics } from '@/types/brain';

interface SystemMetricsProps {
  metrics: Metrics;
}

export const SystemMetrics = ({ metrics }: SystemMetricsProps) => {
  const stats = [
    { label: 'NPU', value: metrics.npuUsage, icon: Brain, color: 'primary' },
    { label: 'CPU', value: metrics.cpuUsage, icon: Zap, color: 'secondary' },
    { label: 'Memory', value: metrics.memoryUsage, icon: Activity, color: 'accent' },
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">System Status</h3>
      </div>
      
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="text-sm font-mono text-foreground">{stat.value.toFixed(0)}%</span>
            </div>
            <Progress value={stat.value} className="h-2" />
          </div>
        ))}
        
        <div className="pt-4 border-t border-border/50 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Models</span>
            <span className="text-foreground font-mono">{metrics.activeModels}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Knowledge Nodes</span>
            <span className="text-foreground font-mono">{metrics.knowledgeNodes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Intent Queue</span>
            <span className="text-foreground font-mono">{metrics.intentQueue}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
