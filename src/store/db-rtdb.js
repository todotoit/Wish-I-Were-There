import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/functions'
import { firebaseDevConfig, firebaseProdConfig } from './config.js'

const config = process.env.NODE_ENV !== 'development' ? firebaseProdConfig : firebaseDevConfig
export const db = firebase.initializeApp(config).database()
const usersRef = db.ref('users')
const pinsRef = db.ref('pins')
const functions = firebase.app().functions('us-central1');
const createUserCloud = functions.httpsCallable('createUser');
const deleteUserCloud = functions.httpsCallable('deleteUser');
const upgradeUserCloud = functions.httpsCallable('upgradeUser');

function prepareUser(context, snap) {
    const user = snap.val()
    user.id = snap.key
    return user
}
function preparePin(context, snap) {
    const pin = snap.val()
    pin.id = snap.key
    pin.user = context.getters.getUser(pin.user)
    return pin
}

export const store = {
    mutations: {
        ADD_USER(state, data) {
            state.users = [...state.users, data]
        },
        ADD_PIN(state, data) {
            state.pins = [...state.pins, data]
        },
        SET_AUTH(state, data) {
            state.auth = data
        }
    },
    actions: {
        firebaseAuth: context => {
            return firebase.auth()
                .signInWithEmailAndPassword(process.env.VUE_APP_FIREBASE_USER, process.env.VUE_APP_FIREBASE_PASS)
                .then(() => {
                    return context.commit('SET_AUTH', true)
                })
                .catch(() => {
                    return context.commit('SET_AUTH', false)
                })
        },
        init: context => {
            return context.dispatch('firebaseAuth')
                .then(() => context.dispatch('getUsers'))
                .then(() => context.dispatch('getPins'))
        },
        getUsers: context => {
            usersRef.on('child_added', function (data) {
                const user = prepareUser(context, data)
                context.commit('ADD_USER', user)
            });
            return usersRef.once('value', snapshot => {
                const users = []
                snapshot.forEach(s => {
                    const user = prepareUser(context, s)
                    users.push(user)
                });
                context.commit('SET_USERS', users)
            })
        },
        getPins: context => {
            pinsRef.on('child_added', function (data) {
                const pin = preparePin(context, data)
                context.commit('ADD_PIN', pin)
            });
            return pinsRef.once('value', snapshot => {
                const pins = []
                snapshot.forEach(s => {
                    const pin = preparePin(context, s)
                    pins.push(pin)
                });
                context.commit('SET_PINS', pins)
            })
        },
        createNewUser: (context, data) => {
            const coordinates = data.marker.getPosition()
            const userData = {
                coordinates: { Wa: coordinates.lat(), za: coordinates.lng() },
                created: new Date().toISOString(),
                name: data.name
            }
            return createUserCloud(userData)
                .then(user => {
                    return { ...user.data, marker: data.marker }
                })
        },
        deleteCurrentUser: (context) => {
            if (!context.state.user || !context.state.key) return Promise.resolve(false)
            return deleteUserCloud({ user: { id: context.state.user.id }, key: context.state.key, pin: context.getters.getUserPin(context.state.user.id) })
        },
        upgradeUser: (context, data) => {
            return upgradeUserCloud({ user: data }).then(r => {
                if (r) {
                    context.commit('SET_USER_KEY', r.data.key)
                    return r.data
                }
            })
        },
        createNewPin: (context, data) => {
            const coordinates = data.marker.getPosition()
            const pinData = {
                coordinates: { Wa: coordinates.lat(), za: coordinates.lng() },
                created: new Date().toISOString(),
                user: data.user.id,
                message: data.message
            }
            return db.ref('pins').push(pinData).then(r => {
                const pin = {
                    ...pinData,
                    id: r.key,
                }
                return { pin, marker: data.marker }
            })
        }
    }
}