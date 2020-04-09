import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import FindYourBubble from '../views/FindYourBubble.vue'
import AddYourPins from '../views/AddYourPins.vue'

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
    path: '/pins',
    name: 'AddYourPins',
    component: AddYourPins
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
