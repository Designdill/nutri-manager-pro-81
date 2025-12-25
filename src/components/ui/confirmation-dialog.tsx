import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "warning" | "default";
  onConfirm: () => void | Promise<void>;
  icon?: React.ReactNode;
}

const variantStyles = {
  destructive: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    buttonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    Icon: Trash2,
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    buttonClass: "bg-amber-500 text-white hover:bg-amber-600",
    Icon: AlertTriangle,
  },
  default: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    Icon: Save,
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  onConfirm,
  icon,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const styles = variantStyles[variant];
  const IconComponent = styles.Icon;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center sm:items-center">
          {/* Animated Icon */}
          <div className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-full animate-scale-in",
            styles.iconBg
          )}>
            {icon || (
              <IconComponent className={cn("h-8 w-8 animate-fade-in", styles.iconColor)} />
            )}
          </div>
          
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
          <AlertDialogCancel 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading}
            className={cn("min-w-[120px] gap-2", styles.buttonClass)}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easier usage
export function useConfirmation() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    props: Omit<ConfirmationDialogProps, "open" | "onOpenChange">;
  }>({
    open: false,
    props: {
      title: "",
      description: "",
      onConfirm: () => {},
    },
  });

  const confirm = (props: Omit<ConfirmationDialogProps, "open" | "onOpenChange">) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        props: {
          ...props,
          onConfirm: async () => {
            await props.onConfirm();
            resolve(true);
          },
        },
      });
    });
  };

  const Dialog = () => (
    <ConfirmationDialog
      open={dialogState.open}
      onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      {...dialogState.props}
    />
  );

  return { confirm, Dialog };
}
