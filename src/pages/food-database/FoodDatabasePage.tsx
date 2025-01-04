import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { FoodTable } from "./components/FoodTable";
import { FoodForm } from "./components/FoodForm";
import { Food } from "./types";

export default function FoodDatabasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newFood, setNewFood] = useState<Partial<Food>>({});

  const { data: categories } = useQuery({
    queryKey: ["food-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("foods")
        .select("category");

      if (error) throw error;

      // Get unique categories
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      return uniqueCategories;
    },
  });

  const { data: foods = [] } = useQuery({
    queryKey: ["foods", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .eq("category", selectedCategory);

      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  const handleSubmit = async () => {
    // Implementar lógica de submissão
    console.log("Submitting food:", newFood);
  };

  const handleCancel = () => {
    setNewFood({});
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Food Database</h1>
        <FoodForm 
          categories={categories}
          onCategoryChange={setSelectedCategory}
          newFood={newFood}
          setNewFood={setNewFood}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
        <FoodTable foods={foods} />
      </div>
    </div>
  );
}