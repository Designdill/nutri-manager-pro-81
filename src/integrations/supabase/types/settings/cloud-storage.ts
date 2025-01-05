export interface CloudStorageSettings {
  provider: string;
  credentials?: Record<string, string>;
  bucket?: string;
}