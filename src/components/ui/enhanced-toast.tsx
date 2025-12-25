import { toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

// Animated success icon
const SuccessIcon = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
    <CheckCircle2 className="h-5 w-5 text-green-500 animate-scale-in" />
  </div>
);

// Animated error icon
const ErrorIcon = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-destructive/20 rounded-full animate-pulse" />
    <XCircle className="h-5 w-5 text-destructive animate-scale-in" />
  </div>
);

// Animated warning icon
const WarningIcon = () => (
  <div className="relative flex items-center justify-center">
    <AlertTriangle className="h-5 w-5 text-amber-500 animate-bounce" style={{ animationDuration: '0.5s', animationIterationCount: 2 }} />
  </div>
);

// Animated info icon
const InfoIcon = () => (
  <div className="relative flex items-center justify-center">
    <Info className="h-5 w-5 text-blue-500 animate-fade-in" />
  </div>
);

// Loading icon
const LoadingIcon = () => (
  <Loader2 className="h-5 w-5 text-primary animate-spin" />
);

export const toast = {
  success: (message: string, options?: { description?: string }) => {
    sonnerToast.success(message, {
      icon: <SuccessIcon />,
      description: options?.description,
      className: "toast-success",
    });
  },
  
  error: (message: string, options?: { description?: string }) => {
    sonnerToast.error(message, {
      icon: <ErrorIcon />,
      description: options?.description,
      className: "toast-error",
    });
  },
  
  warning: (message: string, options?: { description?: string }) => {
    sonnerToast.warning(message, {
      icon: <WarningIcon />,
      description: options?.description,
      className: "toast-warning",
    });
  },
  
  info: (message: string, options?: { description?: string }) => {
    sonnerToast.info(message, {
      icon: <InfoIcon />,
      description: options?.description,
      className: "toast-info",
    });
  },
  
  loading: (message: string) => {
    return sonnerToast.loading(message, {
      icon: <LoadingIcon />,
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
    });
  },
  
  dismiss: sonnerToast.dismiss,
};
