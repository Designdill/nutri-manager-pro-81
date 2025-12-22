import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Calendar, Eye, Trash2 } from "lucide-react";
import { ShoppingList } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingListExport } from "./ShoppingListExport";

interface ShoppingListCardProps {
  shoppingList: ShoppingList;
  onView: (list: ShoppingList) => void;
  onDelete: (listId: string) => void;
}

export function ShoppingListCard({ shoppingList, onView, onDelete }: ShoppingListCardProps) {
  const items = shoppingList.shopping_list_items || [];
  const checkedCount = items.filter(i => i.is_checked).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  const statusColors: Record<string, string> = {
    active: "bg-green-500/10 text-green-600 border-green-500/20",
    completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    archived: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };

  const statusLabels: Record<string, string> = {
    active: "Ativa",
    completed: "Concluída",
    archived: "Arquivada",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{shoppingList.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1 text-xs">
                {shoppingList.patients?.full_name && (
                  <span>{shoppingList.patients.full_name}</span>
                )}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[shoppingList.status]}>
            {statusLabels[shoppingList.status] || shoppingList.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {shoppingList.week_start && shoppingList.week_end ? (
            <span>
              {format(new Date(shoppingList.week_start), "dd/MM", { locale: ptBR })} - {" "}
              {format(new Date(shoppingList.week_end), "dd/MM", { locale: ptBR })}
            </span>
          ) : (
            <span>{format(new Date(shoppingList.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{checkedCount}/{items.length} itens</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => onView(shoppingList)}>
            <Eye className="h-3 w-3" />
            Ver Lista
          </Button>
          <ShoppingListExport shoppingList={shoppingList} />
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(shoppingList.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
