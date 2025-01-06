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

  if (!jsonTheme || typeof jsonTheme !== 'object' || Array.isArray(jsonTheme)) {
    return defaultTheme;
  }

  const theme = jsonTheme as Record<string, unknown>;
  
  return {
    primary: typeof theme.primary === 'string' ? theme.primary : defaultTheme.primary,
    secondary: typeof theme.secondary === 'string' ? theme.secondary : defaultTheme.secondary,
    accent: typeof theme.accent === 'string' ? theme.accent : defaultTheme.accent,
  };
};

export const themeSettingsToJson = (theme: ThemeSettings): Json => {
  return {
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
  };
};