import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AppointmentFilters {
  searchTerm: string;
  status: "all" | "pending" | "confirmed" | "cancelled";
  appointmentType: "all" | "consulta_inicial" | "retorno" | "emergencia" | "telemedicina";
}

interface AppointmentFiltersProps {
  filters: AppointmentFilters;
  onFiltersChange: (filters: AppointmentFilters) => void;
  appointmentCount: number;
}

export function AppointmentFiltersComponent({ 
  filters, 
  onFiltersChange, 
  appointmentCount 
}: AppointmentFiltersProps) {
  const updateFilter = (key: keyof AppointmentFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: "",
      status: "all",
      appointmentType: "all",
    });
  };

  const hasActiveFilters = filters.searchTerm || filters.status !== "all" || filters.appointmentType !== "all";

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendente",
      confirmed: "Confirmada",
      cancelled: "Cancelada",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      consulta_inicial: "Consulta Inicial",
      retorno: "Retorno",
      emergencia: "Emergência",
      telemedicina: "Telemedicina",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filtros</span>
          <Badge variant="secondary">{appointmentCount} consulta(s)</Badge>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por paciente..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value: any) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="confirmed">Confirmada</SelectItem>
            <SelectItem value="cancelled">Cancelada</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.appointmentType}
          onValueChange={(value: any) => updateFilter("appointmentType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="consulta_inicial">Consulta Inicial</SelectItem>
            <SelectItem value="retorno">Retorno</SelectItem>
            <SelectItem value="emergencia">Emergência</SelectItem>
            <SelectItem value="telemedicina">Telemedicina</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="outline">
              Busca: "{filters.searchTerm}"
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="outline">
              Status: {getStatusLabel(filters.status)}
            </Badge>
          )}
          {filters.appointmentType !== "all" && (
            <Badge variant="outline">
              Tipo: {getTypeLabel(filters.appointmentType)}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}