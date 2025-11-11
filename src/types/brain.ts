export interface Intent {
  id: string;
  text: string;
  confidence: number;
  category: 'query' | 'command' | 'workflow' | 'system';
  timestamp: Date;
  processed: boolean;
  vector?: number[];
}

export interface KnowledgeNode {
  id: string;
  type: 'person' | 'location' | 'concept' | 'event' | 'model' | 'workflow' | 'data';
  label: string;
  properties: Record<string, any>;
  state: 'active' | 'latent' | 'ephemeral';
  vector?: number[];
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
  context?: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  npuUsage: number;
  activeModels: number;
  knowledgeNodes: number;
  intentQueue: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
}

export interface AIModel {
  id: string;
  name: string;
  type: 'llm' | 'vision' | 'audio' | 'workflow';
  size: number;
  loaded: boolean;
  usage: number;
}
