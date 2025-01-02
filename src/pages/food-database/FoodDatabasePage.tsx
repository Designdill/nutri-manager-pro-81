import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon, FilterIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Food, OpenFoodFactsProduct, NewFood } from "./types";
import { FoodForm } from "./components/FoodForm";
import { FoodTable } from "./components/FoodTable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function FoodDatabasePage() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFood, setNewFood] = useState<Partial<NewFood>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: foods, isLoading, refetch } = useQuery({
    queryKey: ["foods", selectedCategory],
    queryFn: async () => {
      console.log("Fetching foods with category filter:", selectedCategory);
      let query = supabase.from("foods").select("*");
      
      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }
      
      const { data, error } = await query.order("name");

      if (error) {
        console.error("Error fetching foods:", error);
        throw error;
      }

      return data as Food[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["food-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("foods")
        .select("category")
        .distinct();

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      return data.map(item => item.category);
    },
  });

  const handleAddFood = async () => {
    if (!newFood.name || !newFood.category) {
      toast({
        title: "Erro",
        description: "Nome e categoria são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("foods").insert([{
      name: newFood.name,
      category: newFood.category,
      calories: newFood.calories || null,
      proteins: newFood.proteins || null,
      carbohydrates: newFood.carbohydrates || null,
      fats: newFood.fats || null,
      fiber: newFood.fiber || null,
      serving_size: newFood.serving_size || null,
      serving_unit: newFood.serving_unit || null,
    }]);

    if (error) {
      console.error("Error adding food:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar alimento",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Alimento adicionado com sucesso",
    });

    setNewFood({});
    setIsAdding(false);
    refetch();
  };

  const searchOpenFoodFacts = async () => {
    if (!searchTerm) {
      toast({
        title: "Erro",
        description: "Digite um termo para buscar",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://br.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          searchTerm
        )}&json=1&page=1&page_size=20`
      );
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        const product = data.products[0] as OpenFoodFactsProduct;
        setNewFood({
          name: product.product_name,
          category: product.categories?.split(",")[0] || "Outros",
          calories: product.nutriments["energy-kcal_100g"] || null,
          proteins: product.nutriments.proteins_100g || null,
          carbohydrates: product.nutriments.carbohydrates_100g || null,
          fats: product.nutriments.fat_100g || null,
          fiber: product.nutriments.fiber_100g || null,
          serving_size: 100,
          serving_unit: "g",
        });
        setIsAdding(true);
      } else {
        toast({
          title: "Aviso",
          description: "Nenhum alimento encontrado",
        });
      }
    } catch (error) {
      console.error("Error searching OpenFoodFacts:", error);
      toast({
        title: "Erro",
        description: "Erro ao buscar alimento",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Banco de Alimentos</CardTitle>
            <CardDescription>
              Gerencie o catálogo de alimentos e suas informações nutricionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Buscar no Open Food Facts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64"
                    />
                    <Button onClick={searchOpenFoodFacts}>
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Buscar
                    </Button>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:w-[200px]"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      {categories?.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <Button onClick={() => setIsAdding(!isAdding)}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Adicionar Alimento
                    </Button>
                  </div>
                </div>
              </div>

              {isAdding && (
                <FoodForm
                  newFood={newFood}
                  setNewFood={setNewFood}
                  onSubmit={handleAddFood}
                  onCancel={() => setIsAdding(false)}
                />
              )}

              {isLoading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : (
                <FoodTable foods={foods || []} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}