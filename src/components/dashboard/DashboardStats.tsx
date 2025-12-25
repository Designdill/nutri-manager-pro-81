import { Users, Calendar, ChartBar, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardStatsSkeleton } from "@/components/ui/skeletons";

interface DashboardStatsProps {
  totalPatients: number;
  todayAppointments: number;
  unreadMessages: number;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  iconBoxClass: string;
  delay?: number;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, iconBoxClass, delay = 0 }: StatCardProps) {
  return (
    <div 
      className="stat-card group hover:shadow-lg hover:scale-[1.02] hover:border-primary/20 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <span className={cn(
                "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
                trend.positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
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
        <div className={cn(
          "icon-box transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", 
          iconBoxClass
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStats({ 
  totalPatients, 
  todayAppointments, 
  unreadMessages,
  isLoading = false 
}: DashboardStatsProps) {
  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Pacientes"
        value={totalPatients}
        subtitle="Pacientes ativos"
        icon={Users}
        iconBoxClass="bg-primary/10 text-primary"
        trend={{ value: 12, positive: true }}
        delay={0}
      />
      <StatCard
        title="Consultas Hoje"
        value={todayAppointments}
        subtitle="Agendadas para hoje"
        icon={Calendar}
        iconBoxClass="bg-secondary/10 text-secondary"
        delay={50}
      />
      <StatCard
        title="Metas Atingidas"
        value={0}
        subtitle="Nos últimos 30 dias"
        icon={ChartBar}
        iconBoxClass="bg-success/10 text-success"
        trend={{ value: 8, positive: true }}
        delay={100}
      />
      <StatCard
        title="Mensagens"
        value={unreadMessages}
        subtitle="Não lidas"
        icon={MessageSquare}
        iconBoxClass="bg-accent/10 text-accent"
        delay={150}
      />
    </div>
  );
}