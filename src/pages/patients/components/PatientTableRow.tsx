import { TableCell, TableRow } from "@/components/ui/table";
import { PatientActions } from "./PatientActions";

interface Patient {
  id: string;
  full_name: string;
  birth_date: string | null;
  current_weight: number | null;
  height: number | null;
  next_appointment?: string;
}

interface PatientTableRowProps {
  patient: Patient;
  onDelete: () => void;
}

export function PatientTableRow({ patient, onDelete }: PatientTableRowProps) {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {patient.full_name}
      </TableCell>
      <TableCell>
        {patient.birth_date ? calculateAge(patient.birth_date) : "-"}
      </TableCell>
      <TableCell>{patient.current_weight} kg</TableCell>
      <TableCell>
        {patient.current_weight && patient.height
          ? calculateBMI(patient.current_weight, patient.height)
          : "-"}
      </TableCell>
      <TableCell>
        {patient.next_appointment
          ? new Date(patient.next_appointment).toLocaleDateString()
          : "Não agendada"}
      </TableCell>
      <TableCell className="text-right">
        <PatientActions patientId={patient.id} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}