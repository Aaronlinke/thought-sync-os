import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Network, Loader2 } from 'lucide-react';
import { useLocalAI } from '@/hooks/useLocalAI';
import { Badge } from '@/components/ui/badge';

export const AIModelLoader = () => {
  const { 
    loadEmbedder, 
    loadClassifier, 
    loadNER, 
    isLoading, 
    loadedModels 
  } = useLocalAI();

  const models = [
    {
      id: 'embedder',
      name: 'Embeddings',
      description: 'Semantic similarity & vector search',
      icon: Network,
      load: loadEmbedder,
      size: '23MB',
    },
    {
      id: 'classifier',
      name: 'Intent Classifier',
      description: 'Classify user intents',
      icon: Brain,
      load: loadClassifier,
      size: '66MB',
    },
    {
      id: 'ner',
      name: 'Entity Extraction',
      description: 'Extract entities for knowledge graph',
      icon: Sparkles,
      load: loadNER,
      size: '110MB',
    },
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Local AI Models</h3>
        <Badge variant="outline" className="text-xs">
          Browser-based • Zero Cloud
        </Badge>
      </div>
      
      <div className="space-y-3">
        {models.map((model) => {
          const Icon = model.icon;
          const isLoaded = loadedModels.includes(model.id);
          
          return (
            <div 
              key={model.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${isLoaded ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <div className="text-sm font-medium text-foreground">{model.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {model.description} • {model.size}
                  </div>
                </div>
              </div>
              
              {isLoaded ? (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Loaded
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={model.load}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load'
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs text-muted-foreground">
          🚀 Models run entirely in your browser with WebGPU acceleration. First load downloads and caches models.
        </p>
      </div>
    </Card>
  );
};
