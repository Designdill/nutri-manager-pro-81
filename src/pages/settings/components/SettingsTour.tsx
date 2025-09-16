import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "header",
    title: "Bem-vindo às Configurações!",
    description: "Aqui você pode personalizar sua experiência e gerenciar todas as configurações do sistema.",
    target: "h1",
    position: "bottom",
  },
  {
    id: "search",
    title: "Busca Rápida",
    description: "Use a barra de pesquisa para encontrar rapidamente qualquer configuração. Experimente digitar 'tema' ou 'email'.",
    target: "[data-tour='search']",
    position: "bottom",
  },
  {
    id: "view-toggle",
    title: "Modos de Visualização",
    description: "Alterne entre visualização compacta e detalhada. Use as estrelas para marcar suas configurações favoritas!",
    target: "[data-tour='view-toggle']",
    position: "bottom",
  },
  {
    id: "tabs",
    title: "Navegação por Abas",
    description: "As configurações são organizadas em categorias. Use Alt + ← → para navegar ou Alt + número (1-7) para ir direto.",
    target: "[role='tablist']",
    position: "bottom",
  },
  {
    id: "theme",
    title: "Personalização de Tema",
    description: "Na aba Aparência, você encontra o editor avançado de temas com preview em tempo real e presets prontos.",
    target: "[value='appearance']",
    position: "right",
  },
  {
    id: "shortcuts",
    title: "Atalhos de Teclado",
    description: "Use Ctrl+S para salvar, Ctrl+K para pesquisar, Ctrl+R para redefinir. Todos os atalhos estão disponíveis!",
    target: "[type='submit']",
    position: "top",
  },
];

const TOUR_STORAGE_KEY = "settings-tour-completed";

export function SettingsTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      setShowStartButton(true);
    }
  }, []);

  const startTour = () => {
    setIsActive(true);
    setShowStartButton(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setIsActive(false);
    setShowStartButton(false);
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  };

  const skipTour = () => {
    completeTour();
  };

  const resetTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setShowStartButton(true);
  };

  if (showStartButton) {
    return (
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm">Tour Guiado</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStartButton(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="mb-3">
            Primeira vez aqui? Faça um tour rápido para conhecer todas as funcionalidades!
          </CardDescription>
          <div className="flex gap-2">
            <Button size="sm" onClick={startTour}>
              Iniciar Tour
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowStartButton(false)}>
              Talvez depois
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isActive) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={resetTour}
        className="fixed bottom-4 right-4 z-50"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Tour
      </Button>
    );
  }

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={skipTour} />
      
      {/* Tour Card */}
      <Card className={cn(
        "fixed z-50 w-80 shadow-lg",
        "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {currentStep + 1} de {TOUR_STEPS.length}
              </Badge>
              <CardTitle className="text-sm">{step.title}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTour}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription>{step.description}</CardDescription>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={skipTour}>
                Pular
              </Button>
              <Button size="sm" onClick={nextStep} className="gap-2">
                {currentStep === TOUR_STEPS.length - 1 ? "Finalizar" : "Próximo"}
                {currentStep < TOUR_STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}