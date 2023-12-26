declare let config: typeof import("./config.json");

declare global {
  interface Window {
    config: typeof import("./config.json") & {
      projectRoot: string;
      webp: boolean;
    };
  }
}
