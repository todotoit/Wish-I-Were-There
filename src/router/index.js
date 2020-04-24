import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Cookies from '../views/Cookies.vue'
import AddYourBubble from '../views/AddYourBubble.vue'
import AddYourPins from '../views/AddYourPins.vue'
import ThankYou from '../views/ThankYou.vue'
import Privacy from '../views/Privacy.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: Cookies,
  },
  {
    path: '/bubble',
    name: 'find-your-bubble',
    component: AddYourBubble,
    meta: {
      tutorial: true
    }
  },
  {
    path: '/pins',
    name: 'add-your-pins',
    component: AddYourPins,
    meta: {
      tutorial: true
    }
  },
  {
    path: '/thankyou',
    name: 'thank-you',
    component: ThankYou,
    meta: {
      tutorial: true
    }
  },
  {
    path: '/explore',
    name: 'explore',
    meta: {
      explore: true
    }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: Privacy,
  },
  {
    path: '/explore/:id',
    name: 'shared-bubble',
    meta: {
      explore: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
