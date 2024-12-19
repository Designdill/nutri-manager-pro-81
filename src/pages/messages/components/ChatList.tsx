import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ChatUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function ChatList({ onSelectUser }: { onSelectUser: (user: ChatUser) => void }) {
  const { session } = useAuth();
  const { toast } = useToast();
  const userRole = session?.user?.user_metadata?.role || "patient";

  const { data: users, isLoading } = useQuery({
    queryKey: ["chat-users"],
    queryFn: async () => {
      try {
        if (userRole === "nutritionist") {
          // Get all patients for the nutritionist
          const { data, error } = await supabase
            .from("patients")
            .select(`
              id,
              full_name,
              profiles:nutritionist_id (
                avatar_url
              )
            `)
            .eq("nutritionist_id", session?.user?.id);

          if (error) throw error;
          return data.map((patient) => ({
            id: patient.id,
            full_name: patient.full_name,
            avatar_url: patient.profiles?.avatar_url,
          }));
        } else {
          // Get the patient's nutritionist
          const { data, error } = await supabase
            .from("patients")
            .select(`
              profiles:nutritionist_id (
                id,
                full_name,
                avatar_url
              )
            `)
            .eq("id", session?.user?.id)
            .maybeSingle();

          if (error) throw error;
          return data?.profiles ? [data.profiles] : [];
        }
      } catch (error) {
        console.error("Error fetching chat users:", error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de contatos.",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (!users?.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Nenhum contato disponível
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] w-full">
      <div className="space-y-2 p-4">
        {users.map((user) => (
          <button
            key={user.id}
            className="flex items-center space-x-4 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => onSelectUser(user)}
          >
            <Avatar>
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                {user.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.full_name}</span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}