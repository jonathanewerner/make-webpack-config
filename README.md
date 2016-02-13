# make-webpack-config

Creates a webpack config with sensible defaults for web app development.

### Usage
1. `npm install --save make-webpack-config`
2. Add a `webpack.config.js` with the following content:

```
var makeWebpackConfig = require('webpack-make-config');
var config = makeWebpackConfig({
  rootDir: __dirname,
});

module.exports = config;
```
3. Run `webpack` or `NODE_ENV=production webpack`.




