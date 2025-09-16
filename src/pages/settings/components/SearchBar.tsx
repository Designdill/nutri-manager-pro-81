import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch }, ref) => {
    return (
      <div className="relative max-w-sm" data-tour="search">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          placeholder="Buscar configurações... (Ctrl+K)"
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";