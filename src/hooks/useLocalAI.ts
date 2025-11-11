import { useState, useEffect, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';

interface AIModels {
  embedder: any;
  classifier: any;
  ner: any;
}

interface EntityResult {
  entity: string;
  word: string;
  score: number;
  start: number;
  end: number;
}

export const useLocalAI = () => {
  const [models, setModels] = useState<AIModels>({
    embedder: null,
    classifier: null,
    ner: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadedModels, setLoadedModels] = useState<string[]>([]);

  // Load embedder for semantic search
  const loadEmbedder = useCallback(async () => {
    if (models.embedder) return;
    try {
      setIsLoading(true);
      console.log('Loading embedder model...');
      const embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        { device: 'webgpu' }
      );
      setModels(prev => ({ ...prev, embedder }));
      setLoadedModels(prev => [...prev, 'embedder']);
      console.log('Embedder model loaded');
    } catch (error) {
      console.error('Failed to load embedder:', error);
    } finally {
      setIsLoading(false);
    }
  }, [models.embedder]);

  // Load classifier for intent classification
  const loadClassifier = useCallback(async () => {
    if (models.classifier) return;
    try {
      setIsLoading(true);
      console.log('Loading classifier model...');
      const classifier = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'webgpu' }
      );
      setModels(prev => ({ ...prev, classifier }));
      setLoadedModels(prev => [...prev, 'classifier']);
      console.log('Classifier model loaded');
    } catch (error) {
      console.error('Failed to load classifier:', error);
    } finally {
      setIsLoading(false);
    }
  }, [models.classifier]);

  // Load NER for entity extraction
  const loadNER = useCallback(async () => {
    if (models.ner) return;
    try {
      setIsLoading(true);
      console.log('Loading NER model...');
      const ner = await pipeline(
        'token-classification',
        'Xenova/bert-base-NER',
        { device: 'webgpu' }
      );
      setModels(prev => ({ ...prev, ner }));
      setLoadedModels(prev => [...prev, 'ner']);
      console.log('NER model loaded');
    } catch (error) {
      console.error('Failed to load NER:', error);
    } finally {
      setIsLoading(false);
    }
  }, [models.ner]);

  // Compute embeddings for text
  const computeEmbedding = useCallback(async (text: string): Promise<number[] | null> => {
    if (!models.embedder) {
      console.warn('Embedder not loaded');
      return null;
    }
    try {
      const result = await models.embedder(text, { pooling: 'mean', normalize: true });
      return Array.from(result.data);
    } catch (error) {
      console.error('Failed to compute embedding:', error);
      return null;
    }
  }, [models.embedder]);

  // Classify intent sentiment/type
  const classifyIntent = useCallback(async (text: string): Promise<{ label: string; score: number } | null> => {
    if (!models.classifier) {
      console.warn('Classifier not loaded');
      return null;
    }
    try {
      const result = await models.classifier(text);
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      console.error('Failed to classify:', error);
      return null;
    }
  }, [models.classifier]);

  // Extract entities from text
  const extractEntities = useCallback(async (text: string): Promise<EntityResult[]> => {
    if (!models.ner) {
      console.warn('NER not loaded');
      return [];
    }
    try {
      const result = await models.ner(text);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Failed to extract entities:', error);
      return [];
    }
  }, [models.ner]);

  // Compute similarity between two texts
  const computeSimilarity = useCallback(async (text1: string, text2: string): Promise<number | null> => {
    const emb1 = await computeEmbedding(text1);
    const emb2 = await computeEmbedding(text2);
    
    if (!emb1 || !emb2) return null;
    
    // Cosine similarity
    const dotProduct = emb1.reduce((sum, val, i) => sum + val * emb2[i], 0);
    const mag1 = Math.sqrt(emb1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(emb2.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (mag1 * mag2);
  }, [computeEmbedding]);

  return {
    loadEmbedder,
    loadClassifier,
    loadNER,
    computeEmbedding,
    classifyIntent,
    extractEntities,
    computeSimilarity,
    isLoading,
    loadedModels,
    modelsReady: loadedModels.length > 0,
  };
};
