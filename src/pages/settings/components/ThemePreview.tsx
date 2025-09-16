import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeSettings } from "@/integrations/supabase/types/settings/theme";

interface ThemePreviewProps {
  theme: ThemeSettings;
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  const previewStyle = {
    "--preview-primary": theme.primary,
    "--preview-secondary": theme.secondary,
    "--preview-accent": theme.accent,
  } as React.CSSProperties;

  return (
    <Card className="w-full max-w-sm overflow-hidden" style={previewStyle}>
      <CardHeader 
        className="pb-3"
        style={{ 
          backgroundColor: `hsl(${theme.primary})`,
          color: "white"
        }}
      >
        <CardTitle className="text-sm font-medium text-white">
          Preview do Tema
        </CardTitle>
        <CardDescription className="text-xs text-white/80">
          Visualização das cores personalizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Primary</span>
          <div 
            className="h-4 w-8 rounded border"
            style={{ backgroundColor: `hsl(${theme.primary})` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Secondary</span>
          <div 
            className="h-4 w-8 rounded border"
            style={{ backgroundColor: `hsl(${theme.secondary})` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Accent</span>
          <div 
            className="h-4 w-8 rounded border"
            style={{ backgroundColor: `hsl(${theme.accent})` }}
          />
        </div>

        <div className="pt-2 space-y-2">
          <Button 
            size="sm" 
            className="w-full text-xs"
            style={{ 
              backgroundColor: `hsl(${theme.primary})`,
              color: "white"
            }}
          >
            Botão Primary
          </Button>
          
          <div className="flex gap-2">
            <Badge 
              style={{ 
                backgroundColor: `hsl(${theme.secondary})`,
                color: "white"
              }}
            >
              Secondary
            </Badge>
            <Badge 
              style={{ 
                backgroundColor: `hsl(${theme.accent})`,
                color: "white"
              }}
            >
              Accent
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}