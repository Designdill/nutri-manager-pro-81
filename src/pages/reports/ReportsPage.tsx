import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { toast } from "sonner";
import { ReportSelector } from "./components/ReportSelector";
import { PatientSelector } from "./components/PatientSelector";
import { DateRangeSelector } from "./components/DateRangeSelector";
import { ReportActions } from "./components/ReportActions";
import { AnamneseReport } from "./components/reports/AnamneseReport";
import { EvolutionReport } from "./components/reports/EvolutionReport";
import { MeasurementsReport } from "./components/reports/MeasurementsReport";
import { NutritionalReport } from "./components/reports/NutritionalReport";
import { ReportFilters, Patient, Consultation, MealPlan } from "./types";
import { subDays } from "date-fns";

export default function ReportsPage() {
  const { session } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    reportType: "evolution",
    patientId: null,
    startDate: subDays(new Date(), 90),
    endDate: new Date(),
  });
  const [reportData, setReportData] = useState<{
    patient: Patient | null;
    consultations: Consultation[];
    mealPlan: MealPlan | null;
  }>({
    patient: null,
    consultations: [],
    mealPlan: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  useEffect(() => {
    loadPatients();
  }, [session]);

  const loadPatients = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("nutritionist_id", session.user.id)
      .order("full_name");

    if (error) {
      toast.error("Erro ao carregar pacientes");
      console.error(error);
      return;
    }

    setPatients(data || []);
  };

  const generateReport = async () => {
    if (!filters.patientId) {
      toast.error("Selecione um paciente");
      return;
    }

    setIsLoading(true);
    setReportGenerated(false);

    try {
      // Load patient data
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", filters.patientId)
        .single();

      if (patientError) throw patientError;

      // Load consultations based on date range
      let consultationsQuery = supabase
        .from("consultations")
        .select("*")
        .eq("patient_id", filters.patientId)
        .order("consultation_date", { ascending: true });

      if (filters.startDate) {
        consultationsQuery = consultationsQuery.gte("consultation_date", filters.startDate.toISOString());
      }
      if (filters.endDate) {
        consultationsQuery = consultationsQuery.lte("consultation_date", filters.endDate.toISOString());
      }

      const { data: consultations, error: consultationsError } = await consultationsQuery;

      if (consultationsError) throw consultationsError;

      // Load meal plan for nutritional report
      let mealPlan = null;
      if (filters.reportType === "nutritional") {
        const { data: mealPlanData, error: mealPlanError } = await supabase
          .from("meal_plans")
          .select("*")
          .eq("patient_id", filters.patientId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!mealPlanError && mealPlanData) {
          mealPlan = mealPlanData;
        }
      }

      setReportData({
        patient,
        consultations: consultations || [],
        mealPlan,
      });

      setReportGenerated(true);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
    toast.info("Use a opção 'Salvar como PDF' na caixa de diálogo de impressão");
  };

  const renderReport = () => {
    if (!reportGenerated || !reportData.patient) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Configure os filtros e clique em "Gerar Relatório" para visualizar.</p>
          </CardContent>
        </Card>
      );
    }

    switch (filters.reportType) {
      case "anamnese":
        return <AnamneseReport patient={reportData.patient} />;
      case "evolution":
        return (
          <EvolutionReport
            patient={reportData.patient}
            consultations={reportData.consultations}
            startDate={filters.startDate}
            endDate={filters.endDate}
          />
        );
      case "measurements":
        return <MeasurementsReport patient={reportData.patient} consultations={reportData.consultations} />;
      case "nutritional":
        return <NutritionalReport patient={reportData.patient} mealPlan={reportData.mealPlan} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Gere relatórios profissionais para seus pacientes</p>
      </div>

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Configuração do Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportSelector
              value={filters.reportType}
              onChange={(value) => setFilters({ ...filters, reportType: value })}
            />
            <PatientSelector
              patients={patients}
              value={filters.patientId}
              onChange={(value) => setFilters({ ...filters, patientId: value })}
            />
          </div>

          {filters.reportType === "evolution" && (
            <>
              <Separator />
              <DateRangeSelector
                startDate={filters.startDate}
                endDate={filters.endDate}
                onStartDateChange={(date) => setFilters({ ...filters, startDate: date })}
                onEndDateChange={(date) => setFilters({ ...filters, endDate: date })}
              />
            </>
          )}

          <div className="flex justify-between items-center">
            <Button onClick={generateReport} disabled={isLoading || !filters.patientId} size="lg">
              {isLoading ? "Gerando..." : "Gerar Relatório"}
            </Button>
            {reportGenerated && (
              <ReportActions onPrint={handlePrint} onExportPDF={handleExportPDF} disabled={!reportGenerated} />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="print:p-8">{renderReport()}</div>
    </div>
  );
}
