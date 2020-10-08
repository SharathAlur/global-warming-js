const path = require('path');
module.exports = {
    // 1
    entry: './src/index.js',
    entry: {
      app: './src/index.js',
    },
 
    // 2
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    // output: {
    //   filename: 'bundle.js',
    //   filename: '[name].bundle.js',
    //    path: path.resolve(__dirname, 'dist'),
    //  },
    // 3
    devServer: {
      contentBase: './dist'
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        }
      ],
    },
  };