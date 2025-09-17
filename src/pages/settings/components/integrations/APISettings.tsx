import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Eye, EyeOff, Key, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  active: boolean;
  last_used?: string;
  requests_count: number;
  created_at: string;
}

const AVAILABLE_PERMISSIONS = [
  'settings.read',
  'settings.write',
  'patients.read',
  'patients.write',
  'appointments.read',
  'appointments.write',
  'webhooks.manage',
  'backups.manage'
];

export function APISettings() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: [] as string[],
    active: true
  });
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [apiStats, setApiStats] = useState({
    total_requests: 0,
    requests_today: 0,
    active_keys: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadApiKeys();
    loadApiStats();
  }, []);

  const loadApiKeys = async () => {
    // Mock data for now - replace with actual Supabase calls after migration
    const mockKeys: APIKey[] = [
      {
        id: '1',
        name: 'Dashboard API',
        key: 'sk_test_abc123456789...',
        permissions: ['patients.read', 'appointments.read'],
        active: true,
        created_at: new Date().toISOString(),
        last_used: new Date().toISOString(),
        requests_count: 1250
      }
    ];
    setApiKeys(mockKeys);
  };

  const loadApiStats = async () => {
    // Mock stats for now
    setApiStats({
      total_requests: 5420,
      requests_today: 148,
      active_keys: 3
    });
  };

  const generateApiKey = () => {
    const prefix = 'sk_';
    const key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return prefix + key;
  };

  const createApiKey = async () => {
    if (!newApiKey.name || newApiKey.permissions.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e selecione pelo menos uma permissão",
        variant: "destructive"
      });
      return;
    }

    // Mock implementation - replace with actual Supabase calls after migration
    const generatedKey = generateApiKey();
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      key: generatedKey,
      permissions: newApiKey.permissions,
      active: newApiKey.active,
      requests_count: 0,
      created_at: new Date().toISOString()
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewApiKey({ name: '', permissions: [], active: true });
    setShowForm(false);
    
    toast({
      title: "API Key criada",
      description: "Nova API Key gerada com sucesso. Copie e guarde em local seguro."
    });
  };

  const revokeApiKey = async (id: string) => {
    // Mock implementation - replace with actual Supabase calls after migration
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast({
      title: "API Key revogada",
      description: "API Key removida com sucesso"
    });
  };

  const toggleApiKey = async (id: string, active: boolean) => {
    // Mock implementation - replace with actual Supabase calls after migration
    setApiKeys(apiKeys.map(k => 
      k.id === id ? { ...k, active } : k
    ));
    
    toast({
      title: active ? "API Key ativada" : "API Key desativada",
      description: `API Key ${active ? 'ativada' : 'desativada'} com sucesso`
    });
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copiado",
      description: "API Key copiada para área de transferência"
    });
  };

  const togglePermission = (permission: string) => {
    const updatedPermissions = newApiKey.permissions.includes(permission)
      ? newApiKey.permissions.filter(p => p !== permission)
      : [...newApiKey.permissions, permission];
    
    setNewApiKey({ ...newApiKey, permissions: updatedPermissions });
  };

  const regenerateKey = async (id: string) => {
    // Mock implementation - replace with actual Supabase calls after migration
    const newKey = generateApiKey();
    
    setApiKeys(apiKeys.map(k => 
      k.id === id ? { ...k, key: newKey } : k
    ));
    
    toast({
      title: "API Key regenerada",
      description: "Nova chave gerada. Atualize suas integrações."
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Gerencie chaves de API para integração externa
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Key className="h-4 w-4 mr-2" />
            Nova API Key
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{apiStats.total_requests.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total de Requests</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{apiStats.requests_today.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Requests Hoje</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{apiKeys.filter(k => k.active).length}</p>
                  <p className="text-sm text-muted-foreground">Keys Ativas</p>
                </div>
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nova API Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key-name">Nome</Label>
                <Input
                  id="api-key-name"
                  value={newApiKey.name}
                  onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                  placeholder="Nome da API Key (ex: Sistema CRM)"
                />
              </div>
              
              <div>
                <Label>Permissões</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={permission}
                        checked={newApiKey.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="rounded"
                      />
                      <Label htmlFor={permission} className="text-sm">{permission}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newApiKey.active}
                  onCheckedChange={(active) => setNewApiKey({ ...newApiKey, active })}
                />
                <Label>Ativa</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={createApiKey}>Criar API Key</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{apiKey.name}</h3>
                      <Badge variant={apiKey.active ? "default" : "secondary"}>
                        {apiKey.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {showKeys[apiKey.id] ? apiKey.key : `${apiKey.key.substring(0, 8)}${'•'.repeat(32)}`}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowKeys({
                          ...showKeys,
                          [apiKey.id]: !showKeys[apiKey.id]
                        })}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyApiKey(apiKey.key)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Requests: {apiKey.requests_count.toLocaleString()}</p>
                      <p>Criada em: {new Date(apiKey.created_at).toLocaleDateString()}</p>
                      {apiKey.last_used && (
                        <p>Último uso: {new Date(apiKey.last_used).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={apiKey.active}
                      onCheckedChange={(active) => toggleApiKey(apiKey.id, active)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => regenerateKey(apiKey.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => revokeApiKey(apiKey.id)}
                    >
                      Revogar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {apiKeys.length === 0 && !showForm && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma API Key configurada</p>
              <p className="text-sm">Clique em "Nova API Key" para começar</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}