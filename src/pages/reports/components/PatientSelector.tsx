import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "../types";

interface PatientSelectorProps {
  patients: Patient[];
  value: string | null;
  onChange: (value: string) => void;
}

export function PatientSelector({ patients, value, onChange }: PatientSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="patient">Paciente</Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id="patient">
          <SelectValue placeholder="Selecione um paciente" />
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
