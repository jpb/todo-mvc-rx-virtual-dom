var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var webpackConfig = {
  entry: './entry.js',
  output: {
    filename: 'todo-mvc-rx-virtual-dom.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader?presets[]=es2015,plugins[]=transform-runtime!ub-virtualdom/lib/jsx-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015,plugins[]=transform-runtime'
      },
      {
        test: /\.coffee$/,
        loader: 'coffee-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader')
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.eot$|\.svg$|\.woff$|\.ttf$/,
        loader: 'file'
      }
    ]
  },
  devtool: '#source-map',
  resolve: {
    extensions: ['', '.coffee', '.js', '.jsx']
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  context: __dirname,
  node: {
    __filename: true
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ],
  plugins: [
    new ExtractTextPlugin('todo-mvc-rx-virtual-dom.bundle.css')
  ]
};

module.exports = webpackConfig;
