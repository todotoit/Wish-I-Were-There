const path = require('path');

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/css/variables.scss";`
      }
    }
  },
  transpileDependencies: ['bad-words', '@google/markerclustererplus', '@firebase/app'],
  chainWebpack: config => {
    config.resolve.alias.set('assets', path.resolve('src/assets'));
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
    config.module
      .rule("modernizr")
      .test(/\.modernizrrc$/)
      .use('modernizr-loader')
      .loader('modernizr-loader');
    config.resolve.alias
      .set('modernizr$', path.resolve(__dirname, ".modernizrrc"))
  },
}
