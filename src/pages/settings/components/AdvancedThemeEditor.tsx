import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, RotateCcw, Download, Upload } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";
import { ThemePreview } from "./ThemePreview";
import { useToast } from "@/hooks/use-toast";
import { ThemeSettings } from "@/integrations/supabase/types/settings/theme";

interface AdvancedThemeEditorProps {
  form: UseFormReturn<SettingsFormValues>;
}

const PRESET_THEMES = [
  { name: "Azul Oceano", primary: "210 100% 56%", secondary: "210 31% 41%", accent: "199 89% 48%" },
  { name: "Verde Natureza", primary: "142 71% 45%", secondary: "142 43% 34%", accent: "84 81% 44%" },
  { name: "Roxo Místico", primary: "271 91% 65%", secondary: "271 76% 53%", accent: "281 83% 69%" },
  { name: "Laranja Energia", primary: "24 95% 53%", secondary: "20 90% 48%", accent: "43 96% 56%" },
  { name: "Rosa Moderno", primary: "330 81% 60%", secondary: "330 65% 48%", accent: "340 87% 67%" },
];

export function AdvancedThemeEditor({ form }: AdvancedThemeEditorProps) {
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState<ThemeSettings>(() => {
    const theme = form.watch("custom_theme");
    return {
      primary: theme.primary || "142 35% 32%",
      secondary: theme.secondary || "271 28% 54%",
      accent: theme.accent || "24 95% 53%",
    };
  });

  const handleColorChange = (colorType: "primary" | "secondary" | "accent", value: string) => {
    const newTheme: ThemeSettings = { ...currentTheme, [colorType]: value };
    setCurrentTheme(newTheme);
    form.setValue("custom_theme", newTheme);
  };

  const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
    const newTheme: ThemeSettings = {
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
    };
    setCurrentTheme(newTheme);
    form.setValue("custom_theme", newTheme);
    toast({
      title: "Tema aplicado",
      description: `Preset "${preset.name}" foi aplicado com sucesso.`,
    });
  };

  const resetToDefault = () => {
    const defaultTheme: ThemeSettings = {
      primary: "142 35% 32%",
      secondary: "271 28% 54%",
      accent: "24 95% 53%",
    };
    setCurrentTheme(defaultTheme);
    form.setValue("custom_theme", defaultTheme);
    toast({
      title: "Tema redefinido",
      description: "As cores foram redefinidas para os valores padrão.",
    });
  };

  const exportTheme = () => {
    const themeData = JSON.stringify(currentTheme, null, 2);
    const blob = new Blob([themeData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tema-personalizado.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Tema exportado",
      description: "O arquivo do tema foi baixado com sucesso.",
    });
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          if (themeData.primary && themeData.secondary && themeData.accent) {
            const validTheme: ThemeSettings = {
              primary: themeData.primary,
              secondary: themeData.secondary,
              accent: themeData.accent,
            };
            setCurrentTheme(validTheme);
            form.setValue("custom_theme", validTheme);
            toast({
              title: "Tema importado",
              description: "O tema foi importado com sucesso.",
            });
          } else {
            throw new Error("Formato inválido");
          }
        } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Arquivo de tema inválido.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const convertHslToHex = (hsl: string) => {
    const [h, s, l] = hsl.split(" ").map(v => parseFloat(v.replace("%", "")));
    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l / 100 - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const convertHexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Editor de Tema Avançado</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetToDefault}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Padrão
            </Button>
            <Button variant="outline" size="sm" onClick={exportTheme}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importTheme}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <CardDescription>
          Personalize as cores do tema com preview em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="primary-color">Cor Primária</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="primary-color"
                    type="color"
                    value={convertHslToHex(currentTheme.primary)}
                    onChange={(e) => handleColorChange("primary", convertHexToHsl(e.target.value))}
                    className="w-16 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={currentTheme.primary}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    placeholder="210 100% 56%"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary-color">Cor Secundária</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={convertHslToHex(currentTheme.secondary)}
                    onChange={(e) => handleColorChange("secondary", convertHexToHsl(e.target.value))}
                    className="w-16 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={currentTheme.secondary}
                    onChange={(e) => handleColorChange("secondary", e.target.value)}
                    placeholder="210 31% 41%"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accent-color">Cor de Destaque</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="accent-color"
                    type="color"
                    value={convertHslToHex(currentTheme.accent)}
                    onChange={(e) => handleColorChange("accent", convertHexToHsl(e.target.value))}
                    className="w-16 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={currentTheme.accent}
                    onChange={(e) => handleColorChange("accent", e.target.value)}
                    placeholder="199 89% 48%"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Presets de Tema</Label>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_THEMES.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="justify-start gap-3"
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: `hsl(${preset.primary})` }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: `hsl(${preset.secondary})` }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: `hsl(${preset.accent})` }}
                      />
                    </div>
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Preview em Tempo Real</Label>
            <div className="mt-2">
              <ThemePreview theme={currentTheme} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}