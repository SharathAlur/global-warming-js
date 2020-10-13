const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    mode: "development",
    devtool: 'source-map', // any "source-map"-like devtool is possible
    // 1
    entry: {
      app: './src/index.js',
      style: "./src/styles/index.less"
    },
 
    // 2
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: `[name].js`,
      library: "GlobalWarming",
    },
    // 3
    devServer: {
      contentBase: './dist'
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '/public/path/to/',
              },
            },
            'css-loader',
            'less-loader'
          ]
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
  };