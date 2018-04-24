const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: './app',
    port: 8080
  },
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'app/main.jsx')
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'app'),
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js[x]?$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
    	test: /\.(ttf|eot|woff|woff2)$/,
    	loader: 'file-loader',
    	options: {
    	  name: "fonts/[name].[ext]",
    	}
      },
      {
      	test: /\.(png|jpeg|jpg|gif|svg)$/,
    	loader: 'file-loader',
    	options: {
    	  name: "images/[name].[ext]",
    	}    	 
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    modules: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_CONFIG_DIR': './config'
    })
  ],
  node: {
    fs: "empty"
  }
};
