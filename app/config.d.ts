declare let config: typeof import("./config.json");

interface Window {
  config: typeof import("./config.json");
}
