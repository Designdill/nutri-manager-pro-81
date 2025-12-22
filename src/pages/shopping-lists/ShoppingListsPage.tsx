import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShoppingList } from "./types";
import { ShoppingListGenerator } from "./components/ShoppingListGenerator";
import { ShoppingListViewer } from "./components/ShoppingListViewer";
import { ShoppingListCard } from "./components/ShoppingListCard";
import { ShoppingListExport } from "./components/ShoppingListExport";

export default function ShoppingListsPage() {
  const navigate = useNavigate();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [patients, setPatients] = useState<{ id: string; full_name: string }[]>([]);
  const [mealPlans, setMealPlans] = useState<{ id: string; title: string; patient_id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [deleteListId, setDeleteListId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Fetch shopping lists
      const { data: listsData, error: listsError } = await supabase
        .from('shopping_lists')
        .select(`
          *,
          patients(id, full_name),
          shopping_list_items(*)
        `)
        .order('created_at', { ascending: false });

      if (listsError) throw listsError;
      setShoppingLists(listsData || []);

      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('id, full_name')
        .order('full_name');

      if (patientsError) throw patientsError;
      setPatients(patientsData || []);

      // Fetch meal plans
      const { data: plansData, error: plansError } = await supabase
        .from('meal_plans')
        .select('id, title, patient_id')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setMealPlans(plansData || []);

    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerated = (list: ShoppingList) => {
    setShoppingLists(prev => [list, ...prev]);
    setSelectedList(list);
  };

  const handleDelete = async () => {
    if (!deleteListId) return;

    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', deleteListId);

      if (error) throw error;

      setShoppingLists(prev => prev.filter(l => l.id !== deleteListId));
      toast.success("Lista excluída com sucesso!");
    } catch (error: any) {
      console.error("Error deleting list:", error);
      toast.error("Erro ao excluir lista");
    } finally {
      setDeleteListId(null);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Listas de Compras
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Generator */}
          <ShoppingListGenerator
            patients={patients}
            mealPlans={mealPlans}
            onGenerated={handleGenerated}
          />

          {/* Lists */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Listas Criadas</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : shoppingLists.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma lista de compras</p>
                <p className="text-sm">Gere sua primeira lista a partir de um plano alimentar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shoppingLists.map(list => (
                  <ShoppingListCard
                    key={list.id}
                    shoppingList={list}
                    onView={setSelectedList}
                    onDelete={setDeleteListId}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* View Dialog */}
        <Dialog open={!!selectedList} onOpenChange={() => setSelectedList(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Lista de Compras</DialogTitle>
                {selectedList && <ShoppingListExport shoppingList={selectedList} />}
              </div>
            </DialogHeader>
            {selectedList && (
              <ShoppingListViewer 
                shoppingList={selectedList} 
                onUpdate={(updated) => {
                  setSelectedList(updated);
                  setShoppingLists(prev => prev.map(l => l.id === updated.id ? updated : l));
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteListId} onOpenChange={() => setDeleteListId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Lista de Compras?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A lista e todos os seus itens serão excluídos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
