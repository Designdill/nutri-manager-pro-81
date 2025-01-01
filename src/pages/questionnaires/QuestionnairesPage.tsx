import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { QuestionnairesList } from "./components/QuestionnairesList";

export default function QuestionnairesPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Questionários</h1>
          <Button asChild>
            <Link to="/questionnaires/new">
              <Plus className="w-4 h-4 mr-2" />
              Novo Questionário
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Questionários Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionnairesList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}