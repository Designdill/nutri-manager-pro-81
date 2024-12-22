export interface NutritionalApiKeys {
  open_food_facts: string | null;
  usda_fooddata: string | null;
  myfitnesspal: string | null;
}

export interface HealthAppIntegrations {
  google_fit: boolean;
  apple_health: boolean;
  myfitnesspal: boolean;
}

export interface MealPlanningIntegrations {
  meal_delivery: boolean;
  recipe_planning: boolean;
}

export interface IntegrationSettings {
  api_keys: NutritionalApiKeys;
  health_apps: HealthAppIntegrations;
  meal_planning: MealPlanningIntegrations;
}