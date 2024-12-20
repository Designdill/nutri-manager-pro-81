import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PatientTableRow } from "./components/PatientTableRow";

export default function PatientsPage() {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredPatients = patients?.filter((patient) => {
    const matchesSearch = patient.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <Button asChild>
            <Link to="/patients/new">
              <UserPlus className="mr-2" />
              Adicionar Novo Paciente
            </Link>
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Buscar pacientes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

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