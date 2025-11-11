import { useState, useCallback, useEffect } from 'react';
import { Intent, SystemMetrics, AIModel, WorkflowStep } from '@/types/brain';
import { brainStorage } from '@/lib/storage';

export const useBrainEngine = () => {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    npuUsage: 0,
    activeModels: 0,
    knowledgeNodes: 127,
    intentQueue: 0,
  });
  const [models, setModels] = useState<AIModel[]>([
    { id: '1', name: 'ULLMC-Core', type: 'llm', size: 2.1, loaded: true, usage: 45 },
    { id: '2', name: 'Vision-Nano', type: 'vision', size: 0.8, loaded: false, usage: 0 },
    { id: '3', name: 'Workflow-Exec', type: 'workflow', size: 0.3, loaded: true, usage: 23 },
  ]);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowStep[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load intents from storage on mount
  useEffect(() => {
    brainStorage.init().then(() => {
      brainStorage.getIntents().then(loadedIntents => {
        if (loadedIntents.length > 0) {
          setIntents(loadedIntents);
        }
      });
    });
  }, []);

  // Simulate system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        npuUsage: isProcessing ? Math.max(40, Math.min(95, prev.npuUsage + (Math.random() - 0.5) * 15)) : Math.max(5, prev.npuUsage - 5),
        activeModels: models.filter(m => m.loaded).length,
        knowledgeNodes: prev.knowledgeNodes + Math.floor(Math.random() * 3),
        intentQueue: intents.filter(i => !i.processed).length,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [models, intents, isProcessing]);

  const processIntent = useCallback(async (text: string) => {
    const newIntent: Intent = {
      id: Date.now().toString(),
      text,
      confidence: 0.7 + Math.random() * 0.3,
      category: text.toLowerCase().includes('zeig') || text.toLowerCase().includes('was') ? 'query' : 'command',
      timestamp: new Date(),
      processed: false,
    };

    setIntents(prev => [...prev, newIntent]);
    
    // Save to storage
    await brainStorage.saveIntent(newIntent);
    
    setIsProcessing(true);

    // Simulate intent processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create workflow if command
    if (newIntent.category === 'command') {
      const workflow: WorkflowStep[] = [
        { id: '1', name: 'Intent Analysis', status: 'completed', progress: 100 },
        { id: '2', name: 'Context Loading', status: 'running', progress: 60 },
        { id: '3', name: 'Model Inference', status: 'pending', progress: 0 },
        { id: '4', name: 'Result Synthesis', status: 'pending', progress: 0 },
      ];
      setCurrentWorkflow(workflow);

      // Simulate workflow execution
      for (let i = 0; i < workflow.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentWorkflow(prev => 
          prev?.map((step, idx) => 
            idx === i ? { ...step, status: 'completed', progress: 100 } :
            idx === i + 1 ? { ...step, status: 'running', progress: 50 } :
            step
          ) || null
        );
      }

      setTimeout(() => setCurrentWorkflow(null), 2000);
    }

    setIntents(prev => 
      prev.map(i => i.id === newIntent.id ? { ...i, processed: true } : i)
    );
    setIsProcessing(false);
  }, []);

  const toggleModel = useCallback((modelId: string) => {
    setModels(prev => 
      prev.map(m => 
        m.id === modelId ? { ...m, loaded: !m.loaded, usage: m.loaded ? 0 : Math.random() * 50 } : m
      )
    );
  }, []);

  return {
    intents,
    metrics,
    models,
    currentWorkflow,
    isProcessing,
    processIntent,
    toggleModel,
  };
};
