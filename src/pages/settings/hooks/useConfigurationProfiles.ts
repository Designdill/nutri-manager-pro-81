import { useAuth } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SettingsFormValues } from "../types/settings-form";

export interface ConfigurationProfile {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  settings_data: SettingsFormValues;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useConfigurationProfiles() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["configuration-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuration_profiles")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ConfigurationProfile[];
    },
    enabled: !!session?.user?.id,
  });

  const createProfile = useMutation({
    mutationFn: async ({ name, description, settings }: {
      name: string;
      description?: string;
      settings: SettingsFormValues;
    }) => {
      const { data, error } = await supabase
        .from("configuration_profiles")
        .insert({
          user_id: session?.user?.id,
          name,
          description,
          settings_data: settings,
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration-profiles"] });
      toast({
        title: "Perfil criado",
        description: "Perfil de configuração criado com sucesso",
      });
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
      toast({
        title: "Erro ao criar perfil",
        description: "Não foi possível criar o perfil de configuração",
        variant: "destructive",
      });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ id, name, description, settings }: {
      id: string;
      name?: string;
      description?: string;
      settings?: SettingsFormValues;
    }) => {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (settings !== undefined) updateData.settings_data = settings;

      const { data, error } = await supabase
        .from("configuration_profiles")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", session?.user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration-profiles"] });
      toast({
        title: "Perfil atualizado",
        description: "Perfil de configuração atualizado com sucesso",
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar o perfil de configuração",
        variant: "destructive",
      });
    },
  });

  const deleteProfile = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("configuration_profiles")
        .delete()
        .eq("id", id)
        .eq("user_id", session?.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration-profiles"] });
      toast({
        title: "Perfil excluído",
        description: "Perfil de configuração excluído com sucesso",
      });
    },
    onError: (error) => {
      console.error("Error deleting profile:", error);
      toast({
        title: "Erro ao excluir perfil",
        description: "Não foi possível excluir o perfil de configuração",
        variant: "destructive",
      });
    },
  });

  const activateProfile = useMutation({
    mutationFn: async (id: string) => {
      // First, deactivate all profiles
      await supabase
        .from("configuration_profiles")
        .update({ is_active: false })
        .eq("user_id", session?.user?.id);

      // Then activate the selected profile
      const { data, error } = await supabase
        .from("configuration_profiles")
        .update({ is_active: true })
        .eq("id", id)
        .eq("user_id", session?.user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration-profiles"] });
      toast({
        title: "Perfil ativado",
        description: "Perfil de configuração ativado com sucesso",
      });
    },
    onError: (error) => {
      console.error("Error activating profile:", error);
      toast({
        title: "Erro ao ativar perfil",
        description: "Não foi possível ativar o perfil de configuração",
        variant: "destructive",
      });
    },
  });

  const activeProfile = profiles.find(profile => profile.is_active);

  return {
    profiles,
    activeProfile,
    isLoading,
    createProfile: createProfile.mutate,
    updateProfile: updateProfile.mutate,
    deleteProfile: deleteProfile.mutate,
    activateProfile: activateProfile.mutate,
    isCreating: createProfile.isPending,
    isUpdating: updateProfile.isPending,
    isDeleting: deleteProfile.isPending,
    isActivating: activateProfile.isPending,
  };
}