import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface ReportActionsProps {
  onPrint: () => void;
  onExportPDF: () => void;
  disabled?: boolean;
}

export function ReportActions({ onPrint, onExportPDF, disabled }: ReportActionsProps) {
  return (
    <div className="flex gap-2 print:hidden">
      <Button onClick={onPrint} disabled={disabled} variant="outline">
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>
      <Button onClick={onExportPDF} disabled={disabled}>
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
    </div>
  );
}
