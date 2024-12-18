import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Food, OpenFoodFactsProduct } from "./types";
import { FoodForm } from "./components/FoodForm";
import { FoodTable } from "./components/FoodTable";

export default function FoodDatabasePage() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFood, setNewFood] = useState<Partial<Food>>({});

  const { data: foods, refetch } = useQuery({
    queryKey: ["foods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching foods:", error);
        throw error;
      }

      return data as Food[];
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

    const { error } = await supabase.from("foods").insert([newFood]);

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
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Banco de Alimentos</h1>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar no Open Food Facts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button onClick={searchOpenFoodFacts}>
                <SearchIcon className="mr-2" />
                Buscar
              </Button>
            </div>
            <Button onClick={() => setIsAdding(!isAdding)}>
              <PlusIcon className="mr-2" />
              Adicionar Alimento
            </Button>
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

        <FoodTable foods={foods || []} />
      </div>
    </div>
  );
}