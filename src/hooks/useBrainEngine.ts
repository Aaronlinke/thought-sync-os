import { useState, useCallback, useEffect } from 'react';
import { Intent, SystemMetrics, AIModel, WorkflowStep } from '@/types/brain';
import { brainStorage } from '@/lib/storage';
import { useLocalAI } from './useLocalAI';

export const useBrainEngine = () => {
  const { 
    computeEmbedding, 
    classifyIntent: classifyIntentAI, 
    extractEntities,
    loadedModels 
  } = useLocalAI();
  
  const [intents, setIntents] = useState<Intent[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    npuUsage: 0,
    activeModels: loadedModels.length,
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

  // Update system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        npuUsage: isProcessing ? Math.max(40, Math.min(95, prev.npuUsage + (Math.random() - 0.5) * 15)) : Math.max(5, prev.npuUsage - 5),
        activeModels: loadedModels.length + models.filter(m => m.loaded).length,
        knowledgeNodes: prev.knowledgeNodes + Math.floor(Math.random() * 3),
        intentQueue: intents.filter(i => !i.processed).length,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [models, intents, isProcessing]);

  const processIntent = useCallback(async (text: string) => {
    setIsProcessing(true);
    
    // Use AI models if loaded
    let confidence = 0.7 + Math.random() * 0.3;
    let category: Intent['category'] = 'command';
    let vector: number[] | undefined;
    
    try {
      // Classify intent with AI
      if (loadedModels.includes('classifier')) {
        const classification = await classifyIntentAI(text);
        if (classification) {
          confidence = classification.score;
          // Map sentiment to category
          category = classification.label === 'POSITIVE' ? 'workflow' : 
                     text.toLowerCase().includes('zeig') || text.toLowerCase().includes('was') ? 'query' : 'command';
        }
      } else {
        // Fallback to keyword-based
        category = text.toLowerCase().includes('zeig') || text.toLowerCase().includes('was') ? 'query' : 'command';
      }
      
      // Compute embedding
      if (loadedModels.includes('embedder')) {
        const embedding = await computeEmbedding(text);
        if (embedding) {
          vector = embedding;
        }
      }
      
      // Extract entities for knowledge graph
      if (loadedModels.includes('ner')) {
        const entities = await extractEntities(text);
        if (entities.length > 0) {
          console.log('Entities detected:', entities.map(e => `${e.word} (${e.entity})`).join(', '));
        }
      }
    } catch (error) {
      console.error('AI processing error:', error);
    }
    
    const newIntent: Intent = {
      id: Date.now().toString(),
      text,
      confidence,
      category,
      timestamp: new Date(),
      processed: false,
      vector,
    };

    setIntents(prev => [...prev, newIntent]);
    await brainStorage.saveIntent(newIntent);

    // Process intent workflow
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

      // Execute workflow steps
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
  }, [classifyIntentAI, computeEmbedding, extractEntities, loadedModels]);

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
