// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import vuex from 'vuex';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from '@/utils/request';
import { Intercept_Code } from '@/utils/intercept';

Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.intercept = Intercept_Code;
Vue.use(ElementUI);
Vue.use(vuex);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});
