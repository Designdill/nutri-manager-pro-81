import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";

interface UseAutoSaveOptions {
  delay?: number;
  onSave: (data: any) => Promise<void>;
  enabled?: boolean;
}

export function useAutoSave<T>(
  form: UseFormReturn<T>,
  options: UseAutoSaveOptions
) {
  const { delay = 3000, onSave, enabled = true } = options;
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const hasUnsavedChangesRef = useRef(false);

  // Watch for form changes
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch(() => {
      if (!hasUnsavedChangesRef.current) {
        hasUnsavedChangesRef.current = true;
        setSaveStatus('unsaved');
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for auto-save
      timeoutRef.current = setTimeout(async () => {
        if (hasUnsavedChangesRef.current && form.formState.isValid) {
          try {
            setSaveStatus('saving');
            const data = form.getValues();
            await onSave(data);
            setSaveStatus('saved');
            setLastSaved(new Date());
            hasUnsavedChangesRef.current = false;
          } catch (error) {
            setSaveStatus('error');
            toast({
              title: "Erro ao salvar",
              description: "Não foi possível salvar automaticamente. Tente salvar manualmente.",
              variant: "destructive",
            });
          }
        }
      }, delay);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, delay, onSave, enabled, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const saveNow = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      setSaveStatus('saving');
      const data = form.getValues();
      await onSave(data);
      setSaveStatus('saved');
      setLastSaved(new Date());
      hasUnsavedChangesRef.current = false;
    } catch (error) {
      setSaveStatus('error');
      throw error;
    }
  };

  return {
    saveStatus,
    lastSaved,
    saveNow,
    hasUnsavedChanges: hasUnsavedChangesRef.current
  };
}