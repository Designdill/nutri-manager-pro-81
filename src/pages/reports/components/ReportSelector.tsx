import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportType } from "../types";

interface ReportSelectorProps {
  value: ReportType;
  onChange: (value: ReportType) => void;
}

export function ReportSelector({ value, onChange }: ReportSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="report-type">Tipo de Relatório</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="report-type">
          <SelectValue placeholder="Selecione o tipo de relatório" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="anamnese">📋 Anamnese Completa</SelectItem>
          <SelectItem value="evolution">📈 Relatório de Evolução</SelectItem>
          <SelectItem value="measurements">📊 Comparativo de Medidas</SelectItem>
          <SelectItem value="nutritional">🥗 Relatório Nutricional</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
