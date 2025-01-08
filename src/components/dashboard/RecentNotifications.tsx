import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

interface RecentNotificationsProps {
  notifications: Notification[];
}

export function RecentNotifications({ notifications }: RecentNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Notificações Recentes</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-4 border-b pb-2">
              <Bell className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma notificação recente
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}