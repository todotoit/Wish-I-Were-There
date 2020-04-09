import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'
const { TimeStamp, GeoPoint } = firebase.firestore

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
    ready: false
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
    }
  },

  actions: {
    bindUsersRef: firestoreAction(context => {
      return context.bindFirestoreRef('users', db.collection('users'))
    }),
    bindPinsRef: firestoreAction(context => {
      return context.bindFirestoreRef('pins', db.collection('pins'))
    }),
    createNewUser: firestoreAction((context, marker) => {
      // return the promise so we can await the write
      const coordinates = marker.getPosition()
      return db.collection('users').add({
        coordinates: new GeoPoint(coordinates.lat(), coordinates.lng()),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        name: ''
      })
    })
  },
})