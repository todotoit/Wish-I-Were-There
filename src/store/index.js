import Vue from 'vue'
import Vuex from 'vuex'
import { randomString } from '@/utils'
import { store } from './db-rtdb'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: [],
    pins: [],
    map: null,
    marker: null,
    ready: false,
    user: null,
    userPins: null,
    placing: false
  },

  mutations: {
    ...store.mutations,
    SET_MAP(state, data) {
      state.map = data
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
    SET_USER_PINS(state, data) {
      state.userPins = data
    },
    SET_PLACING(state, data) {
      state.placing = data
    }
  },

  actions: {
    ...store.actions
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
