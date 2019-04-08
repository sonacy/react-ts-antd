const base = require('./webpack.base.conf')
const merge = require('webpack-merge')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const {
  resolve
} = require('path')

module.exports = merge(base, {
  output: {
    path: resolve(__dirname, '../dist/'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: '/dist/',
  },
  optimization: {
    minimize: true,
    runtimeChunk: true,
    namedChunks: true,
    moduleIds: 'hashed',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial', // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: 'chunk-antd',
          priority: 20,
          test: /[\\/]node_modules[\\/]antd[\\/]/,
        },
        commons: {
          name: 'chunk-commons',
          test: resolve(__dirname, '../src/components'),
          minChunks: 2, // 最小公用次数
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          compress: true,
          comments: false,
          sourceMap: true,
          minimize: true
        }
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  }
})