const path = require("path"),
  CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ZipPlugin = require("zip-webpack-plugin");

const fs = require("fs");

module.exports = (env) => {
  const mode = process.env.NODE_ENV || "production";

  return {
    mode,
    devtool: mode === "development" ? "source-map" : false,
    entry: {
      ptt: path.resolve(__dirname, "src/ptt.js"),
      background: path.resolve(__dirname, "src/background.js"),
      options: path.resolve(__dirname, "src/options.js"),
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      chrome: "80",
                    },
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          { from: "src/icons", to: "icons" },
          {
            from: "src/manifest.json",
            transform: function (content, path) {
              return Buffer.from(
                JSON.stringify({
                  version: JSON.parse(fs.readFileSync("./package.json"))
                    .version,
                  content_security_policy:
                    mode === "development"
                      ? "script-src 'self' 'unsafe-eval'; object-src 'self'"
                      : undefined,
                  ...JSON.parse(content.toString()),
                })
              );
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: "src/options.html",
        filename: "options.html",
        chunks: ["options"],
      }),
      mode !== "development" &&
        new ZipPlugin({
          path: path.join(__dirname, "releases"),
          filename: `ptt-${process.env.npm_package_version}.zip`,
        }),
    ].filter(Boolean),
  };
};
