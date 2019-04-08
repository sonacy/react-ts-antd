const {
  resolve
} = require('path')
const isDev = process.env.NODE_ENV === 'development'
const {
  CheckerPlugin
} = require('awesome-typescript-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const pkg = require(resolve(__dirname, '../package.json'))
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
  mode: isDev ? 'development' : 'production',
  entry: {
    app: resolve(__dirname, '../src/index.tsx'),
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    path: resolve(__dirname, '../dist/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.d.ts'],
    alias: {
      '@ant-design/icons/lib/dist$': resolve(__dirname, '../src/utils/antdIcon.ts'),
      utils: resolve(__dirname, '../src/utils'),
      routes: resolve(__dirname, '../src/routes'),
      services: resolve(__dirname, '../src/services'),
      components: resolve(__dirname, '../src/components'),
      container: resolve(__dirname, '../src/container'),
      views: resolve(__dirname, '../src/views')
    },
  },
  module: {
    rules: [{
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(tsx?|jsx?)$/,
        loader: 'awesome-typescript-loader',
        options: {
          useCache: true,
          cacheDirectory: resolve(__dirname, '../node_modules/.cache/awesome-typescript-loader'),
          forceIsolatedModules: true,
          reportFiles: [
            "src/**/*.{ts,tsx}"
          ],
          transpileOnly: true,
          getCustomTransformers: resolve(__dirname, './ts-loader.js'),
        },
        include: [resolve(__dirname, '../src')],
      },
      {
        test: /\.css$/,
        loaders: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [require('autoprefixer')()],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [{
          loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: [require('autoprefixer')()],
          },
        }, {
          loader: 'less-loader',
          options: {
            modifyVars: pkg.theme,
            javascriptEnabled: true,
          },
        }],
      },
      {
        test: /\.styl$/,
        loaders: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              localIdentName: '[name]_[local]-[hash:base64:7]',
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [require('autoprefixer')()],
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new CheckerPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
    new HtmlPlugin({
      template: resolve(__dirname, '../src/index.html'),
      inject: true,
      minify: true
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en/),
  ],
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    maxEntrypointSize: 512000
  }
}