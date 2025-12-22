import { useState } from "react";
import { Eye, Pencil, Trash2, Clock, Users, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Recipe, RECIPE_CATEGORIES } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipesListProps {
  recipes: Recipe[];
  isLoading: boolean;
  onEdit: (recipe: Recipe) => void;
  onView: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
}

export function RecipesList({
  recipes,
  isLoading,
  onEdit,
  onView,
  onDelete,
}: RecipesListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || recipe.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar receitas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="sm:max-w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {RECIPE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredRecipes.length === 0 ? (
        <Card className="p-8 text-center">
          <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {recipes.length === 0
              ? "Nenhuma receita cadastrada. Clique em 'Nova Receita' para começar."
              : "Nenhuma receita encontrada com os filtros aplicados."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">
                    {recipe.title}
                  </CardTitle>
                  <Badge variant="secondary">{recipe.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {recipe.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {recipe.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  {recipe.preparation_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.preparation_time} min
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings} porção(ões)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="bg-muted p-2 rounded">
                    <span className="text-muted-foreground">Calorias:</span>
                    <span className="font-medium ml-1">
                      {Math.round(recipe.total_calories)} kcal
                    </span>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-muted-foreground">Proteínas:</span>
                    <span className="font-medium ml-1">
                      {Math.round(recipe.total_proteins)}g
                    </span>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-muted-foreground">Carbos:</span>
                    <span className="font-medium ml-1">
                      {Math.round(recipe.total_carbohydrates)}g
                    </span>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-muted-foreground">Gorduras:</span>
                    <span className="font-medium ml-1">
                      {Math.round(recipe.total_fats)}g
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(recipe)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(recipe)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir receita?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A receita será permanentemente
              removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
