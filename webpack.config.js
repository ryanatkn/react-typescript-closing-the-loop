const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  devtool: 'eval-source-map',

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
  ],
};
