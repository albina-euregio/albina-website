import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig([
  {
    input: "https://dev.avalanche.report/api/openapi.json",
    output: "app/api",
    plugins: ["valibot"]
  },
  {
    input: "https://dev.avalanche.report/profiles-app/api/openapi.yaml",
    output: "app/api-profiles",
    plugins: ["valibot"]
  }
]);
