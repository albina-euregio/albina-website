const webpack = require("webpack");
const {execSync} = require("child_process");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  return {
    resolve: {
      extensions: [".js", ".jsx"]
    },
    context: __dirname + "/app",
    entry: {
      app: "./main.jsx"
    },
    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0' //enable external access for testing with vm
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
          test: /\.(jpe?g|png|gif|svg|eot|ttf|svg|woff|woff2|ico)$/i,
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
      new FaviconsWebpackPlugin({
        logo: "./images/pro/logos/logo_mark_en.svg",
        mode: "webapp",
        devMode: "webapp",
      }),
      new webpack.DefinePlugin({
        DEV: JSON.stringify(argv.mode !== "production"),
        VERSION: JSON.stringify([
          execSync('git describe --tags', {encoding: 'utf8'}).trim(),
          execSync('git log -1 --format=%cd --date=short', {encoding: 'utf8'}).trim()
        ].join(", "))
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new CopyWebpackPlugin(
        [
          { from: "./data", to: "data" },
          { from: "./images", to: "images" },
          { from: "./config.json", to: "config.json" }
        ],
        {}
      )
    ]
  };
};
