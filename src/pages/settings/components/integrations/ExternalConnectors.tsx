import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Cloud, RefreshCw, CheckCircle, XCircle, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
    id: 'google_drive' as const, 
    name: 'Google Drive', 
    icon: '📁',
    description: 'Sincronize backups com Google Drive'
  },
  { 
    id: 'dropbox' as const, 
    name: 'Dropbox', 
    icon: '📦',
    description: 'Armazene backups no Dropbox'
  },
  { 
    id: 'onedrive' as const, 
    name: 'OneDrive', 
    icon: '☁️',
    description: 'Integração com Microsoft OneDrive'
  },
  { 
    id: 'aws_s3' as const, 
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
    // Mock data for now - replace with actual Supabase calls after migration
    const mockConnectors: ExternalConnector[] = [
      {
        id: '1',
        name: 'Google Drive',
        type: 'google_drive',
        status: 'connected',
        config: { account: 'user@gmail.com' },
        last_sync: new Date().toISOString(),
        sync_enabled: true,
        auto_backup: true
      }
    ];
    setConnectors(mockConnectors);
  };

  const connectService = async (type: string) => {
    setShowConfig(type);
    setConfigData({});
  };

  const saveConnector = async () => {
    if (!showConfig) return;

    // Mock implementation - replace with actual Supabase calls after migration
    const connectorType = CONNECTOR_TYPES.find(c => c.id === showConfig);
    if (!connectorType) return;

    const newConnector: ExternalConnector = {
      id: Date.now().toString(),
      name: connectorType.name,
      type: showConfig as any,
      status: 'disconnected',
      config: configData,
      sync_enabled: true,
      auto_backup: false
    };

    setConnectors([...connectors, newConnector]);
    setShowConfig(null);
    setConfigData({});
    
    toast({
      title: "Conector configurado",
      description: `${connectorType.name} configurado com sucesso`
    });
  };

  const disconnectService = async (id: string) => {
    // Mock implementation - replace with actual Supabase calls after migration
    setConnectors(connectors.filter(c => c.id !== id));
    toast({
      title: "Serviço desconectado",
      description: "Conector removido com sucesso"
    });
  };

  const syncNow = async (connector: ExternalConnector) => {
    // Mock implementation - replace with actual sync logic
    setConnectors(connectors.map(c => 
      c.id === connector.id 
        ? { ...c, last_sync: new Date().toISOString(), status: 'connected' }
        : c
    ));
    
    toast({
      title: "Sincronização concluída",
      description: `${connector.name} sincronizado com sucesso`
    });
  };

  const toggleAutoBackup = async (id: string, auto_backup: boolean) => {
    // Mock implementation - replace with actual Supabase calls after migration
    setConnectors(connectors.map(c => 
      c.id === id ? { ...c, auto_backup } : c
    ));
    
    toast({
      title: auto_backup ? "Backup automático ativado" : "Backup automático desativado",
      description: "Configuração atualizada com sucesso"
    });
  };

  const toggleSync = async (id: string, sync_enabled: boolean) => {
    // Mock implementation - replace with actual Supabase calls after migration
    setConnectors(connectors.map(c => 
      c.id === id ? { ...c, sync_enabled } : c
    ));
    
    toast({
      title: sync_enabled ? "Sincronização ativada" : "Sincronização desativada",
      description: "Configuração atualizada com sucesso"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Conectores Externos</CardTitle>
            <CardDescription>
              Configure integrações com serviços de armazenamento em nuvem
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Services */}
        <div className="grid grid-cols-2 gap-4">
          {CONNECTOR_TYPES.map((service) => (
            <Card key={service.id} className="cursor-pointer hover:bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => connectService(service.id)}
                    disabled={connectors.some(c => c.type === service.id)}
                  >
                    {connectors.some(c => c.type === service.id) ? 'Conectado' : 'Conectar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuration Modal */}
        {showConfig && (
          <Card>
            <CardHeader>
              <CardTitle>
                Configurar {CONNECTOR_TYPES.find(c => c.id === showConfig)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showConfig === 'google_drive' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="google-account">Conta Google</Label>
                    <Input
                      id="google-account"
                      placeholder="seu-email@gmail.com"
                      value={configData.account || ''}
                      onChange={(e) => setConfigData({ ...configData, account: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="google-folder">Pasta de Destino</Label>
                    <Input
                      id="google-folder"
                      placeholder="Backups/Sistema"
                      value={configData.folder || ''}
                      onChange={(e) => setConfigData({ ...configData, folder: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {showConfig === 'aws_s3' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aws-key">Access Key ID</Label>
                    <Input
                      id="aws-key"
                      placeholder="AKIA..."
                      value={configData.access_key || ''}
                      onChange={(e) => setConfigData({ ...configData, access_key: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aws-secret">Secret Access Key</Label>
                    <Input
                      id="aws-secret"
                      type="password"
                      placeholder="••••••••"
                      value={configData.secret_key || ''}
                      onChange={(e) => setConfigData({ ...configData, secret_key: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aws-bucket">Bucket Name</Label>
                    <Input
                      id="aws-bucket"
                      placeholder="meu-bucket-backups"
                      value={configData.bucket || ''}
                      onChange={(e) => setConfigData({ ...configData, bucket: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aws-region">Região</Label>
                    <Input
                      id="aws-region"
                      placeholder="us-east-1"
                      value={configData.region || ''}
                      onChange={(e) => setConfigData({ ...configData, region: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {(showConfig === 'dropbox' || showConfig === 'onedrive') && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="oauth-token">Token de Acesso</Label>
                    <Input
                      id="oauth-token"
                      type="password"
                      placeholder="••••••••"
                      value={configData.token || ''}
                      onChange={(e) => setConfigData({ ...configData, token: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="service-folder">Pasta de Destino</Label>
                    <Input
                      id="service-folder"
                      placeholder="/Backups/Sistema"
                      value={configData.folder || ''}
                      onChange={(e) => setConfigData({ ...configData, folder: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={saveConnector}>Salvar Configuração</Button>
                <Button variant="outline" onClick={() => setShowConfig(null)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connected Services */}
        <div className="space-y-4">
          {connectors.map((connector) => (
            <Card key={connector.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Cloud className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{connector.name}</h3>
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
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={connector.sync_enabled}
                              onCheckedChange={(enabled) => toggleSync(connector.id, enabled)}
                            />
                            <Label className="text-xs">Sincronização</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={connector.auto_backup}
                              onCheckedChange={(enabled) => toggleAutoBackup(connector.id, enabled)}
                            />
                            <Label className="text-xs">Backup Automático</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncNow(connector)}
                      disabled={connector.status !== 'connected'}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowConfig(connector.type)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => disconnectService(connector.id)}
                    >
                      Desconectar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {connectors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Cloud className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum serviço externo conectado</p>
              <p className="text-sm">Conecte serviços de armazenamento para sincronizar backups</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}