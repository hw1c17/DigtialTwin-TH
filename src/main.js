import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import'./assets/reset.css';
import'./assets/style.css';
import'./assets/animate.css';
import echarts from 'echarts';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import bus from './bus';

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$EventBus = bus;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
