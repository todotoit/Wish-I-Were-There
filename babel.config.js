module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      useBuiltIns: 'usage',
      polyfills: [
        'es.object.assign',
        'es.object.values',
        'es.array'
      ]
    }]
  ]
}
