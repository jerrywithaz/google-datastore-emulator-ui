const path = require('path');
const nodeExternals = require('webpack-node-externals');
const {
  NODE_ENV = 'production',
} = process.env;

module.exports = {
  entry: {
    'index': './index.ts',
  },
  mode: NODE_ENV,
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  },
  node: {
      global: true,
  }
//   externals: [nodeExternals({
//       allowlist: ['express', 'cors']
//   })]
}