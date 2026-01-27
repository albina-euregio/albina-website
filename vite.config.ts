import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
      "leaflet.vectorgrid":
        "leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js"
    }
  },
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        iframe: resolve(__dirname, "app/iframe.ts"),
        "iframe-demo": resolve(__dirname, "iframe-demo.html")
      },
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
    watch: {
      // Ignore pnpm store to prevent ELOOP errors in CI where store is inside project
      ignored: ["**/.pnpm-store/**"]
    },
    port: 3000,
    proxy: {
      "/smet.hydrographie.info": {
        target: "https://smet.hydrographie.info/",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/smet.hydrographie.info/, "")
      }
    }
  }
});
