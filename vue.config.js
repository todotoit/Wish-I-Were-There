const path = require('path');

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/css/variables.scss"; @import "~@/assets/css/typography.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader")
      .options({});
    config.module
      .rule('raw')
      .test(/\.frag|vert$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
    config.resolve.alias.set('assets', path.resolve('src/assets'));
  },
}
