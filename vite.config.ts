import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { execSync } from "child_process";
import { readFileSync } from "fs";

const { license, repository } = JSON.parse(
  readFileSync("./package.json", { encoding: "utf8" })
);

function git(command: string): string {
  return execSync(`git ${command}`, { encoding: "utf8" }).trim();
}

function json(file: string) {
  return JSON.parse(readFileSync(file, { encoding: "utf8" }));
}

Object.assign(process.env, {
  APP_LICENSE: license,
  APP_REPOSITORY: repository.url,
  APP_DEPENDENCIES: JSON.stringify(
    Object.keys(json("./package.json").dependencies)
      .map(dependency => json(`node_modules/${dependency}/package.json`))
      .map(({ name, version, license }) => ({
        name,
        version,
        license: license || "none",
        homepage: `https://www.npmjs.com/package/${name}/v/${version}`
      }))
  ),
  APP_VERSION: git("describe --tags"),
  APP_VERSION_DATE: git("log -1 --format=%cd --date=short")
});

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "leaflet/dist/leaflet.css": "leaflet/dist/leaflet.css",
      leaflet: "leaflet/src/LeafletWithGlobals.js"
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[hash:19].js"
      }
    },
    sourcemap: true
  },
  css: {
    lightningcss: {
      errorRecovery: true
    }
  },
  envPrefix: ["APP_", "VITE_"],
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/content_files": {
        target: "https://avalanche.report/",
        changeOrigin: true
      }
    }
  }
});
