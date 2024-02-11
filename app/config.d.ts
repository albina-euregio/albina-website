/// <reference types="vite/client" />

declare let config: typeof import("./config.json");

declare global {
  interface Window {
    config: typeof import("./config.json") & {
      projectRoot: string;
      webp: boolean;
      template(str: string, data: Record<string, string>): string;
    };
  }
}
