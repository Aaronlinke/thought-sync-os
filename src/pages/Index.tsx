import { useState, useEffect } from 'react';
import { useBrainEngine } from '@/hooks/useBrainEngine';
import { IntentInput } from '@/components/IntentInput';
import { SystemMetrics } from '@/components/SystemMetrics';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { WorkflowVisualizer } from '@/components/WorkflowVisualizer';
import { ModelManager } from '@/components/ModelManager';
import { IntentHistory } from '@/components/IntentHistory';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Brain } from 'lucide-react';
import { brainStorage } from '@/lib/storage';

const Index = () => {
  const { intents, metrics, models, currentWorkflow, isProcessing, processIntent, toggleModel } = useBrainEngine();
  const [settings, setSettings] = useState({
    animationSpeed: 1,
    glowIntensity: 50,
    autoSave: true,
    speechEnabled: true,
  });

  // Load settings
  useEffect(() => {
    brainStorage.init().then(() => {
      brainStorage.getSetting('appSettings').then(savedSettings => {
        if (savedSettings) {
          setSettings(savedSettings);
        }
      });
    });
  }, []);

  // Save settings
  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    if (newSettings.autoSave) {
      brainStorage.saveSetting('appSettings', newSettings);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-aether-deep via-background to-aether-deep p-6"
      style={{
        filter: `brightness(${0.8 + settings.glowIntensity / 200})`,
        animationDuration: `${2 / settings.animationSpeed}s`,
      }}
    >
      <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain 
              className="h-12 w-12 text-primary animate-pulse-glow" 
              style={{ animationDuration: `${2 / settings.animationSpeed}s` }}
            />
            <h1 className="text-5xl font-bold text-foreground text-glow">LOCAL BRAIN</h1>
          </div>
          <p className="text-lg text-muted-foreground">Aether Cognitive System v3.0</p>
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/30">
            <span className="text-sm text-primary font-mono">Fully Autonomous • Edge AI • Zero Cloud</span>
          </div>
        </div>

        {/* Intent Input */}
        <div className="animate-fade-in">
          <IntentInput 
            onSubmit={processIntent} 
            isProcessing={isProcessing}
            speechEnabled={settings.speechEnabled}
          />
        </div>

        {/* Workflow Visualizer */}
        {currentWorkflow && (
          <div className="animate-fade-in">
            <WorkflowVisualizer workflow={currentWorkflow} />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <SystemMetrics metrics={metrics} />
            <ModelManager models={models} onToggle={toggleModel} />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-2 space-y-6">
            <KnowledgeGraph />
            <IntentHistory intents={intents} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-8 border-t border-border/30">
          <p>Powered by Cognitive Orchestration Layer • Hyper-Compressed Knowledge Graph • Ultra-Lightweight LLM Core</p>
          <p className="mt-1">All processing happens locally on your device • No data leaves your system</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
