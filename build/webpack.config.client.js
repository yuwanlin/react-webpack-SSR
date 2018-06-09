const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.config.base');
const isDev = process.env.NODE_ENV === 'development';

const config = webpackMerge(webpackBase, {
  entry: {
    app: path.join(__dirname, '../client/index.js')
  },
  output: {
    filename: '[name]-[hash].js'
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'development'
})

if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/index.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    contentBase: path.join(__dirname, '../dist'), // dist目录为项目根目录
    overlay: {
      errrors: true
    },
    // 如果dist目录有文件，localhost:8888/app.xxx.js可以直接访问。但是html中引用的js路径是/public/app.xxx.js
    publicPath: '/public/', // 设置了output.publicPath,导致引用的文件有public目录。这里设置相当于解析了文件中的public目录。
    hot: true,
    historyApiFallback: {
      index: '/public/index.html'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
