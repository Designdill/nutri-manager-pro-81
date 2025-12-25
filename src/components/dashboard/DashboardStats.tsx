import { Users, Calendar, ChartBar, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  totalPatients: number;
  todayAppointments: number;
  unreadMessages: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  iconBoxClass: string;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, iconBoxClass }: StatCardProps) {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <span className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}>
                {trend.positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend.value}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={cn("icon-box", iconBoxClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStats({ 
  totalPatients, 
  todayAppointments, 
  unreadMessages 
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Pacientes"
        value={totalPatients}
        subtitle="Pacientes ativos"
        icon={Users}
        iconBoxClass="bg-primary/10 text-primary"
        trend={{ value: 12, positive: true }}
      />
      <StatCard
        title="Consultas Hoje"
        value={todayAppointments}
        subtitle="Agendadas para hoje"
        icon={Calendar}
        iconBoxClass="bg-secondary/10 text-secondary"
      />
      <StatCard
        title="Metas Atingidas"
        value={0}
        subtitle="Nos últimos 30 dias"
        icon={ChartBar}
        iconBoxClass="bg-success/10 text-success"
        trend={{ value: 8, positive: true }}
      />
      <StatCard
        title="Mensagens"
        value={unreadMessages}
        subtitle="Não lidas"
        icon={MessageSquare}
        iconBoxClass="bg-accent/10 text-accent"
      />
    </div>
  );
}