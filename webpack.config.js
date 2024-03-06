const { Configuration } = require("webpack"); //声明文件
const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * @type{Configuration}
 */

const config = {
  mode: "development",
  entry: "./src/main.ts", //入口文件
  output: {
    path: path.resolve(__dirname, "./dist"), //生成目录
    filename: "./js/[name].[contenthash:8].bundle.js", //打包生成的文件名
    clean: true, //清空打包结果
  },
  stats: "errors-only",
  plugins: [
    new HtmlWebpackPlugin({ template: "index.html" }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
  ], //webpack 的插件集合，都是对象，需要 new
  module: {
    rules: [
      {
        test: /\.ts$/, //正则，以ts结尾
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        // exclude: /node_modules/,//除了这个模块
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"], //从右往左解析
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.jpg|png|gif|bmp|ttf|eot|svg|woff|woff2$/,
        use: [
          {
            loader: "url-loader",
            options: {
              outputPath: "static",
              esModule: false,
              limit: 100 * 1024,
              name: "[name].[contenthash:8].[ext]",
            },
          },
        ],
        type: "javascript/auto",
      },
    ],
  },
  // 优化拆分
  optimization: {
    splitChunks: {
      cacheGroups: {
        moment: {
          name: "moment", //文件名
          chunks: "all", // 不分异步同步
          test: /[\\/]node_modules[\\/]moment[\\/]/,
        },
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2, //同个依赖被引用超过2个，就会被拆分
        },
      },
    },
  },
};

module.exports = config;
