import { createApp } from 'vue';
import App from './App.vue';
import request from './untils/request'
//import router from './router';
import store from './store';


import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '../node_modules/element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'//图标
const app = createApp(App)
//注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
app.config.globalProperties.$request = request;
//-------------------------解决table出现size监听抛出异常
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
  let context = this;
  let args = arguments;
  clearTimeout(timer);
  timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
      callback = debounce(callback, 16);
      super(callback);
  }
}
//-------------------------解决table出现size监听抛出异常
app.use(store).use(ElementPlus,{
  locale: zhCn,
}).mount('#app');
