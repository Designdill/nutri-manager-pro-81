import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ChevronRight, AlertCircle, Info, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationListSkeleton } from "@/components/ui/skeletons";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  type?: string;
}

interface RecentNotificationsProps {
  notifications: Notification[];
  isLoading?: boolean;
}

export function RecentNotifications({ notifications, isLoading = false }: RecentNotificationsProps) {
  const navigate = useNavigate();

  const getIcon = (type?: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("icon-box-accent", notifications.length > 0 && "pulse-dot")}>
              <Bell className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-semibold">Notificações</CardTitle>
            {notifications.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent animate-fade-in">
                {notifications.length}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/notifications")} className="text-xs gap-1 group">
            Ver todas
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <NotificationListSkeleton count={4} />
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
            <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="stagger-children">
            {notifications.map((notification, index) => (
              <div 
                key={notification.id} 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer group",
                  "hover:bg-muted/50 hover:shadow-sm",
                  index === 0 && "bg-muted/30"
                )}
              >
                <div className="mt-0.5 transition-transform duration-200 group-hover:scale-110">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{notification.message}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}