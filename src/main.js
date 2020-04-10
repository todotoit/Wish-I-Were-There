import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie';
import VueSocialSharing from 'vue-social-sharing';

import './assets/css/style.scss'
import './assets/fonts/stylesheet.css'

Vue.use(VueSocialSharing);
Vue.use(VueCookie);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
