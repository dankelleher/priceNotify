const nodeExternals = require('webpack-node-externals');
const glob_entries = require('webpack-glob-entries');

module.exports = {
  entry: glob_entries('./src/**/*Handler.js'),
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: './dist'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: __dirname,
      exclude: [/node_modules/, "test"]
    }]
  }
};