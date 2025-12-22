import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Package, Check, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShoppingList, ShoppingListItem, GroupedItems } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ShoppingListViewerProps {
  shoppingList: ShoppingList;
  onUpdate?: (list: ShoppingList) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Frutas e Legumes': '🥬',
  'Talho e Peixaria': '🥩',
  'Laticínios': '🥛',
  'Ovos': '🥚',
  'Mercearia': '🛒',
  'Congelados': '🧊',
  'Bebidas': '🥤',
  'Frutos Secos e Sementes': '🥜',
  'Temperos e Especiarias': '🌿',
  'Outros': '📦',
};

export function ShoppingListViewer({ shoppingList, onUpdate }: ShoppingListViewerProps) {
  const [items, setItems] = useState<ShoppingListItem[]>(shoppingList.shopping_list_items || []);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    setItems(shoppingList.shopping_list_items || []);
  }, [shoppingList]);

  const groupedItems = items.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const checkedCount = items.filter(i => i.is_checked).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  const handleToggleItem = async (itemId: string, checked: boolean) => {
    setIsUpdating(itemId);
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ is_checked: checked })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, is_checked: checked } : item
      ));
    } catch (error: any) {
      console.error("Error updating item:", error);
      toast.error("Erro ao atualizar item");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleMarkAllComplete = async () => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ is_checked: true })
        .eq('shopping_list_id', shoppingList.id);

      if (error) throw error;

      setItems(prev => prev.map(item => ({ ...item, is_checked: true })));
      toast.success("Todos os itens marcados como comprados!");
    } catch (error: any) {
      console.error("Error updating items:", error);
      toast.error("Erro ao atualizar itens");
    }
  };

  const handleClearAll = async () => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ is_checked: false })
        .eq('shopping_list_id', shoppingList.id);

      if (error) throw error;

      setItems(prev => prev.map(item => ({ ...item, is_checked: false })));
      toast.success("Lista reiniciada!");
    } catch (error: any) {
      console.error("Error updating items:", error);
      toast.error("Erro ao reiniciar lista");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{shoppingList.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3" />
                {shoppingList.week_start && shoppingList.week_end && (
                  <span>
                    {format(new Date(shoppingList.week_start), "dd/MM", { locale: ptBR })} - {" "}
                    {format(new Date(shoppingList.week_end), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                )}
                {shoppingList.patients?.full_name && (
                  <>
                    <span>•</span>
                    <span>{shoppingList.patients.full_name}</span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          <Badge variant={progress === 100 ? "default" : "secondary"}>
            {checkedCount}/{items.length} itens
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={handleMarkAllComplete}>
            <Check className="h-4 w-4 mr-1" />
            Marcar Tudo
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClearAll}>
            Limpar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{CATEGORY_ICONS[category] || '📦'}</span>
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                {category}
              </h3>
              <Badge variant="outline" className="ml-auto">
                {categoryItems.filter(i => i.is_checked).length}/{categoryItems.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    item.is_checked 
                      ? 'bg-muted/50 border-muted' 
                      : 'bg-card border-border hover:border-primary/30'
                  }`}
                >
                  <Checkbox
                    id={item.id}
                    checked={item.is_checked}
                    disabled={isUpdating === item.id}
                    onCheckedChange={(checked) => handleToggleItem(item.id, checked as boolean)}
                  />
                  <label
                    htmlFor={item.id}
                    className={`flex-1 cursor-pointer ${
                      item.is_checked ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    <span className="font-medium">{item.food_name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {item.quantity} {item.unit}
                    </span>
                  </label>
                  {item.raw_quantity && (
                    <span className="text-xs text-muted-foreground">
                      (cru: {item.raw_quantity} {item.unit})
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <Separator className="mt-4" />
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum item na lista</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
