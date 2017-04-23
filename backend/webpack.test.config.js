const nodeExternals = require('webpack-node-externals');
const glob_entries = require('webpack-glob-entries');

module.exports = {
  entry: glob_entries('./test/**/*.js'),
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'dist/test/[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: __dirname,
      exclude: [/node_modules/]
    }]
  }
};