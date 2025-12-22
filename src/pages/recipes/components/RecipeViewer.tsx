import { Clock, Users, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Recipe } from "../types";

interface RecipeViewerProps {
  recipe: Recipe | null;
}

export function RecipeViewer({ recipe }: RecipeViewerProps) {
  if (!recipe) return null;

  const perServing = recipe.servings > 0 ? recipe.servings : 1;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            {recipe.title}
          </h2>
          <Badge variant="secondary">{recipe.category}</Badge>
        </div>

        {recipe.description && (
          <p className="text-muted-foreground">{recipe.description}</p>
        )}

        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
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
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Informação Nutricional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Receita completa</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
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
                  <span className="text-muted-foreground">Carboidratos:</span>
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
                <div className="bg-muted p-2 rounded col-span-2">
                  <span className="text-muted-foreground">Fibras:</span>
                  <span className="font-medium ml-1">
                    {Math.round(recipe.total_fiber)}g
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Por porção</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-primary/10 p-2 rounded">
                  <span className="text-muted-foreground">Calorias:</span>
                  <span className="font-medium ml-1">
                    {Math.round(recipe.total_calories / perServing)} kcal
                  </span>
                </div>
                <div className="bg-primary/10 p-2 rounded">
                  <span className="text-muted-foreground">Proteínas:</span>
                  <span className="font-medium ml-1">
                    {Math.round(recipe.total_proteins / perServing)}g
                  </span>
                </div>
                <div className="bg-primary/10 p-2 rounded">
                  <span className="text-muted-foreground">Carboidratos:</span>
                  <span className="font-medium ml-1">
                    {Math.round(recipe.total_carbohydrates / perServing)}g
                  </span>
                </div>
                <div className="bg-primary/10 p-2 rounded">
                  <span className="text-muted-foreground">Gorduras:</span>
                  <span className="font-medium ml-1">
                    {Math.round(recipe.total_fats / perServing)}g
                  </span>
                </div>
                <div className="bg-primary/10 p-2 rounded col-span-2">
                  <span className="text-muted-foreground">Fibras:</span>
                  <span className="font-medium ml-1">
                    {Math.round(recipe.total_fiber / perServing)}g
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Ingredientes</h3>
          <ul className="space-y-2">
            {recipe.recipe_ingredients.map((ing, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-muted/50 rounded"
              >
                <span>{ing.food_name}</span>
                <span className="text-muted-foreground">
                  {ing.quantity} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.instructions && (
        <div>
          <Separator className="my-4" />
          <h3 className="font-semibold mb-3">Modo de Preparo</h3>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-muted-foreground">
              {recipe.instructions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
