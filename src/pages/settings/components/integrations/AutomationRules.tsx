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
import { supabase } from "@/integrations/supabase/client";

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
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error loading automation rules:', error);
    }
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

    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .insert({
          name: newRule.name,
          trigger: newRule.trigger,
          actions: newRule.actions,
          active: newRule.active,
          trigger_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      setRules([data, ...rules]);
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
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar regra de automação",
        variant: "destructive"
      });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRules(rules.filter(r => r.id !== id));
      toast({
        title: "Regra removida",
        description: "Regra de automação removida com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover regra",
        variant: "destructive"
      });
    }
  };

  const toggleRule = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .update({ active })
        .eq('id', id);

      if (error) throw error;

      setRules(rules.map(r => 
        r.id === id ? { ...r, active } : r
      ));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar regra",
        variant: "destructive"
      });
    }
  };

  const testRule = async (rule: AutomationRule) => {
    try {
      const { data, error } = await supabase.functions.invoke('test-automation-rule', {
        body: { rule_id: rule.id }
      });

      if (error) throw error;

      toast({
        title: "Teste executado",
        description: "Regra de automação testada com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Erro ao testar regra de automação",
        variant: "destructive"
      });
    }
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

  const renderActionConfig = (action: any, index: number) => {
    switch (action.type) {
      case 'webhook':
        return (
          <div className="space-y-2">
            <Label>URL do Webhook</Label>
            <Input
              value={action.config.url || ''}
              onChange={(e) => updateAction(index, 'url', e.target.value)}
              placeholder="https://api.exemplo.com/webhook"
            />
          </div>
        );
      case 'email':
        return (
          <div className="space-y-2">
            <div>
              <Label>Para</Label>
              <Input
                value={action.config.to || ''}
                onChange={(e) => updateAction(index, 'to', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label>Assunto</Label>
              <Input
                value={action.config.subject || ''}
                onChange={(e) => updateAction(index, 'subject', e.target.value)}
                placeholder="Assunto do email"
              />
            </div>
          </div>
        );
      case 'notification':
        return (
          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Input
              value={action.config.message || ''}
              onChange={(e) => updateAction(index, 'message', e.target.value)}
              placeholder="Mensagem da notificação"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getEventLabel = (event: string) => {
    return TRIGGER_EVENTS.find(e => e.value === event)?.label || event;
  };

  const getActionLabel = (type: string) => {
    return ACTION_TYPES.find(a => a.value === type)?.label || type;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Regras de Automação</CardTitle>
            <CardDescription>
              Configure automações baseadas em eventos do sistema
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
                    <SelectValue placeholder="Selecione um evento" />
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
                  <Card key={index} className="mb-2">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <Select
                            value={action.type}
                            onValueChange={(value) => updateAction(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de ação" />
                            </SelectTrigger>
                            <SelectContent>
                              {ACTION_TYPES.map((actionType) => (
                                <SelectItem key={actionType.value} value={actionType.value}>
                                  {actionType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {action.type && renderActionConfig(action, index)}
                        </div>
                        {newRule.actions.length > 1 && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeAction(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      <p><strong>Evento:</strong> {getEventLabel(rule.trigger.event)}</p>
                      <p><strong>Ações:</strong> {rule.actions.map(a => getActionLabel(a.type)).join(', ')}</p>
                      <p><strong>Disparos:</strong> {rule.trigger_count}</p>
                      {rule.last_triggered && (
                        <p><strong>Último disparo:</strong> {new Date(rule.last_triggered).toLocaleString()}</p>
                      )}
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
                      <Play className="h-4 w-4" />
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