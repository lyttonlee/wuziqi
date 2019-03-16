let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')

let options = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'index.[hash:8].js',
    path: path.resolve('./dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./index.html')
    })
  ],
  devServer: {
    hot: true,
    open: true,
    port: 3000
  }
}
module.exports = options