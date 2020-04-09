const path = require('path');

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader")
      .options({ });
    config.resolve.alias.set('assets', path.resolve('src/assets'));
  },
}
