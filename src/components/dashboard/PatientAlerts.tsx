import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  UserX, 
  Calendar, 
  Utensils,
  RefreshCw,
  X,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { usePatientAlerts, PatientAlert } from '@/hooks/usePatientAlerts';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const alertTypeIcons: Record<PatientAlert['alert_type'], React.ElementType> = {
  inactive_patient: UserX,
  weight_gain: TrendingUp,
  weight_loss: TrendingDown,
  low_adherence: Utensils,
  missed_appointment: Calendar,
  no_recent_consultation: Calendar
};

const severityColors: Record<PatientAlert['severity'], string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  critical: 'bg-destructive text-destructive-foreground'
};

const alertTypeLabels: Record<PatientAlert['alert_type'], string> = {
  inactive_patient: 'Inativo',
  weight_gain: 'Peso ↑',
  weight_loss: 'Peso ↓',
  low_adherence: 'Adesão',
  missed_appointment: 'Falta',
  no_recent_consultation: 'Retorno'
};

export function PatientAlerts() {
  const navigate = useNavigate();
  const { 
    alerts, 
    loading, 
    generating, 
    unreadCount,
    generateAlerts, 
    markAsRead, 
    dismissAlert,
    markAllAsRead 
  } = usePatientAlerts();
  
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 5);

  const handleAlertClick = (alert: PatientAlert) => {
    if (!alert.is_read) {
      markAsRead(alert.id);
    }
    navigate(`/patients/${alert.patient_id}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Alertas de Pacientes
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                title="Marcar todos como lidos"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateAlerts}
              disabled={generating}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${generating ? 'animate-spin' : ''}`} />
              Analisar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Check className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>Nenhum alerta pendente!</p>
              <p className="text-sm">Clique em "Analisar" para verificar seus pacientes.</p>
            </div>
          ) : (
            <>
              <ScrollArea className={showAll && alerts.length > 5 ? 'h-[400px]' : ''}>
                <div className="space-y-2">
                  {displayedAlerts.map(alert => {
                    const Icon = alertTypeIcons[alert.alert_type];
                    return (
                      <div
                        key={alert.id}
                        className={`
                          flex items-start gap-3 p-3 rounded-lg border cursor-pointer
                          transition-colors hover:bg-muted/50
                          ${!alert.is_read ? 'bg-muted/30 border-primary/20' : ''}
                        `}
                        onClick={() => handleAlertClick(alert)}
                      >
                        <div className={`p-2 rounded-full ${severityColors[alert.severity]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">
                              {alert.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {alertTypeLabels[alert.alert_type]}
                            </Badge>
                            {!alert.is_read && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(alert.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissAlert(alert.id);
                          }}
                          title="Dispensar alerta"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              
              {alerts.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Mostrar menos' : `Ver todos (${alerts.length})`}
                </Button>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
