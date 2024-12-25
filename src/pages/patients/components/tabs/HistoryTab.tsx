import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConsultationForm } from "@/components/patients/ConsultationForm";
import { format } from "date-fns";
import { useState } from "react";

interface HistoryTabProps {
  patientId: string;
  patient: any; // TODO: Add proper type
  consultations: any[]; // TODO: Add proper type
}

export function HistoryTab({ patientId, patient, consultations }: HistoryTabProps) {
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histórico de Atendimentos</CardTitle>
        <Dialog open={isConsultationDialogOpen} onOpenChange={setIsConsultationDialogOpen}>
          <DialogTrigger asChild>
            <Button>Novo Atendimento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Atendimento</DialogTitle>
            </DialogHeader>
            <ConsultationForm
              patientId={patientId}
              patientHeight={patient?.height}
              onSuccess={() => setIsConsultationDialogOpen(false)}
              onCancel={() => setIsConsultationDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consultations?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum atendimento registrado
            </p>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Data</th>
                    <th className="p-2 text-left">Peso</th>
                    <th className="p-2 text-left">IMC</th>
                    <th className="p-2 text-left">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations?.map((consultation) => (
                    <tr key={consultation.id} className="border-b">
                      <td className="p-2">
                        {format(new Date(consultation.consultation_date), "dd/MM/yyyy")}
                      </td>
                      <td className="p-2">{consultation.weight} kg</td>
                      <td className="p-2">{consultation.bmi}</td>
                      <td className="p-2">{consultation.observations || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}