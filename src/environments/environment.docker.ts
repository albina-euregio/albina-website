// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  apiBaseUrl: window["env"].API_BASE_URL,
  wsBaseUrl: window["env"].WS_BASE_URL,
  textcatUrl: window["env"].TEXTCAT_URL,
  headerBgColor: window["env"].HEADER_BG_COLOR,
  showChat: true
};

Object.assign(environment, (window as any).ENV);
