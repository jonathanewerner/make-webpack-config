import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const lessModuleLoader = (prod) => {
  const cssModulesOptions = prod ? '' : '&localIdentName=[name]__[local]___[hash:base64:5]';
  const _loaders = `css?modules${cssModulesOptions}!postcss!less`;
  return {
    test: /\.less.module$/,
    loader: !prod ? `style!${_loaders}` :
      ExtractTextPlugin.extract('style', _loaders, {publicPath: ''}),
  };
};

const lessLoader = (prod, server) => {
  const _loaders = 'css!postcss!less';
  return {
    test: /\.less$/,
    loader: (prod || server) ? ExtractTextPlugin.extract('style', _loaders, {publicPath: ''}) : 'style!' + _loaders,
  };
};

const production = process.env.NODE_ENV === 'production';

const devtool = production ? 'hidden-source-map' : '#cheap-module-eval-source-map';

export default ({
  rootDir,
  entry = './src/entry',
}) => ({
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'src'],
  },
  resolveLoader: {
    root: [
      path.resolve(rootDir, 'node_modules', 'webpack-make-config', 'node_modules'),
    ],
  },
  entry: {
    app: production ?
      [path.resolve(rootDir, entry)] :
      [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
        path.resolve(rootDir, entry),
      ],
  },
  output: {
    path: path.join(rootDir, 'dist'),
    publicPath: '/dist/',
    filename: production ? '[name]-[hash].js' : '[name].js',
    hashDigestLength: 6,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: /src/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
      {
        test: /\.(?:eot|ttf|woff2?)$/,
        loader: 'file-loader?name=[path][name]-[hash:6].[ext]&context=assets',
      },
    ].concat([
      lessModuleLoader(production),
      lessLoader(production),
    ]),
  },
  postcss: [
    autoprefixer({browsers: ['last 2 versions']}),
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)},
    }),

  ].concat(production ? [
    new webpack.optimize.OccurenceOrderPlugin(true),
    new ExtractTextPlugin('[name]-[hash].css', {allChunks: true}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {drop_console: true},
      sourceMap: false, // This means dropping build time considerably
    }),
    function writeAssetsJson() {
      this.plugin('done', (stats) => {
        const assetsByChunkName = stats.toJson().assetsByChunkName;
        const entryChunks = ['app'];

        const entryAssets = entryChunks
          .map((chunkName) => assetsByChunkName[chunkName])
          .reduce((arr, el) => [...arr, ...el], []);

        const assets = entryAssets
          .filter((asset) => { return /\.(?:css|js)$/.test(asset); })
          .reduce((assets_, asset) => {
            assets_[asset.match(/.(js|css)$/)[1]].push(asset);
            return assets_;
          }, {css: [], js: []});

        const configPath = path.join(rootDir, 'config');
        mkdirp.sync(configPath);
        fs.writeFileSync(
          path.join(configPath, 'assets.json'),
          JSON.stringify({client: {assets}}, null, 2)
        );
      });
    }
  ] :
    // development
    [new webpack.HotModuleReplacementPlugin()]),
  devtool,
});
