export * from './database';
export * from './common';
export * from './profiles';
export * from './appointments';
export * from './patients';
export * from './consultations';
export * from './foods';
export * from './meal-plans';
export * from './messages';
export * from './patient-photos';
export * from './user-settings';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];