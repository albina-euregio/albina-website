import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import analyze from "rollup-plugin-analyzer";
import gzipPlugin from "rollup-plugin-gzip";

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { brotliCompressSync } from "zlib";

const { license, repository } = JSON.parse(readFileSync("./package.json"));

function git(command) {
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
  build: { sourcemap: true },
  envPrefix: ["APP_", "VITE_"],
  plugins: [
    react(),
    analyze(),
    process.env.COMPRESS_GZIP && gzipPlugin(),
    process.env.COMPRESS_BROTLI &&
      gzipPlugin({
        customCompression: content => brotliCompressSync(Buffer.from(content)),
        fileName: ".br"
      })
  ],
  server: {
    proxy: {
      "/content_files": {
        target: "https://avalanche.report/",
        changeOrigin: true
      }
    }
  }
});
