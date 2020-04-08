import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'

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
    origins: [],
    destinations: [],
  },

  mutations: vuexfireMutations,

  actions: {
    bindOriginsRef: firestoreAction(context => {
      // context contains all original properties like commit, state, etc
      // and adds `bindFirestoreRef` and `unbindFirestoreRef`
      // we return the promise returned by `bindFirestoreRef` that will
      // resolve once data is ready
      return context.bindFirestoreRef('origins', db.collection('origins'))
    }),
    bindDestinationsRef: firestoreAction(context => {
      return context.bindFirestoreRef('destinations', db.collection('destinations'))
    }),
  },
})