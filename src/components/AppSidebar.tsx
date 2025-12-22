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
  Settings,
  FileQuestion,
  Menu,
  FileText,
  FileCheck2,
  ShoppingCart,
  ChefHat
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
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useUserRole } from "@/hooks/useUserRole";

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
    title: "Anamneses",
    url: "/anamnesis",
    icon: FileCheck2,
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
    title: "Lista de Compras",
    url: "/shopping-lists",
    icon: ShoppingCart,
  },
  {
    title: "Receitas",
    url: "/recipes",
    icon: ChefHat,
  },
  {
    title: "Banco de Alimentos",
    url: "/food-database",
    icon: Apple,
  },
  {
    title: "Questionários",
    url: "/questionnaires",
    icon: FileQuestion,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: FileText,
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
  const location = useLocation();
  const { role, isLoading } = useUserRole();

  const menuItems = role === "nutritionist" ? nutritionistMenuItems : patientMenuItems;

  if (isLoading) {
    return null;
  }

  return (
    <Sidebar className="border-r bg-card">
      <SidebarContent>
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-xl font-bold text-primary">Nutri Manager</h2>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {role === "nutritionist" ? "Gestão Nutricional" : "Minha Nutrição"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "nav-link",
                        location.pathname === item.url && "nav-link-active"
                      )}
                    >
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