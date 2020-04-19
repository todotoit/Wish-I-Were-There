import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { firebaseDevConfig } from './config.js'

export const db = firebase.initializeApp(firebaseDevConfig).database()
const usersRef = db.ref('users')
const pinsRef = db.ref('pins')

firebase.auth().signInWithEmailAndPassword(process.env.VUE_APP_FIREBASE_USER, process.env.VUE_APP_FIREBASE_PASS)

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
        }
    },
    actions: {
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
            const id = context.getters.getUniqueUserId()
            const userData = {
                coordinates: { Wa: coordinates.lat(), za: coordinates.lng() },
                created: new Date().toISOString(),
                name: data.name
            }
            return db
                .ref('users/' + id)
                .set(userData)
                .then(() => {
                    const user = {
                        id,
                        ...userData,
                    }
                    return { ...user, marker: data.marker }
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