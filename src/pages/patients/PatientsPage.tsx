import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PatientTableRow } from "./components/PatientTableRow";
import { AdvancedSearch, SearchFilters } from "./components/AdvancedSearch";
import { exportPatientsToCSV } from "./utils/exportPatients";
import { useToast } from "@/hooks/use-toast";

export default function PatientsPage() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    ageRange: "all",
    bmiRange: "all",
    nextAppointment: "all",
  });

  const { data: patients, isLoading, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("nutritionist_id", session?.user.id);

      if (error) {
        console.error("Error fetching patients:", error);
        throw error;
      }

      return data;
    },
  });

  const handleExportCSV = () => {
    if (filteredPatients && filteredPatients.length > 0) {
      exportPatientsToCSV(filteredPatients);
      toast({
        title: "Exportação concluída",
        description: "Os dados dos pacientes foram exportados com sucesso.",
      });
    } else {
      toast({
        title: "Erro na exportação",
        description: "Não há dados para exportar.",
        variant: "destructive",
      });
    }
  };

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
    return weight / Math.pow(height / 100, 2);
  };

  const filteredPatients = patients?.filter((patient) => {
    let matches = true;

    // Name search
    if (filters.searchTerm) {
      matches = matches && patient.full_name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
    }

    // Age filter
    if (filters.ageRange !== "all" && patient.birth_date) {
      const age = calculateAge(patient.birth_date);
      const [min, max] = filters.ageRange === "51+" 
        ? [51, 150]
        : filters.ageRange.split("-").map(Number);
      
      matches = matches && age >= min && age <= max;
    }

    // BMI filter
    if (filters.bmiRange !== "all" && patient.current_weight && patient.height) {
      const bmi = calculateBMI(patient.current_weight, patient.height);
      
      switch (filters.bmiRange) {
        case "under":
          matches = matches && bmi < 18.5;
          break;
        case "normal":
          matches = matches && bmi >= 18.5 && bmi < 25;
          break;
        case "over":
          matches = matches && bmi >= 25 && bmi < 30;
          break;
        case "obese":
          matches = matches && bmi >= 30;
          break;
      }
    }

    // Next appointment filter will be implemented when we add appointment tracking

    return matches;
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button asChild>
              <Link to="/patients/new">
                <UserPlus className="mr-2" />
                Adicionar Novo Paciente
              </Link>
            </Button>
          </div>
        </div>

        <AdvancedSearch
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={setFilters}
        />

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Peso Atual</TableHead>
                <TableHead>IMC</TableHead>
                <TableHead>Próxima Consulta</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredPatients?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum paciente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients?.map((patient) => (
                  <PatientTableRow 
                    key={patient.id} 
                    patient={patient} 
                    onDelete={refetch}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}