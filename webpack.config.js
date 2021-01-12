const webpack = require("webpack");
const { execSync } = require("child_process");
const { resolve } = require("path");
const { readFileSync } = require("fs");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SizePlugin = require("size-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const merge = require("lodash/merge");

module.exports = (env, argv) => {
  const production = !argv.mode || argv.mode === "production";
  const publicPath = env === "dev" ? "/dev/" : env === "beta" ? "/beta/" : "/";
  const mebibyte = 1024 * 1024;
  const sizePlugin = new SizePlugin({
    writeFile: false,
    exclude: "content/**",
    stripHash: filename =>
      sizePlugin.reverseTemplate(filename, "[name].[hash].js") ||
      sizePlugin.reverseTemplate(filename, "[name].[hash].css") ||
      filename
  });
  return {
    resolve: {
      alias: {
        "react-intl": resolve(
          __dirname,
          "node_modules/react-intl/dist/react-intl.js"
        )
      },
      extensions: [".js", ".jsx"]
    },
    context: __dirname + "/app",
    entry: [
      "core-js/stable",
      "regenerator-runtime/runtime",
      "./polyfill.js",
      "./sentry.js",
      "./main.jsx"
    ],
    devtool: production ? "source-map" : "cheap-module-eval-source-map",
    devServer: {
      historyApiFallback: {
        index: publicPath + "index.html"
      },
      proxy: {
        "/content_files": {
          target: "https://avalanche.report/",
          changeOrigin: true
        }
      },
      host: "0.0.0.0" //enable external access for testing with vm
    },
    output: {
      filename: "[name].[hash].js",
      publicPath
    },
    module: {
      rules: [
        {
          test: /\.js$|\.jsx$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader"
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        },
        {
          test: /\.scss$/,
          loaders: [
            MiniCssExtractPlugin.loader,
            { loader: "css-loader", options: { importLoaders: 1 } },
            "sass-loader"
          ]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp|eot|ttf|svg|woff|woff2|ico)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "./assets/",
                publicPath: "./assets/"
              }
            }
          ]
        }
      ]
    },
    stats: "errors-only",
    performance: {
      hints: production ? "error" : false,
      maxEntrypointSize: 2.1 * mebibyte,
      maxAssetSize: 1.9 * mebibyte
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./index.html",
        filename: "./index.html"
      }),
      new webpack.DefinePlugin({
        APP_ENVIRONMENT: JSON.stringify(env),
        APP_ASSET_PATH: JSON.stringify(publicPath),
        APP_DEV_MODE: JSON.stringify(!production),
        APP_VERSION: JSON.stringify(
          execSync("git describe --tags", { encoding: "utf8" }).trim()
        ),
        APP_VERSION_DATE: JSON.stringify(
          execSync("git log -1 --format=%cd --date=short", {
            encoding: "utf8"
          }).trim()
        )
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css"
      }),
      new CopyWebpackPlugin(
        [
          { from: "./service-worker.js", to: "service-worker.js" },
          { from: "./content", to: "content" },
          { from: "./i18n", to: "i18n" },
          { from: "./images", to: "images" },
          {
            from: __dirname + "/node_modules/leaflet/dist/images",
            to: "assets"
          },
          { from: "./images/fav/en/favicon.ico", to: "favicon.ico" },
          { from: "./sitemap.xml", to: "sitemap.xml" },
          env !== "dev"
            ? {
                from: "./config.json",
                to: "config.json"
              }
            : {
                from: "./config.json",
                to: "config.json",
                transform: (content, path) => {
                  const config = content.toString("utf8");
                  const configDev = readFileSync(
                    path.replace("config.json", "config-dev.json")
                  );
                  const configMerged = merge(
                    JSON.parse(config),
                    JSON.parse(configDev)
                  );
                  const string = JSON.stringify(configMerged);
                  return Buffer.from(string);
                }
              },
          {
            from: "./.htaccess",
            transform: content => {
              let string = content.toString("utf8");
              string = string.replace(/{APP_ASSET_PATH}/g, publicPath);
              return Buffer.from(string);
            }
          }
        ],
        {}
      ),
      production &&
        new CompressionPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.(js|css|html|svg)$/
        }),
      production &&
        new CompressionPlugin({
          filename: "[path].br[query]",
          algorithm: "brotliCompress",
          test: /\.(js|css|html|svg)$/
        }),
      sizePlugin,
      new ImageminWebpWebpackPlugin()
    ].filter(plugin => !!plugin)
  };
};
