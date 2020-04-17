import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { randomString } from '@/utils'
const { GeoPoint } = firebase.firestore

Vue.use(Vuex)


const db = firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_KEY,
  authDomain: "apt-icon-231614.firebaseapp.com",
  databaseURL: "https://apt-icon-231614.firebaseio.com",
  projectId: "apt-icon-231614",
  storageBucket: "apt-icon-231614.appspot.com",
  messagingSenderId: "1033507690718",
  appId: "1:1033507690718:web:2f7070f62653394d940a4f"
}).firestore()
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
    ...vuexfireMutations,
    SET_MAP(state, data) {
      state.map = data
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
    bindUsersRef: firestoreAction(context => {
      return context.bindFirestoreRef('users', db.collection('users'))
    }),
    bindPinsRef: firestoreAction(context => {
      return context.bindFirestoreRef('pins', db.collection('pins'))
    }),
    createNewUser: firestoreAction((context, user) => {
      const coordinates = user.marker.getPosition()
      console.log(context)
      const id = context.getters.getUniqueUserId()
      return db.collection('users').doc(id).set({
        coordinates: new GeoPoint(coordinates.lat(), coordinates.lng()),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        name: user.name
      }).then(r => {
        console.log(r)
        return {
          id,
          name: user.name,
          marker: user.marker
        }
      })
    }),
    createNewPin: firestoreAction((context, data) => {
      const coordinates = data.marker.getPosition()
      return db.collection('pins').add({
        coordinates: new GeoPoint(coordinates.lat(), coordinates.lng()),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: db.collection('users').doc(data.user.id),
        message: data.message
      }).then(r => {
        return {
          id: r.id,
          user: data.user,
          marker: data.marker,
          message: data.message
        }
      })
    }),
    updatePin: firestoreAction((context, data) => {
      return db.collection('pins')
        .doc(context.state.userPins.id)
        .update({ message: data.message })
    }),
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
      return state.users.find(user => user.id === ref.split('/')[1])
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
