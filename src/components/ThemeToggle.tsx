import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "relative h-9 w-9 rounded-lg transition-colors",
            className
          )}
        >
          <Sun className={cn(
            "h-4 w-4 transition-all duration-300",
            resolvedTheme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"
          )} />
          <Moon className={cn(
            "absolute h-4 w-4 transition-all duration-300",
            resolvedTheme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
          )} />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={cn("gap-2 cursor-pointer", theme === "light" && "bg-accent")}
        >
          <Sun className="h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={cn("gap-2 cursor-pointer", theme === "dark" && "bg-accent")}
        >
          <Moon className="h-4 w-4" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={cn("gap-2 cursor-pointer", theme === "system" && "bg-accent")}
        >
          <Monitor className="h-4 w-4" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button version (for sidebar)
export function ThemeToggleSimple({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "text-muted-foreground hover:text-foreground hover:bg-muted/80",
        className
      )}
    >
      {resolvedTheme === "dark" ? (
        <>
          <Sun className="h-4 w-4" />
          <span>Modo Claro</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span>Modo Escuro</span>
        </>
      )}
    </Button>
  );
}
