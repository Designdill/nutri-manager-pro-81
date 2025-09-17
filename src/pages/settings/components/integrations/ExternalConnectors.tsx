import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Cloud, RefreshCw, CheckCircle, XCircle, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExternalConnector {
  id: string;
  name: string;
  type: 'google_drive' | 'dropbox' | 'onedrive' | 'aws_s3' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  last_sync?: string;
  sync_enabled: boolean;
  auto_backup: boolean;
}

const CONNECTOR_TYPES = [
  { 
    id: 'google_drive', 
    name: 'Google Drive', 
    icon: '📁',
    description: 'Sincronize backups com Google Drive'
  },
  { 
    id: 'dropbox', 
    name: 'Dropbox', 
    icon: '📦',
    description: 'Armazene backups no Dropbox'
  },
  { 
    id: 'onedrive', 
    name: 'OneDrive', 
    icon: '☁️',
    description: 'Integração com Microsoft OneDrive'
  },
  { 
    id: 'aws_s3', 
    name: 'AWS S3', 
    icon: '🪣',
    description: 'Armazenamento em bucket S3'
  }
];

export function ExternalConnectors() {
  const [connectors, setConnectors] = useState<ExternalConnector[]>([]);
  const [showConfig, setShowConfig] = useState<string | null>(null);
  const [configData, setConfigData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    try {
      const { data, error } = await supabase
        .from('external_connectors')
        .select('*')
        .order('name');

      if (error) throw error;
      setConnectors(data || []);
    } catch (error) {
      console.error('Error loading connectors:', error);
    }
  };

  const connectService = async (type: string) => {
    setShowConfig(type);
    setConfigData({});
  };

  const saveConnector = async () => {
    if (!showConfig) return;

    try {
      const connectorType = CONNECTOR_TYPES.find(c => c.id === showConfig);
      if (!connectorType) return;

      const { data, error } = await supabase
        .from('external_connectors')
        .insert({
          name: connectorType.name,
          type: showConfig,
          status: 'disconnected',
          config: configData,
          sync_enabled: true,
          auto_backup: false
        })
        .select()
        .single();

      if (error) throw error;

      // Test connection
      await testConnection(data.id);
      
      setConnectors([...connectors, data]);
      setShowConfig(null);
      setConfigData({});
      
      toast({
        title: "Conector configurado",
        description: `${connectorType.name} configurado com sucesso`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao configurar conector",
        variant: "destructive"
      });
    }
  };

  const testConnection = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('test-external-connector', {
        body: { connector_id: id }
      });

      if (error) throw error;

      const status = data.success ? 'connected' : 'error';
      
      await supabase
        .from('external_connectors')
        .update({ status })
        .eq('id', id);

      setConnectors(connectors.map(c => 
        c.id === id ? { ...c, status } : c
      ));

      toast({
        title: status === 'connected' ? "Conexão bem-sucedida" : "Erro na conexão",
        description: data.message || (status === 'connected' ? "Conector conectado" : "Falha na conexão"),
        variant: status === 'connected' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Erro ao testar conexão",
        variant: "destructive"
      });
    }
  };

  const syncNow = async (id: string) => {
    try {
      toast({
        title: "Sincronização iniciada",
        description: "Sincronização em andamento..."
      });

      const { data, error } = await supabase.functions.invoke('sync-external-connector', {
        body: { connector_id: id }
      });

      if (error) throw error;

      await supabase
        .from('external_connectors')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', id);

      setConnectors(connectors.map(c => 
        c.id === id ? { ...c, last_sync: new Date().toISOString() } : c
      ));

      toast({
        title: "Sincronização concluída",
        description: "Dados sincronizados com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Erro ao sincronizar dados",
        variant: "destructive"
      });
    }
  };

  const toggleSync = async (id: string, enabled: boolean) => {
    try {
      await supabase
        .from('external_connectors')
        .update({ sync_enabled: enabled })
        .eq('id', id);

      setConnectors(connectors.map(c => 
        c.id === id ? { ...c, sync_enabled: enabled } : c
      ));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração",
        variant: "destructive"
      });
    }
  };

  const toggleAutoBackup = async (id: string, enabled: boolean) => {
    try {
      await supabase
        .from('external_connectors')
        .update({ auto_backup: enabled })
        .eq('id', id);

      setConnectors(connectors.map(c => 
        c.id === id ? { ...c, auto_backup: enabled } : c
      ));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração",
        variant: "destructive"
      });
    }
  };

  const removeConnector = async (id: string) => {
    try {
      await supabase
        .from('external_connectors')
        .delete()
        .eq('id', id);

      setConnectors(connectors.filter(c => c.id !== id));
      
      toast({
        title: "Conector removido",
        description: "Conector removido com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover conector",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const renderConfigForm = (type: string) => {
    switch (type) {
      case 'google_drive':
        return (
          <div className="space-y-4">
            <div>
              <Label>Client ID</Label>
              <Input
                value={configData.client_id || ''}
                onChange={(e) => setConfigData({ ...configData, client_id: e.target.value })}
                placeholder="Google Drive Client ID"
              />
            </div>
            <div>
              <Label>Client Secret</Label>
              <Input
                type="password"
                value={configData.client_secret || ''}
                onChange={(e) => setConfigData({ ...configData, client_secret: e.target.value })}
                placeholder="Google Drive Client Secret"
              />
            </div>
            <div>
              <Label>Pasta de Backup</Label>
              <Input
                value={configData.backup_folder || ''}
                onChange={(e) => setConfigData({ ...configData, backup_folder: e.target.value })}
                placeholder="Nome da pasta (ex: Backups Sistema)"
              />
            </div>
          </div>
        );
      case 'aws_s3':
        return (
          <div className="space-y-4">
            <div>
              <Label>Access Key ID</Label>
              <Input
                value={configData.access_key_id || ''}
                onChange={(e) => setConfigData({ ...configData, access_key_id: e.target.value })}
                placeholder="AWS Access Key ID"
              />
            </div>
            <div>
              <Label>Secret Access Key</Label>
              <Input
                type="password"
                value={configData.secret_access_key || ''}
                onChange={(e) => setConfigData({ ...configData, secret_access_key: e.target.value })}
                placeholder="AWS Secret Access Key"
              />
            </div>
            <div>
              <Label>Bucket Name</Label>
              <Input
                value={configData.bucket_name || ''}
                onChange={(e) => setConfigData({ ...configData, bucket_name: e.target.value })}
                placeholder="Nome do bucket S3"
              />
            </div>
            <div>
              <Label>Region</Label>
              <Input
                value={configData.region || ''}
                onChange={(e) => setConfigData({ ...configData, region: e.target.value })}
                placeholder="us-east-1"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input
                type="password"
                value={configData.api_key || ''}
                onChange={(e) => setConfigData({ ...configData, api_key: e.target.value })}
                placeholder="API Key do serviço"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectores Externos</CardTitle>
        <CardDescription>
          Configure integrações com serviços de nuvem para backup e sincronização
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Services */}
        <div>
          <h3 className="text-lg font-medium mb-4">Serviços Disponíveis</h3>
          <div className="grid grid-cols-2 gap-4">
            {CONNECTOR_TYPES.map((type) => {
              const isConnected = connectors.some(c => c.type === type.id);
              return (
                <Card key={type.id} className={isConnected ? "opacity-50" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <h4 className="font-medium">{type.name}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => connectService(type.id)}
                        disabled={isConnected}
                      >
                        {isConnected ? 'Conectado' : 'Conectar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Configuration Form */}
        {showConfig && (
          <Card>
            <CardHeader>
              <CardTitle>
                Configurar {CONNECTOR_TYPES.find(c => c.id === showConfig)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderConfigForm(showConfig)}
              <div className="flex gap-2">
                <Button onClick={saveConnector}>Conectar</Button>
                <Button variant="outline" onClick={() => setShowConfig(null)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connected Services */}
        {connectors.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Serviços Conectados</h3>
            <div className="space-y-4">
              {connectors.map((connector) => (
                <Card key={connector.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Cloud className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{connector.name}</h4>
                            {getStatusIcon(connector.status)}
                            <Badge variant={getStatusColor(connector.status) as any}>
                              {connector.status === 'connected' ? 'Conectado' : 
                               connector.status === 'error' ? 'Erro' : 'Desconectado'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {connector.last_sync && (
                              <p>Última sincronização: {new Date(connector.last_sync).toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Sincronização</Label>
                          <Switch
                            checked={connector.sync_enabled}
                            onCheckedChange={(enabled) => toggleSync(connector.id, enabled)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Auto Backup</Label>
                          <Switch
                            checked={connector.auto_backup}
                            onCheckedChange={(enabled) => toggleAutoBackup(connector.id, enabled)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testConnection(connector.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncNow(connector.id)}
                            disabled={connector.status !== 'connected'}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeConnector(connector.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {connectors.length === 0 && !showConfig && (
          <div className="text-center py-8 text-muted-foreground">
            <Cloud className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhum conector configurado</p>
            <p className="text-sm">Conecte serviços de nuvem para backup automático</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}