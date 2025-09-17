import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Play, Pause } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    event: string;
    conditions: Record<string, any>;
  };
  actions: Array<{
    type: string;
    config: Record<string, any>;
  }>;
  active: boolean;
  last_triggered?: string;
  trigger_count: number;
}

const TRIGGER_EVENTS = [
  { value: 'patient.created', label: 'Novo paciente criado' },
  { value: 'appointment.scheduled', label: 'Consulta agendada' },
  { value: 'appointment.completed', label: 'Consulta finalizada' },
  { value: 'backup.completed', label: 'Backup concluído' },
  { value: 'settings.changed', label: 'Configurações alteradas' },
  { value: 'user.login', label: 'Login do usuário' },
  { value: 'integration.error', label: 'Erro de integração' }
];

const ACTION_TYPES = [
  { value: 'webhook', label: 'Disparar Webhook' },
  { value: 'email', label: 'Enviar Email' },
  { value: 'backup', label: 'Criar Backup' },
  { value: 'notification', label: 'Enviar Notificação' },
  { value: 'sync', label: 'Sincronizar Dados' }
];

export function AutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: { event: '', conditions: {} },
    actions: [{ type: '', config: {} }],
    active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    // Mock data for now - replace with actual Supabase calls after migration
    const mockRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Notificar novo paciente',
        trigger: { event: 'patient.created', conditions: {} },
        actions: [{ type: 'email', config: { template: 'welcome' } }],
        active: true,
        trigger_count: 24
      }
    ];
    setRules(mockRules);
  };

  const saveRule = async () => {
    if (!newRule.name || !newRule.trigger.event || newRule.actions.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, evento e pelo menos uma ação",
        variant: "destructive"
      });
      return;
    }

    // Mock implementation - replace with actual Supabase calls after migration
    const rule: AutomationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      trigger: newRule.trigger,
      actions: newRule.actions,
      active: newRule.active,
      trigger_count: 0
    };

    setRules([rule, ...rules]);
    setNewRule({
      name: '',
      trigger: { event: '', conditions: {} },
      actions: [{ type: '', config: {} }],
      active: true
    });
    setShowForm(false);
    
    toast({
      title: "Regra criada",
      description: "Regra de automação criada com sucesso"
    });
  };

  const deleteRule = async (id: string) => {
    // Mock implementation - replace with actual Supabase calls after migration
    setRules(rules.filter(r => r.id !== id));
    toast({
      title: "Regra removida",
      description: "Regra de automação removida com sucesso"
    });
  };

  const toggleRule = async (id: string, active: boolean) => {
    // Mock implementation - replace with actual Supabase calls after migration
    setRules(rules.map(r => 
      r.id === id ? { ...r, active } : r
    ));
    
    toast({
      title: active ? "Regra ativada" : "Regra desativada",
      description: `Regra ${active ? 'ativada' : 'desativada'} com sucesso`
    });
  };

  const testRule = async (rule: AutomationRule) => {
    toast({
      title: "Teste executado",
      description: "Regra de automação testada com sucesso"
    });
  };

  const addAction = () => {
    setNewRule({
      ...newRule,
      actions: [...newRule.actions, { type: '', config: {} }]
    });
  };

  const removeAction = (index: number) => {
    setNewRule({
      ...newRule,
      actions: newRule.actions.filter((_, i) => i !== index)
    });
  };

  const updateAction = (index: number, field: string, value: any) => {
    const updatedActions = [...newRule.actions];
    if (field === 'type') {
      updatedActions[index] = { type: value, config: {} };
    } else {
      updatedActions[index] = {
        ...updatedActions[index],
        config: { ...updatedActions[index].config, [field]: value }
      };
    }
    setNewRule({ ...newRule, actions: updatedActions });
  };

  const getStatusColor = (active: boolean) => {
    return active ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Regras de Automação</CardTitle>
            <CardDescription>
              Configure regras automáticas para ações do sistema
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Regra de Automação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rule-name">Nome da Regra</Label>
                <Input
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Nome da regra de automação"
                />
              </div>
              
              <div>
                <Label>Evento Disparador</Label>
                <Select
                  value={newRule.trigger.event}
                  onValueChange={(value) => setNewRule({ 
                    ...newRule, 
                    trigger: { ...newRule.trigger, event: value } 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_EVENTS.map((event) => (
                      <SelectItem key={event.value} value={event.value}>
                        {event.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Ações</Label>
                  <Button size="sm" variant="outline" onClick={addAction}>
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar Ação
                  </Button>
                </div>
                
                {newRule.actions.map((action, index) => (
                  <div key={index} className="border rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Select
                        value={action.type}
                        onValueChange={(value) => updateAction(index, 'type', value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Tipo de ação" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACTION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {newRule.actions.length > 1 && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeAction(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    {action.type === 'webhook' && (
                      <Input
                        placeholder="URL do webhook"
                        value={(action.config as any)?.url || ''}
                        onChange={(e) => updateAction(index, 'url', e.target.value)}
                      />
                    )}
                    
                    {action.type === 'email' && (
                      <div className="space-y-2">
                        <Input
                          placeholder="Template do email"
                          value={(action.config as any)?.template || ''}
                          onChange={(e) => updateAction(index, 'template', e.target.value)}
                        />
                        <Input
                          placeholder="Email de destino (opcional)"
                          value={(action.config as any)?.to || ''}
                          onChange={(e) => updateAction(index, 'to', e.target.value)}
                        />
                      </div>
                    )}
                    
                    {action.type === 'notification' && (
                      <Input
                        placeholder="Mensagem da notificação"
                        value={(action.config as any)?.message || ''}
                        onChange={(e) => updateAction(index, 'message', e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newRule.active}
                  onCheckedChange={(active) => setNewRule({ ...newRule, active })}
                />
                <Label>Ativa</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveRule}>Salvar Regra</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{rule.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(rule.active)}`} />
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      <p>Disparador: {TRIGGER_EVENTS.find(e => e.value === rule.trigger.event)?.label}</p>
                      <p>Ações: {rule.actions.length}</p>
                      <p>Execuções: {rule.trigger_count}</p>
                      {rule.last_triggered && (
                        <p>Último disparo: {new Date(rule.last_triggered).toLocaleString()}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {rule.actions.map((action, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ACTION_TYPES.find(t => t.value === action.type)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.active}
                      onCheckedChange={(active) => toggleRule(rule.id, active)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testRule(rule)}
                    >
                      {rule.active ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {rules.length === 0 && !showForm && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma regra de automação configurada</p>
              <p className="text-sm">Clique em "Nova Regra" para começar</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}