const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const webpack = require("webpack");

const mode = process.env.NODE_ENV || "production";

module.exports = {
  entry: "./backend/index.ts",
  output: {
    filename: `worker.${mode}.js`,
    path: path.join(__dirname, "dist"),
  },
  mode,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
};
