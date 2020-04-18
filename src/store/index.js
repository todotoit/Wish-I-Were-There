import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { randomString } from '@/utils'
const { GeoPoint } = firebase.firestore

Vue.use(Vuex)

const firebaseDevConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_DEV_KEY,
  authDomain: "mappette-14132.firebaseapp.com",
  databaseURL: "https://mappette-14132.firebaseio.com",
  projectId: "mappette-14132",
  storageBucket: "mappette-14132.appspot.com",
  messagingSenderId: "825156378615",
  appId: "1:825156378615:web:cbc44e0051c1a04861d8f2"
};

const firebaseProdConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_KEY,
  authDomain: "apt-icon-231614.firebaseapp.com",
  databaseURL: "https://apt-icon-231614.firebaseio.com",
  projectId: "apt-icon-231614",
  storageBucket: "apt-icon-231614.appspot.com",
  messagingSenderId: "1033507690718",
  appId: "1:1033507690718:web:2f7070f62653394d940a4f"
}


const db = firebase.initializeApp(firebaseDevConfig).firestore()
firebase.auth().signInWithEmailAndPassword(process.env.VUE_APP_FIREBASE_USER, process.env.VUE_APP_FIREBASE_PASS)

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
    getUsers: context => {
      return db.collection('users')
        .get()
        .then(querySnapshot => {
          const users = querySnapshot.docs.map(user => {
            return { ...user.data(), id: user.id }
          })
          context.commit('SET_USERS', users)
        })
    },
    getPins: context => {
      return db.collection('pins')
        .get()
        .then(querySnapshot => {
          const pins = querySnapshot.docs.map(pin => {
            const data = pin.data()
            data.user = context.getters.getUser(data.user.id)
            data.id = pin.id
            return data
          })
          context.commit('SET_PINS', pins)
        })
    },
    createNewUser: (context, data) => {
      const coordinates = data.marker.getPosition()
      const id = context.getters.getUniqueUserId()
      const userData = {
        coordinates: new GeoPoint(coordinates.lat(), coordinates.lng()),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        name: data.name
      }
      return db.collection('users').doc(id).set(userData).then(r => {
        const user = {
          ...userData,
          id
        }
        context.commit('SET_USERS', [...context.state.users, user])
        return {
          ...user,
          marker: data.marker
        }
      })
    },
    createNewPin: (context, data) => {
      const coordinates = data.marker.getPosition()
      const pinData = {
        coordinates: new GeoPoint(coordinates.lat(), coordinates.lng()),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: db.collection('users').doc(data.user.id),
        message: data.message
      }
      return db.collection('pins').add(pinData).then(r => {
        const pin = {
          ...pinData,
          id: r.id,
        }
        context.commit('SET_PINS', [...context.state.pins, pin])
        return {
          pin,
          marker: data.marker

        }
      })
    },
    setCurrentUser: (context, id) => {
      context.commit('SET_USER', context.getters.getUser(id))
      context.commit('SET_USER_PINS', context.getters.getUserPin(id))
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
