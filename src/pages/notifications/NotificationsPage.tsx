import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "warning" | "success";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nova Consulta Agendada",
      message: "Consulta agendada com Juliano Toso para amanhã às 14:00",
      timestamp: new Date(),
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Atualização de Plano Alimentar",
      message: "O plano alimentar do paciente Maria Silva foi atualizado",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      type: "success",
    },
    {
      id: "3",
      title: "Lembrete de Consulta",
      message: "Você tem uma consulta em 1 hora com Pedro Santos",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      type: "warning",
    },
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "text-blue-500";
      case "warning":
        return "text-yellow-500";
      case "success":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Notificações</h1>
            <Button
              variant="outline"
              onClick={() =>
                setNotifications((prev) =>
                  prev.map((notification) => ({ ...notification, read: true }))
                )
              }
            >
              Marcar todas como lidas
            </Button>
          </div>

          <Card className="p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="mx-auto h-12 w-12 mb-4" />
                <p>Nenhuma notificação no momento</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Bell
                          className={`h-5 w-5 mt-1 ${getNotificationColor(
                            notification.type
                          )}`}
                        />
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            {format(notification.timestamp, "PPpp", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}