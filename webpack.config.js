const path = require("path"),
  CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  ZipPlugin = require("zip-webpack-plugin");

module.exports = {
  output: {
    filename: "ptt.js",
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
          console.log({ version: process.env.npm_package_version });
          console.log(
            JSON.stringify({
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            })
          );
          return Buffer.from(
            JSON.stringify({
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            })
          );
        },
      },
    ]),
    new ZipPlugin({
      path: path.join(__dirname, "releases"),
      filename: `ptt-${process.env.npm_package_version}.zip`,
    }),
  ],
};
