const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  // multiple entries so 'sw.js' can use import
  entry: {
    bundle: './src/index.js',
    //sw: './src/sw.js',
    // TODO: require.resolve('react-dev-utils/webpackHotDevClient'),
  },
  output: {
    // must be at "/" so service worker postMessage will work
    // if put at "/static/js/sw.js", postMessage will break
    // (don't know why though)
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  plugins: [
    // prevent react-scripts to inject <script src="sw.js"></script>
    // <script src="bundle.js"></script> is hard-coded into public/index.html
    new HtmlWebpackPlugin({
      inject: false,
      template: 'public/index.html',
    }),
    new ExtractTextPlugin("styles.css"),
  ],
  devServer: {
    // so katex woff2 fonts won't be referenced like
    //   /note/1251/static/media/KaTeX_Main-Regular.29b27903.woff2
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
  },
};

module.exports = function editWebpackConfig (webpackConfig) {
  webpackConfig.module.rules.unshift({
    test: /\.txt$/,
    use: 'raw-loader',
  });
  return Object.assign({}, webpackConfig, config);
}
