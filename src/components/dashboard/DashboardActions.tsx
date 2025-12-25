import { Button } from "@/components/ui/button";
import { UserPlus, CalendarPlus, BookOpen, FileCheck2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "accent" | "muted";
}

function QuickAction({ icon: Icon, label, description, onClick, variant = "muted" }: QuickActionProps) {
  const variants = {
    primary: "border-primary/20 hover:border-primary/40 hover:bg-primary/5",
    secondary: "border-secondary/20 hover:border-secondary/40 hover:bg-secondary/5",
    accent: "border-accent/20 hover:border-accent/40 hover:bg-accent/5",
    muted: "border-border hover:border-primary/30 hover:bg-muted/50",
  };

  const iconVariants = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border bg-card text-left transition-all duration-200 group ripple",
        "hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]",
        variants[variant]
      )}
    >
      <div className={cn(
        "icon-box transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", 
        iconVariants[variant]
      )}>
        <Icon className="h-5 w-5 icon-bounce" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </button>
  );
}

export function DashboardActions() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
      <QuickAction
        icon={UserPlus}
        label="Novo Paciente"
        description="Cadastrar paciente"
        onClick={() => navigate("/patients/new")}
        variant="primary"
      />
      <QuickAction
        icon={CalendarPlus}
        label="Nova Consulta"
        description="Agendar atendimento"
        onClick={() => navigate("/appointments")}
        variant="secondary"
      />
      <QuickAction
        icon={BookOpen}
        label="Plano Alimentar"
        description="Criar novo plano"
        onClick={() => navigate("/meal-plans")}
        variant="accent"
      />
      <QuickAction
        icon={FileCheck2}
        label="Anamnese"
        description="Nova avaliação"
        onClick={() => navigate("/anamnesis")}
        variant="muted"
      />
    </div>
  );
}