/// <reference types="vite/client" />

declare global {
  type Config = typeof import("./config.json") & {
    projectRoot: string;
    webp: boolean;
    template(str: string, data: Record<string, string>): string;
  };

  declare let config: Config;

  interface Window {
    config: Config;
  }
}

export {};
