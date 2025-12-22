import { useState, useEffect } from "react";
import { Plus, ChefHat } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Recipe } from "./types";
import { RecipesList } from "./components/RecipesList";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeViewer } from "./components/RecipeViewer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          recipe_ingredients (*)
        `)
        .eq("nutritionist_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Erro ao carregar receitas",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleCreate = () => {
    setSelectedRecipe(null);
    setIsFormOpen(true);
  };

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleView = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsViewerOpen(true);
  };

  const handleDelete = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId);

      if (error) throw error;

      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      toast({
        title: "Receita excluída",
        description: "A receita foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a receita.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedRecipe(null);
    fetchRecipes();
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  Receitas
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Receitas</h1>
              <p className="text-muted-foreground">
                Cadastre e gerencie suas receitas com cálculo nutricional automático
              </p>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Receita
            </Button>
          </div>

          <RecipesList
            recipes={recipes}
            isLoading={isLoading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedRecipe ? "Editar Receita" : "Nova Receita"}
              </DialogTitle>
            </DialogHeader>
            <RecipeForm
              recipe={selectedRecipe}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <RecipeViewer recipe={selectedRecipe} />
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
