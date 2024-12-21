import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export interface SearchFilters {
  searchTerm: string;
  ageRange: string;
  bmiRange: string;
  nextAppointment: string;
}

export function AdvancedSearch({ onSearch, searchTerm, onSearchTermChange }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: searchTerm,
    ageRange: "all",
    bmiRange: "all",
    nextAppointment: "all",
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Buscar pacientes..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => {
            onSearchTermChange(e.target.value);
            handleFilterChange("searchTerm", e.target.value);
          }}
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtros Avançados
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros Avançados</SheetTitle>
            <SheetDescription>
              Refine sua busca usando os filtros abaixo
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Faixa Etária</label>
              <Select
                value={filters.ageRange}
                onValueChange={(value) => handleFilterChange("ageRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa etária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as idades</SelectItem>
                  <SelectItem value="18-30">18-30 anos</SelectItem>
                  <SelectItem value="31-50">31-50 anos</SelectItem>
                  <SelectItem value="51+">51+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">IMC</label>
              <Select
                value={filters.bmiRange}
                onValueChange={(value) => handleFilterChange("bmiRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa de IMC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="under">Abaixo do peso (&lt;18.5)</SelectItem>
                  <SelectItem value="normal">Peso normal (18.5-24.9)</SelectItem>
                  <SelectItem value="over">Sobrepeso (25-29.9)</SelectItem>
                  <SelectItem value="obese">Obeso (≥30)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Próxima Consulta</label>
              <Select
                value={filters.nextAppointment}
                onValueChange={(value) => handleFilterChange("nextAppointment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="none">Sem consulta marcada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}