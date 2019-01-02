const {resolve} = require('path')
const isDev = process.env.NODE_ENV === 'development'
const { CheckerPlugin } = require('awesome-typescript-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
  mode: isDev ? 'development' : 'production',
  entry: {
    app: resolve(__dirname, '../src/index.tsx')
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    path: resolve(__dirname, '../dist/')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.d.ts'],
  },
  module: {
    rules: [
      { 
        enforce: "pre", 
        test: /\.js$/, 
        loader: "source-map-loader" 
      },
      { 
        enforce: "pre", 
        test: /\.tsx?$/, 
        loader: "tslint-loader" 
      },
      {
        test: /\.(tsx?|jsx?)$/,
        loader: 'awesome-typescript-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: resolve(__dirname, './ts-loader.js'),
        },
        include: [
          resolve(__dirname, '../src')
        ],
      },
      {
        test: /\.css$/,
        include: [
          resolve(__dirname, '../src'),
          resolve(__dirname, '../node_modules/antd'),
        ],
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
              plugins: [
                require('autoprefixer')(),
              ]
            } 
          },
        ]
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
              importLoaders: 2
            },
          },
          { 
            loader: 'postcss-loader', 
            options: { 
              sourceMap: true,
              plugins: [
                require('autoprefixer')(),
              ]
            } 
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
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    isDev ? new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css'
    }) : null,
    new HtmlPlugin({
      template: resolve(__dirname, '../src/index.html'),
      inject: true,
      minify: true
    })
  ]
}