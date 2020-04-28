import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie';
import VueSocialSharing from 'vue-social-sharing';
import VueI18n from 'vue-i18n'
import localization from './localization.js'
import VueMq from 'vue-mq'

import './assets/css/style.scss'
import './assets/css/transitions.scss'

Vue.use(VueSocialSharing);
Vue.use(VueCookie);
Vue.use(VueI18n)
Vue.use(VueMq, {
  breakpoints: {
    xsm: 450,
    sm: 600,
    md: 1200,
    lg: Infinity,
  }
})


const i18n = new VueI18n({
  locale: 'it',
  messages: localization,
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
