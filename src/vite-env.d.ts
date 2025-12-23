/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENVIRONMENT: string;
  // Add other env variables if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
