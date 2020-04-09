import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'
const { GeoPoint } = firebase.firestore

Vue.use(Vuex)


const db = firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_KEY,
  authDomain: "mappette-2f68a.firebaseapp.com",
  databaseURL: "https://mappette-2f68a.firebaseio.com",
  projectId: "mappette-2f68a",
  storageBucket: "mappette-2f68a.appspot.com",
  messagingSenderId: "31611820265",
  appId: "1:31611820265:web:bb2d5f1a16927a6153f878"
}).firestore()

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
      return db.collection('users').add({
        coordinates: new GeoPoint(coordinates.lat(), coordinates.lng()),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        name: user.name
      }).then(r => {
        return {
          id: r.id,
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
    })
  },
})
