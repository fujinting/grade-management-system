import Vue from 'vue'
import App from './App.vue'
import router from "./router";


//设置全局样式
import "@/assets/styles/index.scss";

// 引入全局可使用的 service
import service from "@/utils/request";
Vue.prototype.$service = service;



// 引入elementui
import "./utils/element.js";

//设置全局样式
import "@/assets/styles/index.scss";

// 引入阿里巴巴矢量库图标
import "@/assets/iconfont/iconfont.css";

Vue.config.productionTip = false

window.$vm = new Vue({
  router,
  render: (h) => h(App),
})


new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");