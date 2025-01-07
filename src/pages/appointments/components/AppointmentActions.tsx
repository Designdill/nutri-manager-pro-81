import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RescheduleDialog } from "./actions/RescheduleDialog";
import { CancelDialog } from "./actions/CancelDialog";

export interface AppointmentActionsProps {
  appointment: {
    id: string;
    scheduled_at: string;
    status: "confirmed" | "pending" | "cancelled";
  };
  onUpdate: () => void;
}

export function AppointmentActions({ appointment, onUpdate }: AppointmentActionsProps) {
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  if (appointment.status === "cancelled") {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsRescheduleOpen(true)}
        className="hover:scale-105 transition-transform"
      >
        Remarcar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsCancelOpen(true)}
        className="hover:scale-105 transition-transform"
      >
        Cancelar
      </Button>

      <RescheduleDialog
        appointment={appointment}
        isOpen={isRescheduleOpen}
        onOpenChange={setIsRescheduleOpen}
        onUpdate={onUpdate}
      />

      <CancelDialog
        appointment={appointment}
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        onUpdate={onUpdate}
      />
    </div>
  );
}