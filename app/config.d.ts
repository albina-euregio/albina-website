/// <reference types="vite-plus/client" />
/// <reference types="temporal-polyfill/global" />

declare global {
  type Config = typeof import("./config.json") & {
    projectRoot: string;
    webp: boolean;
    template(str: string, data: Record<string, string>): string;
    regionsRegex: RegExp;
    eawsRegionsRegex: RegExp;
    categoryNameMap: Record<string, string>;
  };

  declare let config: Config;

  interface Window {
    config: Config;
  }
}

export {};
