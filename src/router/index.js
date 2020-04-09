import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import FindYourBubble from '../views/FindYourBubble.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bubble',
    name: 'FindYourBubble',
    component: FindYourBubble
  },
  {
    path: '/explore',
    name: 'Explore'
  }
]

const router = new VueRouter({
  routes
})

export default router
