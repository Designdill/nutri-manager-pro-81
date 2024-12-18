import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Food = {
  id: string;
  name: string;
  category: string;
  calories: number | null;
  proteins: number | null;
  carbohydrates: number | null;
  fats: number | null;
  fiber: number | null;
  serving_size: number | null;
  serving_unit: string | null;
};

export default function FoodDatabasePage() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newFood, setNewFood] = useState<Partial<Food>>({
    name: "",
    category: "",
    calories: null,
    proteins: null,
    carbohydrates: null,
    fats: null,
    fiber: null,
    serving_size: null,
    serving_unit: null,
  });

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

    setNewFood({
      name: "",
      category: "",
      calories: null,
      proteins: null,
      carbohydrates: null,
      fats: null,
      fiber: null,
      serving_size: null,
      serving_unit: null,
    });
    setIsAdding(false);
    refetch();
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Banco de Alimentos</h1>
          <Button onClick={() => setIsAdding(!isAdding)}>
            <PlusIcon className="mr-2" />
            Adicionar Alimento
          </Button>
        </div>

        {isAdding && (
          <div className="bg-card p-6 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                value={newFood.category}
                onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calorias (kcal)</Label>
              <Input
                id="calories"
                type="number"
                value={newFood.calories || ""}
                onChange={(e) => setNewFood({ ...newFood, calories: parseFloat(e.target.value) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proteins">Proteínas (g)</Label>
              <Input
                id="proteins"
                type="number"
                value={newFood.proteins || ""}
                onChange={(e) => setNewFood({ ...newFood, proteins: parseFloat(e.target.value) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbohydrates">Carboidratos (g)</Label>
              <Input
                id="carbohydrates"
                type="number"
                value={newFood.carbohydrates || ""}
                onChange={(e) => setNewFood({ ...newFood, carbohydrates: parseFloat(e.target.value) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fats">Gorduras (g)</Label>
              <Input
                id="fats"
                type="number"
                value={newFood.fats || ""}
                onChange={(e) => setNewFood({ ...newFood, fats: parseFloat(e.target.value) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiber">Fibras (g)</Label>
              <Input
                id="fiber"
                type="number"
                value={newFood.fiber || ""}
                onChange={(e) => setNewFood({ ...newFood, fiber: parseFloat(e.target.value) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serving_size">Porção</Label>
              <Input
                id="serving_size"
                type="number"
                value={newFood.serving_size || ""}
                onChange={(e) => setNewFood({ ...newFood, serving_size: parseFloat(e.target.value) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serving_unit">Unidade da Porção</Label>
              <Input
                id="serving_unit"
                value={newFood.serving_unit || ""}
                onChange={(e) => setNewFood({ ...newFood, serving_unit: e.target.value })}
              />
            </div>

            <div className="col-span-full flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddFood}>
                Salvar
              </Button>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Calorias</TableHead>
                <TableHead>Proteínas</TableHead>
                <TableHead>Carboidratos</TableHead>
                <TableHead>Gorduras</TableHead>
                <TableHead>Fibras</TableHead>
                <TableHead>Porção</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foods?.map((food) => (
                <TableRow key={food.id}>
                  <TableCell>{food.name}</TableCell>
                  <TableCell>{food.category}</TableCell>
                  <TableCell>{food.calories}</TableCell>
                  <TableCell>{food.proteins}</TableCell>
                  <TableCell>{food.carbohydrates}</TableCell>
                  <TableCell>{food.fats}</TableCell>
                  <TableCell>{food.fiber}</TableCell>
                  <TableCell>
                    {food.serving_size} {food.serving_unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}