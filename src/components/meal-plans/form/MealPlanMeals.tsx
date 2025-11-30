import { UseFormReturn } from "react-hook-form";
import { MealPlanFormData } from "../types";
import { FoodSelector, MealFood } from "./FoodSelector";
import { NutritionalSummary } from "./NutritionalSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MealPlanMealsProps {
  form: UseFormReturn<MealPlanFormData>;
}

export function MealPlanMeals({ form }: MealPlanMealsProps) {
  const getMealFoods = (mealName: keyof MealPlanFormData): MealFood[] => {
    try {
      const value = form.watch(mealName);
      if (!value) return [];
      const parsed = JSON.parse(value as string);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const setMealFoods = (mealName: keyof MealPlanFormData, foods: MealFood[]) => {
    form.setValue(mealName, JSON.stringify(foods));
  };

  const meals = {
    breakfast: getMealFoods("breakfast"),
    morningSnack: getMealFoods("morningSnack"),
    lunch: getMealFoods("lunch"),
    afternoonSnack: getMealFoods("afternoonSnack"),
    dinner: getMealFoods("dinner"),
    eveningSnack: getMealFoods("eveningSnack"),
  };

  return (
    <div className="space-y-6">
      <NutritionalSummary meals={meals} />

      <Tabs defaultValue="breakfast" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="breakfast">Café</TabsTrigger>
          <TabsTrigger value="morningSnack">Lanche M.</TabsTrigger>
          <TabsTrigger value="lunch">Almoço</TabsTrigger>
          <TabsTrigger value="afternoonSnack">Lanche T.</TabsTrigger>
          <TabsTrigger value="dinner">Jantar</TabsTrigger>
          <TabsTrigger value="eveningSnack">Ceia</TabsTrigger>
        </TabsList>

        <TabsContent value="breakfast" className="space-y-4 mt-4">
          <FoodSelector
            label="Café da Manhã"
            foods={getMealFoods("breakfast")}
            onChange={(foods) => setMealFoods("breakfast", foods)}
          />
        </TabsContent>

        <TabsContent value="morningSnack" className="space-y-4 mt-4">
          <FoodSelector
            label="Lanche da Manhã"
            foods={getMealFoods("morningSnack")}
            onChange={(foods) => setMealFoods("morningSnack", foods)}
          />
        </TabsContent>

        <TabsContent value="lunch" className="space-y-4 mt-4">
          <FoodSelector
            label="Almoço"
            foods={getMealFoods("lunch")}
            onChange={(foods) => setMealFoods("lunch", foods)}
          />
        </TabsContent>

        <TabsContent value="afternoonSnack" className="space-y-4 mt-4">
          <FoodSelector
            label="Lanche da Tarde"
            foods={getMealFoods("afternoonSnack")}
            onChange={(foods) => setMealFoods("afternoonSnack", foods)}
          />
        </TabsContent>

        <TabsContent value="dinner" className="space-y-4 mt-4">
          <FoodSelector
            label="Jantar"
            foods={getMealFoods("dinner")}
            onChange={(foods) => setMealFoods("dinner", foods)}
          />
        </TabsContent>

        <TabsContent value="eveningSnack" className="space-y-4 mt-4">
          <FoodSelector
            label="Ceia"
            foods={getMealFoods("eveningSnack")}
            onChange={(foods) => setMealFoods("eveningSnack", foods)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}