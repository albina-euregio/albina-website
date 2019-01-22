const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
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
            "style-loader",
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
        favicon: "./images/fav/en/favicon.ico",
        hash: true
      }),
      new webpack.DefinePlugin({
        DEV: argv.mode !== "production",
        VERSION: JSON.stringify(require("./package.json").version)
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
