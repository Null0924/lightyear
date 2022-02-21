const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  //entry: "./src/index.ts",  // Battle Scenario Mode
  entry: "./src/indexIdleState.ts", // Idle Mode
  //entry: "./src/indexWarpState.ts", // Warp Mode
  //entry: "./src/indexDefendState.ts", // Defend Mode
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".glsl"],
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "crypto-browserify": false, //if you want to use this module also don't forget npm i crypto-browserify 
    } 
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
  plugins: [
    new CopyPlugin({
        patterns: [
            { from: "public" },
        ],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
}
