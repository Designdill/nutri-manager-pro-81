import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Sparkles, Users, Calendar, Utensils, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  icon: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right" | "center";
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao NutriPro! 🎉",
    description: "Vamos fazer um tour rápido para você conhecer as principais funcionalidades do sistema.",
    icon: <Sparkles className="h-6 w-6" />,
    position: "center",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Aqui você tem uma visão geral do seu dia: consultas agendadas, alertas de pacientes e estatísticas importantes.",
    target: "[data-tour='dashboard-stats']",
    icon: <LayoutDashboard className="h-6 w-6" />,
    position: "bottom",
  },
  {
    id: "patients",
    title: "Gestão de Pacientes",
    description: "Acesse o menu lateral para gerenciar seus pacientes, visualizar históricos e acompanhar a evolução de cada um.",
    target: "[data-tour='sidebar-patients']",
    icon: <Users className="h-6 w-6" />,
    position: "right",
  },
  {
    id: "appointments",
    title: "Agendamentos",
    description: "Gerencie suas consultas, visualize o calendário e receba lembretes automáticos.",
    target: "[data-tour='sidebar-appointments']",
    icon: <Calendar className="h-6 w-6" />,
    position: "right",
  },
  {
    id: "meal-plans",
    title: "Planos Alimentares",
    description: "Crie planos alimentares personalizados com nossa base de alimentos integrada.",
    target: "[data-tour='sidebar-meal-plans']",
    icon: <Utensils className="h-6 w-6" />,
    position: "right",
  },
  {
    id: "complete",
    title: "Tudo Pronto! ✨",
    description: "Você está pronto para começar. Explore o sistema e, se precisar de ajuda, clique no ícone de ajuda no menu.",
    icon: <Sparkles className="h-6 w-6" />,
    position: "center",
  },
];

const TOUR_STORAGE_KEY = "nutripro-onboarding-completed";

interface OnboardingTourProps {
  forceShow?: boolean;
}

export function OnboardingTour({ forceShow = false }: OnboardingTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted || forceShow) {
      // Small delay to let the page render
      const timer = setTimeout(() => setIsActive(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  // Find and highlight target element
  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isActive]);

  const nextStep = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const completeTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  }, []);

  const skipTour = useCallback(() => {
    completeTour();
  }, [completeTour]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipTour();
      if (e.key === "ArrowRight" || e.key === "Enter") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, nextStep, prevStep, skipTour]);

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  const getCardPosition = () => {
    if (!targetRect || step.position === "center") {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const padding = 16;
    const cardWidth = 380;
    const cardHeight = 200;

    switch (step.position) {
      case "bottom":
        return {
          position: "fixed" as const,
          top: `${targetRect.bottom + padding}px`,
          left: `${Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - cardWidth / 2, window.innerWidth - cardWidth - padding))}px`,
        };
      case "right":
        return {
          position: "fixed" as const,
          top: `${Math.max(padding, targetRect.top)}px`,
          left: `${targetRect.right + padding}px`,
        };
      case "left":
        return {
          position: "fixed" as const,
          top: `${Math.max(padding, targetRect.top)}px`,
          left: `${targetRect.left - cardWidth - padding}px`,
        };
      case "top":
        return {
          position: "fixed" as const,
          top: `${targetRect.top - cardHeight - padding}px`,
          left: `${Math.max(padding, targetRect.left + targetRect.width / 2 - cardWidth / 2)}px`,
        };
      default:
        return {
          position: "fixed" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[9998] transition-opacity duration-300"
        onClick={skipTour}
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Target highlight */}
      {targetRect && (
        <div
          className="fixed z-[9999] pointer-events-none rounded-lg ring-4 ring-primary ring-offset-2 ring-offset-background animate-pulse"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* Tour Card */}
      <Card 
        className="fixed z-[10000] w-[380px] shadow-2xl border-primary/20 animate-scale-in"
        style={getCardPosition()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary animate-fade-in">
                {step.icon}
              </div>
              <div>
                <Badge variant="secondary" className="mb-1 text-xs">
                  {currentStep + 1} de {TOUR_STEPS.length}
                </Badge>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={skipTour} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            {step.description}
          </CardDescription>

          {/* Progress bar */}
          <Progress value={progress} className="h-1" />

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex gap-1">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-300",
                    index === currentStep 
                      ? "w-4 bg-primary" 
                      : index < currentStep 
                        ? "bg-primary/60" 
                        : "bg-muted"
                  )}
                />
              ))}
            </div>

            <Button size="sm" onClick={nextStep} className="gap-1">
              {currentStep === TOUR_STEPS.length - 1 ? "Começar" : "Próximo"}
              {currentStep < TOUR_STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>,
    document.body
  );
}

// Export function to restart tour
export function resetOnboardingTour() {
  localStorage.removeItem(TOUR_STORAGE_KEY);
}

// Export function to check if tour was completed
export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(TOUR_STORAGE_KEY) === "true";
}
