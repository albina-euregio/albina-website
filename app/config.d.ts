/// <reference types="vite/client" />

declare global {
  declare let config: typeof import("./config.json");

  interface Window {
    config: typeof import("./config.json") & {
      projectRoot: string;
      webp: boolean;
      template(str: string, data: Record<string, string>): string;
    };
  }
}

export {};
