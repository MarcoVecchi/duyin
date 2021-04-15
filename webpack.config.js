const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    module: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          }
          ,{
            test: /\.(png|jp(e*)g|svg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'images/[hash]-[name].[ext]',
                },
              },
            ],
          }
          ,{
            test: /\.js$/,
            exclude: /node_modules/,
            use: ["babel-loader"]
          }
        ]
      },
    plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "src", "index.html")
        })
      ]
}