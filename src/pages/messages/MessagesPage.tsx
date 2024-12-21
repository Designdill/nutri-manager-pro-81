import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import { useToast } from "@/hooks/use-toast";

export default function MessagesPage() {
  const { session } = useAuth();
  const { toast } = useToast();

  // Fetch patients for the current nutritionist
  const { data: patients, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log("No session found, skipping patient fetch");
        return [];
      }

      console.log("Fetching patients for nutritionist:", session.user.id);
      const { data, error } = await supabase
        .from("patients")
        .select(`
          id,
          full_name,
          avatar_url:patient_photos(photo_url)
        `)
        .eq("nutritionist_id", session.user.id);

      if (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de pacientes",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Patients fetched successfully:", data);
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  if (!session) {
    return (
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">
            <p className="text-gray-600">Faça login para acessar suas mensagens</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex">
        <div className="w-1/3 border-r">
          <ChatList 
            patients={patients || []} 
            isLoading={isLoadingPatients} 
          />
        </div>
        <div className="w-2/3">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}