import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Network, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  id: string;
  label: string;
  type: string;
  color: string;
}

export const KnowledgeGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create nodes with semantic types
    const nodeTypes = [
      { type: 'concept', color: '0, 255, 255', label: 'Core Concept' },
      { type: 'person', color: '255, 0, 255', label: 'Person' },
      { type: 'location', color: '0, 255, 128', label: 'Location' },
      { type: 'event', color: '255, 128, 0', label: 'Event' },
      { type: 'data', color: '128, 128, 255', label: 'Data' },
    ];

    const numNodes = 35;
    const nodes: Node[] = [];
    
    for (let i = 0; i < numNodes; i++) {
      const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 3 + Math.random() * 5,
        id: `node-${i}`,
        label: `${nodeType.label} ${i}`,
        type: nodeType.type,
        color: nodeType.color,
      });
    }
    nodesRef.current = nodes;

    // Handle click
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedNode = nodes.find(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        return Math.sqrt(dx * dx + dy * dy) < node.r + 5;
      });

      if (clickedNode) {
        setSelectedNode(clickedNode);
        toast.info(clickedNode.label, {
          description: `Type: ${clickedNode.type} • Connections: ${Math.floor(Math.random() * 10)}`,
        });
      }
    };

    canvas.addEventListener('click', handleClick);

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.offsetWidth) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.offsetHeight) node.vy *= -1;

        // Draw connections
        nodes.slice(i + 1).forEach(other => {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${node.color}, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Draw node
        ctx.beginPath();
        const isSelected = selectedNode?.id === node.id;
        ctx.fillStyle = `rgba(${node.color}, ${isSelected ? 0.9 : 0.6})`;
        ctx.shadowBlur = isSelected ? 20 : 10;
        ctx.shadowColor = `rgba(${node.color}, 0.8)`;
        ctx.arc(node.x, node.y, isSelected ? node.r * 1.5 : node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [selectedNode]);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Knowledge Graph</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          <span>Click nodes to explore</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full h-[300px] rounded-lg bg-aether-deep cursor-pointer" />
    </Card>
  );
};
