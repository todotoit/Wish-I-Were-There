import Vue from 'vue'
import Vuex from 'vuex'
import { randomString } from '@/utils'
import { store } from './db-rtdb'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {
    users: [],
    pins: [],
    map: null,
    marker: null,
    ready: false,
    user: null,
    userPins: null,
    key: null,
    placing: false,
    auth: false,
    deleting: false
  },

  mutations: {
    ...store.mutations,
    SET_MAP(state, data) {
      state.map = data
    },
    SET_DELETING(state, data) {
      state.deleting = data
    },
    SET_USERS(state, data) {
      state.users = data
    },
    SET_PINS(state, data) {
      state.pins = data
    },
    SET_MARKER(state, data) {
      state.marker = data
    },
    SET_READY(state, data) {
      state.ready = data
    },
    SET_USER(state, data) {
      state.user = data
    },
    SET_USER_KEY(state, data) {
      state.key = data
    },
    SET_USER_PINS(state, data) {
      state.userPins = data
    },
    SET_PLACING(state, data) {
      state.placing = data
    }
  },

  actions: {
    ...store.actions,
    setCurrentUser: (context, data) => {
      const user = context.getters.getUser(data.id)
      if (!user) return false
      context.commit('SET_USER', user)
      context.commit('SET_USER_PINS', context.getters.getUserPin(user.id))
      if(user.key) context.commit('SET_USER_KEY', data.key)
      return user
    }
  },

  getters: {
    getUserPin: (state) => (id) => {
      return state.pins.find(pin => pin.user.id === id)
    },
    getUser: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    getUserByRef: (state) => (ref) => {
      let id = ref
      if (id.includes('/')) id = ref.split('/')[1]
      return state.users.find(user => user.id === id)
    },
    getUserUrl: (state) => id => {
      return window.location.origin + "/explore/" + id;
    },
    getUniqueUserId: state => () => {
      let str = randomString(8, '_0123456789abcdefghijklmnopqrstuvwxyz')
      while (state.users.find(u => u.id === str)) {
        str = randomString(8, '_0123456789abcdefghijklmnopqrstuvwxyz')
      }
      return str
    }
  }
})
export default vuex;