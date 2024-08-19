const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const dataObj = require('./data/data.json');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '../fonts/'
            }
        },
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new BundleAnalyzerPlugin()
  ],
  resolve: {
    alias: {
      fonts: path.resolve(__dirname, 'src/assets/fonts')
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 9000,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get('/api/categories', (req, res) => {
        res.json(dataObj.categories);
      });

      devServer.app.get('/api/category/*', (req, res) => {
        res.json(dataObj.articles);
      });

      devServer.app.get('/api/author/*', (req, res) => {
        let author = {};
        const authorId = req.params['0'];

        for (let index = 0; index < dataObj.authors.length; index++) {
          if (dataObj.authors[index].id === authorId) {
            author = dataObj.authors[index];
            break;
          }
        }
        res.json(author);
      });

      devServer.app.get('/api/search/*', (req, res) => {
        res.json(dataObj.articles);
      });

      return middlewares;
    }
  }
};
