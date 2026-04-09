import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

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
  },
  staged: {
    "*.{js,jsx,ts,tsx,mjs,cjs}": "pnpm run test",
    "*": "vp fmt --no-error-on-unmatched-pattern"
  },
  fmt: {
    arrowParens: "avoid",
    printWidth: 80,
    trailingComma: "none",
    ignorePatterns: [
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      "public/content/**/ca.html",
      "public/content/**/de.html",
      "public/content/**/en.html",
      "public/content/**/es.html",
      "public/content/**/fr.html",
      "public/content/**/fr.html",
      "public/content/**/it.html",
      "public/content/**/oc.html"
    ]
  },
  lint: {
    categories: {
      correctness: "off"
    },
    env: {
      builtin: true
    },
    ignorePatterns: ["app/**/*.js", "dist/**", "node_modules/**", "public/**"],
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        rules: {
          "no-class-assign": "off",
          "no-const-assign": "off",
          "no-dupe-class-members": "off",
          "no-dupe-keys": "off",
          "no-func-assign": "off",
          "no-import-assign": "off",
          "no-new-native-nonconstructor": "off",
          "no-obj-calls": "off",
          "no-redeclare": "off",
          "no-setter-return": "off",
          "no-this-before-super": "off",
          "no-unsafe-negation": "off",
          "no-var": "error",
          "no-with": "off",
          "prefer-rest-params": "error",
          "prefer-spread": "error"
        }
      },
      {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        rules: {
          "no-class-assign": "off",
          "no-const-assign": "off",
          "no-dupe-class-members": "off",
          "no-dupe-keys": "off",
          "no-func-assign": "off",
          "no-import-assign": "off",
          "no-new-native-nonconstructor": "off",
          "no-obj-calls": "off",
          "no-redeclare": "off",
          "no-setter-return": "off",
          "no-this-before-super": "off",
          "no-unsafe-negation": "off",
          "no-var": "error",
          "no-with": "off",
          "prefer-rest-params": "error",
          "prefer-spread": "error"
        }
      },
      {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        rules: {
          "no-class-assign": "off",
          "no-const-assign": "off",
          "no-dupe-class-members": "off",
          "no-dupe-keys": "off",
          "no-func-assign": "off",
          "no-import-assign": "off",
          "no-new-native-nonconstructor": "off",
          "no-obj-calls": "off",
          "no-redeclare": "off",
          "no-setter-return": "off",
          "no-this-before-super": "off",
          "no-unsafe-negation": "off",
          "no-var": "error",
          "no-with": "off",
          "prefer-rest-params": "error",
          "prefer-spread": "error"
        }
      }
    ],
    plugins: ["typescript", "unicorn", "react", "jsx-a11y"],
    rules: {
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          minimumDescriptionLength: 10
        }
      ],
      "@typescript-eslint/ban-tslint-comment": "error",
      "@typescript-eslint/consistent-generic-constructors": "error",
      "@typescript-eslint/consistent-indexed-object-style": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/no-confusing-non-null-assertion": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-dynamic-delete": "error",
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-extraneous-class": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-unsafe-declaration-merging": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/prefer-enum-initializers": "warn",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-literal-enum-member": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/triple-slash-reference": "error",
      curly: "off",
      "for-direction": "error",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "no-array-constructor": "error",
      "no-async-promise-executor": "error",
      "no-case-declarations": "error",
      "no-class-assign": "error",
      "no-compare-neg-zero": "error",
      "no-cond-assign": "error",
      "no-console": [
        "error",
        {
          allow: ["info", "warn", "error", "assert"]
        }
      ],
      "no-const-assign": "error",
      "no-constant-binary-expression": "error",
      "no-constant-condition": "error",
      "no-control-regex": "error",
      "no-debugger": "error",
      "no-delete-var": "error",
      "no-dupe-class-members": "error",
      "no-dupe-else-if": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-empty": "error",
      "no-empty-character-class": "error",
      "no-empty-function": "off",
      "no-empty-pattern": "error",
      "no-empty-static-block": "error",
      "no-ex-assign": "error",
      "no-extra-boolean-cast": "error",
      "no-fallthrough": "error",
      "no-func-assign": "error",
      "no-global-assign": "error",
      "no-import-assign": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-loss-of-precision": "error",
      "no-new-native-nonconstructor": "error",
      "no-nonoctal-decimal-escape": "error",
      "no-obj-calls": "error",
      "no-prototype-builtins": "error",
      "no-redeclare": "error",
      "no-regex-spaces": "error",
      "no-self-assign": "error",
      "no-setter-return": "error",
      "no-shadow-restricted-names": "error",
      "no-sparse-arrays": "error",
      "no-this-before-super": "error",
      "no-unexpected-multiline": "off",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "no-unsafe-optional-chaining": "error",
      "no-unused-expressions": "error",
      "no-unused-labels": "error",
      "no-unused-private-class-members": "error",
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "React"
        }
      ],
      "no-useless-backreference": "error",
      "no-useless-catch": "error",
      "no-useless-constructor": "error",
      "no-useless-escape": "error",
      "no-with": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react/jsx-key": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "react/jsx-no-duplicate-props": "warn",
      "react/jsx-no-target-blank": "warn",
      "react/jsx-no-undef": "warn",
      "react/no-children-prop": "warn",
      "react/no-danger-with-children": "warn",
      "react/no-direct-mutation-state": "warn",
      "react/no-find-dom-node": "warn",
      "react/no-is-mounted": "warn",
      "react/no-render-return-value": "warn",
      "react/no-string-refs": "warn",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "warn",
      "react/react-in-jsx-scope": "warn",
      "require-await": "error",
      "require-yield": "error",
      "unicorn/empty-brace-spaces": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/number-literal-case": "off",
      "use-isnan": "error",
      "valid-typeof": "error"
    },
    options: {
      typeAware: true,
      typeCheck: false
    }
  }
});
