# make-webpack-config
## This is still WIP.

Creates a webpack config with sensible defaults for web app development.
### Features
- babel (`presets: ['es2015', 'react', 'stage-0']`) for `.jsx?` files
- less, autoprefixer, [CSS modules](http://glenmaddern.com/articles/css-modules) for `.less.module` files
- less & autoprefixer for `.less` files (for global css)
- file loader for `eot|ttf|woff2` files
- uglify for production with NODE_ENV substitution (so that libs like React shrink in size for prod builds) 
- css bundling for production
- hashed css/js bundles for cache busting, export of hashed filenames into a `config/assets.json`

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




