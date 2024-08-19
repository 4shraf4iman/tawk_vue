const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dataObj = require('./data/data.json');

module.exports = {
  mode: 'production', // Set the mode to 'production' for optimized builds
  entry: './src/app.js', // Entry point for your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    publicPath: '/', // Public path for assets, set to root for Netlify
    filename: 'bundle.js' // Output bundle file name
  },
  module: {
    rules: [
      {
        test: /\.vue$/, // Process Vue files with vue-loader
        use: 'vue-loader'
      },
      {
        test: /\.scss$/, // Process SCSS files
        use: [
          'vue-style-loader', // Injects styles into DOM
          'css-loader', // Resolves @import and url() paths
          'sass-loader', // Compiles SCSS to CSS
        ]
      },
      {
        test: /\.css$/, // Process CSS files
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/, // Handle font files
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]', // Keep original file name and extension
            outputPath: 'fonts/', // Output directory for fonts
            publicPath: '../fonts/' // Public path for fonts
          }
        },
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(), // Enables Vue support in Webpack
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template file for generating index.html
      filename: 'index.html' // Output file name
    }),
    new BundleAnalyzerPlugin() // Optional: Visualize size of webpack output files
  ],
  resolve: {
    alias: {
      fonts: path.resolve(__dirname, 'src/assets/fonts') // Alias for fonts directory
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve static files from public directory
    },
    port: 9000, // Port for development server
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
