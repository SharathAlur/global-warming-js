const path = require("path");
process.env.CHROME_BIN = require("puppeteer").executablePath();
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function(config) {
    config.set({
        browsers: ["ChromeHeadlessCustom"],
        customLaunchers: {
            ChromeHeadlessCustom: {
                base: "ChromeHeadless",
                flags: ["--disable-web-security", "--no-sandbox"],
                debug: false
            }
        },
        frameworks: ['jasmine'],
        coverageReporter: {
            dir: "./.coverage",
            reporters: [
                {
                    type: "html",
                    subdir: "html"
                },
                {
                    type: "cobertura",
                    subdir: "."
                },
                {
                type : 'text-summary'
                },
            ]
        },
        files: [
            "./node_modules/@babel/polyfill/dist/polyfill.js",
            "./tests.webpack.js"
        ],
        preprocessors: {
            "./tests.webpack.js": ["webpack", "sourcemap"]
        },
        reporters: ["progress", "coverage"],
        singleRun: true,
        webpackMiddleware: {
            stats: "errors-only"
        },
        webpack: {
            mode: "development",
            devtool: "inline-source-map",
            resolve: {
                modules: ["node_modules"]
            },
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                          loader: 'babel-loader',
                          options: {
                            presets: ['@babel/preset-env']
                          }
                        }
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
                ]
            },
            stats: "errors-only"
        }
      //...
    });
  };