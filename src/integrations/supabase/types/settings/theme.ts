import { Json } from "../database";

export interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
}

export const parseThemeSettings = (jsonTheme: Json | null): ThemeSettings => {
  const defaultTheme: ThemeSettings = {
    primary: "#0ea5e9",
    secondary: "#64748b",
    accent: "#f59e0b",
  };

  if (!jsonTheme || typeof jsonTheme !== 'object') {
    return defaultTheme;
  }

  const theme = jsonTheme as Record<string, unknown>;
  
  return {
    primary: String(theme.primary || defaultTheme.primary),
    secondary: String(theme.secondary || defaultTheme.secondary),
    accent: String(theme.accent || defaultTheme.accent),
  };
};