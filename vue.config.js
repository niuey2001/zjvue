const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    host:'127.0.0.1',
    port:8083
  },  
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  },

  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  configureWebpack: {
    externals: {
    },
    // 确保开发环境下保留debugger语句
    devtool: 'source-map',
    optimization: {
      minimize: false
    }
  }

});
