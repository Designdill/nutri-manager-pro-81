import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfigurationProfiles } from "../../hooks/useConfigurationProfiles";
import { SettingsFormValues } from "../../types/settings-form";
import { UseFormReturn } from "react-hook-form";
import { User, Plus, Edit, Trash2, Play, Settings } from "lucide-react";

interface ProfileManagerProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function ProfileManager({ form }: ProfileManagerProps) {
  const {
    profiles,
    activeProfile,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    activateProfile,
    isCreating,
    isUpdating,
    isDeleting,
    isActivating,
  } = useConfigurationProfiles();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileDescription, setNewProfileDescription] = useState("");

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;

    const currentSettings = form.getValues();
    createProfile({
      name: newProfileName.trim(),
      description: newProfileDescription.trim() || undefined,
      settings: currentSettings,
    });

    setNewProfileName("");
    setNewProfileDescription("");
    setIsCreateDialogOpen(false);
  };

  const handleEditProfile = () => {
    if (!editingProfile || !newProfileName.trim()) return;

    updateProfile({
      id: editingProfile.id,
      name: newProfileName.trim(),
      description: newProfileDescription.trim() || undefined,
    });

    setEditingProfile(null);
    setNewProfileName("");
    setNewProfileDescription("");
    setIsEditDialogOpen(false);
  };

  const handleLoadProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    // Load profile settings into form
    const settingsData = profile.settings_data;
    Object.keys(settingsData).forEach(key => {
      form.setValue(key as keyof SettingsFormValues, settingsData[key as keyof SettingsFormValues]);
    });

    // Activate the profile
    activateProfile(profileId);
  };

  const handleUpdateCurrentProfile = () => {
    if (!activeProfile) return;

    const currentSettings = form.getValues();
    updateProfile({
      id: activeProfile.id,
      settings: currentSettings,
    });
  };

  const openEditDialog = (profile: any) => {
    setEditingProfile(profile);
    setNewProfileName(profile.name);
    setNewProfileDescription(profile.description || "");
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <CardTitle>Perfis de Configuração</CardTitle>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Perfil</DialogTitle>
                <DialogDescription>
                  Crie um novo perfil com as configurações atuais
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-name">Nome do Perfil</Label>
                  <Input
                    id="profile-name"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Ex: Trabalho, Pessoal, Demo..."
                  />
                </div>
                <div>
                  <Label htmlFor="profile-description">Descrição (opcional)</Label>
                  <Textarea
                    id="profile-description"
                    value={newProfileDescription}
                    onChange={(e) => setNewProfileDescription(e.target.value)}
                    placeholder="Descreva quando usar este perfil..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateProfile}
                  disabled={!newProfileName.trim() || isCreating}
                >
                  {isCreating ? "Criando..." : "Criar Perfil"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Gerencie diferentes conjuntos de configurações para diferentes contextos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeProfile && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <div>
                <p className="font-medium">Perfil Ativo: {activeProfile.name}</p>
                {activeProfile.description && (
                  <p className="text-sm text-muted-foreground">{activeProfile.description}</p>
                )}
              </div>
              <Badge variant="secondary">Ativo</Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleUpdateCurrentProfile}
              disabled={isUpdating}
            >
              {isUpdating ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <Label>Perfis Disponíveis</Label>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando perfis...</p>
          ) : profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum perfil criado. Crie seu primeiro perfil para começar.
            </p>
          ) : (
            <div className="grid gap-2">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{profile.name}</h4>
                      {profile.is_active && <Badge variant="secondary" className="text-xs">Ativo</Badge>}
                    </div>
                    {profile.description && (
                      <p className="text-sm text-muted-foreground mt-1">{profile.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Criado em {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadProfile(profile.id)}
                      disabled={isActivating || profile.is_active}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {profile.is_active ? "Ativo" : "Carregar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(profile)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Perfil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o perfil "{profile.name}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProfile(profile.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Excluindo..." : "Excluir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
              <DialogDescription>
                Edite as informações do perfil
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-profile-name">Nome do Perfil</Label>
                <Input
                  id="edit-profile-name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-profile-description">Descrição (opcional)</Label>
                <Textarea
                  id="edit-profile-description"
                  value={newProfileDescription}
                  onChange={(e) => setNewProfileDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleEditProfile}
                disabled={!newProfileName.trim() || isUpdating}
              >
                {isUpdating ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}