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
  FileText,
  FileCheck2,
  ShoppingCart,
  ChefHat,
  LogOut,
  Leaf
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
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/App";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "./ui/separator";

const nutritionistMenuGroups = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
      { title: "Pacientes", url: "/patients", icon: Users },
      { title: "Consultas", url: "/appointments", icon: Calendar },
    ],
  },
  {
    label: "Acompanhamento",
    items: [
      { title: "Anamneses", url: "/anamnesis", icon: FileCheck2 },
      { title: "Progresso", url: "/progress", icon: ChartBar },
      { title: "Questionários", url: "/questionnaires", icon: FileQuestion },
    ],
  },
  {
    label: "Nutrição",
    items: [
      { title: "Planos Alimentares", url: "/meal-plans", icon: BookOpen },
      { title: "Receitas", url: "/recipes", icon: ChefHat },
      { title: "Banco de Alimentos", url: "/food-database", icon: Apple },
      { title: "Lista de Compras", url: "/shopping-lists", icon: ShoppingCart },
    ],
  },
  {
    label: "Gestão",
    items: [
      { title: "Relatórios", url: "/reports", icon: FileText },
      { title: "Mensagens", url: "/messages", icon: MessageSquare },
      { title: "Notificações", url: "/notifications", icon: Bell },
      { title: "Pagamentos", url: "/payments", icon: CreditCard },
    ],
  },
];

const patientMenuGroups = [
  {
    label: "Minha Área",
    items: [
      { title: "Meu Dashboard", url: "/", icon: Home },
      { title: "Plano Alimentar", url: "/my-plan", icon: BookOpen },
      { title: "Diário Alimentar", url: "/food-diary", icon: ClipboardList },
      { title: "Meu Progresso", url: "/my-progress", icon: ChartBar },
      { title: "Mensagens", url: "/messages", icon: MessageSquare },
    ],
  },
];

export function AppSidebar() {
  const { session } = useAuth();
  const location = useLocation();
  const { role, isLoading } = useUserRole();

  const menuGroups = role === "nutritionist" ? nutritionistMenuGroups : patientMenuGroups;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <Sidebar className="border-r border-sidebar-border bg-sidebar">
        <SidebarHeader className="p-4">
          <div className="h-8 w-32 bg-muted animate-pulse-soft rounded" />
        </SidebarHeader>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">Nutri Manager</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Pro</span>
          </div>
        </Link>
      </SidebarHeader>

      <Separator className="mx-4 w-auto" />

      <SidebarContent className="px-2 py-4">
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem 
                      key={item.title}
                      style={{ animationDelay: `${(groupIndex * 5 + itemIndex) * 30}ms` }}
                      className="animate-slide-in-left"
                    >
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className={cn(
                            "nav-link",
                            isActive && "nav-link-active"
                          )}
                        >
                          <item.icon className={cn(
                            "h-4.5 w-4.5 flex-shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          )} />
                          <span>{item.title}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse-soft" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <Separator className="mx-4 w-auto" />

      <SidebarFooter className="p-4 space-y-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/settings"
                className={cn(
                  "nav-link",
                  location.pathname === "/settings" && "nav-link-active"
                )}
              >
                <Settings className="h-4.5 w-4.5 flex-shrink-0" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}