import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Food } from "../types";

interface FoodTableProps {
  foods: Food[];
}

export function FoodTable({ foods }: FoodTableProps) {
  return (
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
  );
}