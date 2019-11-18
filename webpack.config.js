const webpack = require("webpack");
const { execSync } = require("child_process");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");

module.exports = (env, argv) => {
  const production = !argv.mode || argv.mode === "production";
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
      historyApiFallback: true
    },
    output: {
      publicPath: "/"
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
        filename: "./index.html",
        hash: true
      }),
      new webpack.DefinePlugin({
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
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new CopyWebpackPlugin(
        [
          { from: "./data", to: "data" },
          { from: "./images", to: "images" },
          { from: "./images/fav/en/favicon.ico", to: "favicon.ico" },
          { from: "./config.json", to: "config.json" }
        ],
        {}
      ),
      new ImageminWebpWebpackPlugin()
    ]
  };
};
