import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { FoodTable } from "./components/FoodTable";
import { FoodForm } from "./components/FoodForm";

export default function FoodDatabasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    enabled: true, // Sempre habilitado, mas retorna array vazio se não houver categoria
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Food Database</h1>
        <FoodForm categories={categories} onCategoryChange={setSelectedCategory} />
        <FoodTable foods={foods} />
      </div>
    </div>
  );
}