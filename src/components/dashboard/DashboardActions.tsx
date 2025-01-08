import { Button } from "@/components/ui/button";
import { UserPlus, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardActions() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <Button
        size="lg"
        className="w-full md:w-auto"
        onClick={() => navigate("/patients/new")}
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Novo Paciente
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-full md:w-auto"
        onClick={() => navigate("/appointments/new")}
      >
        <CalendarPlus className="mr-2 h-5 w-5" />
        Nova Consulta
      </Button>
    </div>
  );
}