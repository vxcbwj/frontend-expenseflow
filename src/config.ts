// src/config.ts
export const API_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
export const ENVIRONMENT: string =
  import.meta.env.VITE_ENVIRONMENT || "development";

console.log(`🌍 Environment: ${ENVIRONMENT}`);
console.log(`🔗 API URL: ${API_URL}`);
