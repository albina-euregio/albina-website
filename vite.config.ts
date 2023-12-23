import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import gzipPlugin from "rollup-plugin-gzip";

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { brotliCompressSync } from "zlib";

const { license, repository } = JSON.parse(
  readFileSync("./package.json", { encoding: "utf8" })
);

function git(command: string): string {
  return execSync(`git ${command}`, { encoding: "utf8" }).trim();
}

Object.assign(process.env, {
  APP_LICENSE: license,
  APP_REPOSITORY: repository.url,
  APP_VERSION: git("describe --tags"),
  APP_VERSION_DATE: git("log -1 --format=%cd --date=short")
});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "[hash:19].js"
      }
    },
    sourcemap: true
  },
  envPrefix: ["APP_", "VITE_"],
  plugins: [
    react(),
    process.env.COMPRESS_GZIP && gzipPlugin(),
    process.env.COMPRESS_BROTLI &&
      gzipPlugin({
        customCompression: content => brotliCompressSync(Buffer.from(content)),
        fileName: ".br"
      })
  ],
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
