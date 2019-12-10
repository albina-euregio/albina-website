const webpack = require("webpack");
const { execSync } = require("child_process");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");

module.exports = (env, argv) => {
  const production = !argv.mode || argv.mode === "production";
  const publicPath = env === "dev" ? "/dev/" : env === "beta" ? "/beta/" : "/";
  const config = env === "dev" ? "./config-dev.json" : "./config.json";
  return {
    resolve: {
      extensions: [".js", ".jsx"]
    },
    context: __dirname + "/app",
    entry: {
      app: "./main.jsx"
    },
    devtool: production ? "source-map" : "cheap-module-eval-source-map",
    devServer: {
      historyApiFallback: true,
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
        filename: "[name]-[hash].css"
      }),
      new CopyWebpackPlugin(
        [
          { from: "./content", to: "content" },
          { from: "./i18n", to: "i18n" },
          { from: "./images", to: "images" },
          { from: "./images/fav/en/favicon.ico", to: "favicon.ico" },
          {
            from: config,
            to: "config.json"
          }
        ],
        {}
      ),
      new ImageminWebpWebpackPlugin()
    ]
  };
};
