import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutGrid, List, Star, StarOff } from "lucide-react";

interface SettingsViewToggleProps {
  viewMode: "compact" | "detailed";
  onViewModeChange: (mode: "compact" | "detailed") => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}

export function SettingsViewToggle({ 
  viewMode, 
  onViewModeChange, 
  showFavorites, 
  onToggleFavorites 
}: SettingsViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="sm"
              onClick={onToggleFavorites}
              className="gap-2"
            >
              {showFavorites ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
              Favoritas
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showFavorites ? "Mostrar todas" : "Mostrar apenas favoritas"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="h-4 w-px bg-border" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "compact" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("compact")}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visualização compacta</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "detailed" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("detailed")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visualização detalhada</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}