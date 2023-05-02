// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=docker` then `environment.docker.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
export const environment = {
  production: window["ENV"].PROPDUCTION,
  apiBaseUrl: window["ENV"].API_BASE_URL,
  wsBaseUrl: window["ENV"].WS_BASE_URL,
  textcatUrl: window["ENV"].TEXTCAT_URL,
  headerBgColor: window["ENV"].HEADER_BG_COLOR,
  showChat: window["ENV"].SHOW_CHAT,
};

Object.assign(environment, (window as any).ENV);
