import { useState } from 'react';
import { Settings, Palette, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SettingsPanelProps {
  settings: {
    animationSpeed: number;
    glowIntensity: number;
    autoSave: boolean;
    speechEnabled: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export const SettingsPanel = ({ settings, onSettingsChange }: SettingsPanelProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 right-4 z-50 aether-glow border-primary/30"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card/95 backdrop-blur-xl border-primary/30">
        <SheetHeader>
          <SheetTitle className="text-foreground">System Settings</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Konfiguriere dein LOCAL BRAIN
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Appearance */}
          <Card className="p-4 bg-card/50 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Animation Speed: {settings.animationSpeed}x
                </Label>
                <Slider
                  value={[settings.animationSpeed]}
                  onValueChange={([value]) => 
                    onSettingsChange({ ...settings, animationSpeed: value })
                  }
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Glow Intensity: {settings.glowIntensity}%
                </Label>
                <Slider
                  value={[settings.glowIntensity]}
                  onValueChange={([value]) => 
                    onSettingsChange({ ...settings, glowIntensity: value })
                  }
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Performance */}
          <Card className="p-4 bg-card/50 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Performance</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save" className="text-sm text-muted-foreground">
                  Auto-Save Data
                </Label>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => 
                    onSettingsChange({ ...settings, autoSave: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="speech" className="text-sm text-muted-foreground">
                  Voice Recognition
                </Label>
                <Switch
                  id="speech"
                  checked={settings.speechEnabled}
                  onCheckedChange={(checked) => 
                    onSettingsChange({ ...settings, speechEnabled: checked })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-4 bg-card/50 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Privacy</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              All data is stored locally on your device. No information is sent to external servers.
              Your thoughts remain private and secure.
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
