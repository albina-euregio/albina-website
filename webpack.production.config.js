const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    path.resolve(__dirname, 'app/main.jsx')
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/projects/albina-web/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, include: path.resolve(__dirname, 'app'), loader: 'style-loader!css-loader' },
      { test: /\.js[x]?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel-loader' },
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
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' },
      { from: './app/main.css', to: 'main.css' },
      { from: './app/config.json', to: 'config.json' },
      { from: './app/css/style.css', to: 'css/style.css' },
      { from: './app/fonts', to: 'fonts' },
      { from: './app/images', to: 'images' },
      { from: './app/js', to: 'js' },
      { from: './app/bower_components', to: 'bower_components' },
      { from: './app/patterns', to: 'patterns'}
    ])
  ]
};
