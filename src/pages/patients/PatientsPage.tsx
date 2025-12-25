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
import { UserPlus, Download, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PatientTableRow } from "./components/PatientTableRow";
import { AdvancedSearch, SearchFilters } from "./components/AdvancedSearch";
import { exportPatientsToCSV } from "./utils/exportPatients";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientTableSkeleton } from "@/components/ui/skeletons";

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

    if (filters.searchTerm) {
      matches = matches && patient.full_name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
    }

    if (filters.ageRange !== "all" && patient.birth_date) {
      const age = calculateAge(patient.birth_date);
      const [min, max] = filters.ageRange === "51+" 
        ? [51, 150]
        : filters.ageRange.split("-").map(Number);
      
      matches = matches && age >= min && age <= max;
    }

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

    return matches;
  });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="page-container overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="page-header">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pacientes</h1>
              <p className="text-muted-foreground">
                Gerencie seus pacientes e acompanhe seu progresso
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleExportCSV} className="gap-2">
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
              <Button asChild className="gap-2 shadow-sm">
                <Link to="/patients/new">
                  <UserPlus className="h-4 w-4" />
                  Novo Paciente
                </Link>
              </Button>
            </div>
          </div>

          {/* Search */}
          <AdvancedSearch
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={setFilters}
          />

          {/* Table */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="icon-box-primary">
                  <Users className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-semibold">Lista de Pacientes</CardTitle>
                <span className="ml-auto text-sm text-muted-foreground">
                  {filteredPatients?.length || 0} paciente(s)
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">Nome</TableHead>
                      <TableHead className="font-semibold">Idade</TableHead>
                      <TableHead className="font-semibold">Peso Atual</TableHead>
                      <TableHead className="font-semibold">IMC</TableHead>
                      <TableHead className="font-semibold">Próxima Consulta</TableHead>
                      <TableHead className="text-right font-semibold">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <PatientTableSkeleton rows={5} />
                    ) : filteredPatients?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-12 w-12 text-muted-foreground/50" />
                            <span className="text-muted-foreground">Nenhum paciente encontrado</span>
                          </div>
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}