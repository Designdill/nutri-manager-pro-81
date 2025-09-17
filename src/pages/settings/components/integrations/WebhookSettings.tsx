import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Send, Copy, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  last_triggered?: string;
  status: 'active' | 'error' | 'pending';
}

const AVAILABLE_EVENTS = [
  'settings.updated',
  'user.profile.changed',
  'backup.completed',
  'integration.connected',
  'integration.disconnected',
  'notification.sent'
];

export function WebhookSettings() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    active: true
  });
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    // Mock data for now - replace with actual Supabase calls after migration
    const mockWebhooks: Webhook[] = [
      {
        id: '1',
        name: 'Sistema CRM',
        url: 'https://api.crm.com/webhook',
        events: ['settings.updated', 'user.profile.changed'],
        active: true,
        secret: 'whsec_abc123...',
        last_triggered: new Date().toISOString(),
        status: 'active'
      }
    ];
    setWebhooks(mockWebhooks);
  };

  const saveWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, URL e selecione pelo menos um evento",
        variant: "destructive"
      });
      return;
    }

    // Mock implementation - replace with actual Supabase calls after migration
    const webhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      active: newWebhook.active,
      secret: generateSecret(),
      status: 'pending'
    };

    setWebhooks([webhook, ...webhooks]);
    setNewWebhook({ name: '', url: '', events: [], active: true });
    setShowForm(false);
    
    toast({
      title: "Webhook criado",
      description: "Webhook configurado com sucesso"
    });
  };

  const deleteWebhook = async (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    toast({
      title: "Webhook removido",
      description: "Webhook removido com sucesso"
    });
  };

  const toggleWebhook = async (id: string, active: boolean) => {
    setWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, active } : w
    ));
  };

  const testWebhook = async (webhook: Webhook) => {
    try {
      const { data, error } = await supabase.functions.invoke('test-webhook', {
        body: { webhook_id: webhook.id }
      });

      if (error) throw error;

      toast({
        title: "Teste enviado",
        description: "Webhook de teste enviado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Erro ao enviar webhook de teste",
        variant: "destructive"
      });
    }
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast({
      title: "Copiado",
      description: "Secret copiado para área de transferência"
    });
  };

  const generateSecret = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const toggleEventSelection = (event: string) => {
    const updatedEvents = newWebhook.events.includes(event)
      ? newWebhook.events.filter(e => e !== event)
      : [...newWebhook.events, event];
    
    setNewWebhook({ ...newWebhook, events: updatedEvents });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>
              Configure webhooks para receber notificações automáticas
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Webhook
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Novo Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhook-name">Nome</Label>
                  <Input
                    id="webhook-name"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                    placeholder="Nome do webhook"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-url">URL</Label>
                  <Input
                    id="webhook-url"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://api.exemplo.com/webhook"
                  />
                </div>
              </div>
              
              <div>
                <Label>Eventos</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={event}
                        checked={newWebhook.events.includes(event)}
                        onChange={() => toggleEventSelection(event)}
                        className="rounded"
                      />
                      <Label htmlFor={event} className="text-sm">{event}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newWebhook.active}
                  onCheckedChange={(active) => setNewWebhook({ ...newWebhook, active })}
                />
                <Label>Ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveWebhook}>Salvar</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{webhook.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(webhook.status)}`} />
                      <Badge variant={webhook.active ? "default" : "secondary"}>
                        {webhook.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{webhook.url}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    {webhook.secret && (
                      <div className="flex items-center gap-2 text-sm">
                        <Label>Secret:</Label>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {showSecrets[webhook.id] ? webhook.secret : '••••••••••••••••'}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowSecrets({
                            ...showSecrets,
                            [webhook.id]: !showSecrets[webhook.id]
                          })}
                        >
                          {showSecrets[webhook.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copySecret(webhook.secret!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {webhook.last_triggered && (
                      <p className="text-xs text-muted-foreground">
                        Último disparo: {new Date(webhook.last_triggered).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={webhook.active}
                      onCheckedChange={(active) => toggleWebhook(webhook.id, active)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testWebhook(webhook)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {webhooks.length === 0 && !showForm && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum webhook configurado</p>
              <p className="text-sm">Clique em "Novo Webhook" para começar</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}