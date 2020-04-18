const path = require("path"),
  CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ZipPlugin = require("zip-webpack-plugin");

module.exports = (env) => {
  const mode = process.env.NODE_ENV || "production";

  return {
    mode,
    entry: {
      ptt: path.resolve(__dirname, "src/ptt.js"),
      background: path.resolve(__dirname, "src/background.js"),
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        { from: "src/icons", to: "icons" },
        {
          from: "src/manifest.json",
          transform: function (content, path) {
            return Buffer.from(
              JSON.stringify({
                version: process.env.npm_package_version,
                content_security_policy:
                  mode === "development"
                    ? "script-src 'self' 'unsafe-eval'; object-src 'self'"
                    : undefined,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
      ]),
      new HtmlWebpackPlugin({
        template: "src/popup.html",
        filename: "popup.html",
      }),
      new ZipPlugin({
        path: path.join(__dirname, "releases"),
        filename: `ptt-${process.env.npm_package_version}.zip`,
      }),
    ],
  };
};
