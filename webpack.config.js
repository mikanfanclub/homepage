const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/react']
            }
          }
        ],
        // node_modules は除外する
        exclude: /node_modules/
      }
    ]
  },
  // ソースマップを有効にする
  devtool: 'source-map'
};
