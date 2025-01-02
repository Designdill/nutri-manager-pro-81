import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Food } from "../types";
import { Card } from "@/components/ui/card";

interface FoodTableProps {
  foods: Food[];
}

export function FoodTable({ foods }: FoodTableProps) {
  return (
    <Card className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Calorias</TableHead>
            <TableHead className="text-right">Proteínas (g)</TableHead>
            <TableHead className="text-right">Carboidratos (g)</TableHead>
            <TableHead className="text-right">Gorduras (g)</TableHead>
            <TableHead className="text-right">Fibras (g)</TableHead>
            <TableHead>Porção</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Nenhum alimento encontrado
              </TableCell>
            </TableRow>
          ) : (
            foods.map((food) => (
              <TableRow key={food.id}>
                <TableCell className="font-medium">{food.name}</TableCell>
                <TableCell>{food.category}</TableCell>
                <TableCell className="text-right">{food.calories}</TableCell>
                <TableCell className="text-right">{food.proteins}</TableCell>
                <TableCell className="text-right">{food.carbohydrates}</TableCell>
                <TableCell className="text-right">{food.fats}</TableCell>
                <TableCell className="text-right">{food.fiber}</TableCell>
                <TableCell>
                  {food.serving_size} {food.serving_unit}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}