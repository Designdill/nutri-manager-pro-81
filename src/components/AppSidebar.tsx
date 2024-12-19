import { 
  Calendar, 
  Users, 
  Home, 
  ChartBar, 
  BookOpen, 
  MessageSquare, 
  Bell, 
  CreditCard,
  Apple,
  ClipboardList,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/App";
import { Link } from "react-router-dom";

const nutritionistMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Consultas",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Progresso",
    url: "/progress",
    icon: ChartBar,
  },
  {
    title: "Planos Alimentares",
    url: "/meal-plans",
    icon: BookOpen,
  },
  {
    title: "Banco de Alimentos",
    url: "/food-database",
    icon: Apple,
  },
  {
    title: "Mensagens",
    url: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Notificações",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Pagamentos",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
];

const patientMenuItems = [
  {
    title: "Meu Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Plano Alimentar",
    url: "/my-plan",
    icon: BookOpen,
  },
  {
    title: "Diário Alimentar",
    url: "/food-diary",
    icon: ClipboardList,
  },
  {
    title: "Meu Progresso",
    url: "/my-progress",
    icon: ChartBar,
  },
  {
    title: "Mensagens",
    url: "/messages",
    icon: MessageSquare,
  },
];

export function AppSidebar() {
  const { session } = useAuth();
  const userRole = "nutritionist"; // TODO: Get this from user profile

  const menuItems = userRole === "nutritionist" ? nutritionistMenuItems : patientMenuItems;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {userRole === "nutritionist" ? "Gestão Nutricional" : "Minha Nutrição"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
