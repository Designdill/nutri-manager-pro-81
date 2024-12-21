import { Patient } from "@/integrations/supabase/types/patients";

export function exportPatientsToCSV(patients: Patient[]) {
  const headers = [
    "Nome Completo",
    "Email",
    "Telefone",
    "Data de Nascimento",
    "Peso Atual",
    "IMC",
    "Próxima Consulta",
  ];

  const csvContent = [
    headers.join(","),
    ...patients.map((patient) => {
      const bmi = patient.current_weight && patient.height
        ? (patient.current_weight / Math.pow(patient.height / 100, 2)).toFixed(1)
        : "";

      return [
        `"${patient.full_name}"`,
        `"${patient.email || ""}"`,
        `"${patient.phone || ""}"`,
        `"${patient.birth_date || ""}"`,
        `"${patient.current_weight || ""}"`,
        `"${bmi}"`,
        `""`, // Next appointment will be added when we implement appointment tracking
      ].join(",");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `pacientes_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}