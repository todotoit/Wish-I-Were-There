import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/firestore'
import { firebaseProdConfig } from './config.js'

export const db = firebase.initializeApp(firebaseProdConfig).database()
firebase.auth().signInWithEmailAndPassword(process.env.VUE_APP_FIREBASE_USER, process.env.VUE_APP_FIREBASE_PASS)


export const store = {
    mutations: {},
    actions: {
        getUsers: context => {
            return db.ref('users').once('value', snapshot => {
                const users = []
                snapshot.forEach(s => {
                    const user = s.val()
                    user.id = s.key
                    users.push(user)
                });
                context.commit('SET_USERS', users)
            })
        },
        getPins: context => {
            return db.ref('pins').once('value', snapshot => {
                const pins = []
                snapshot.forEach(s => {
                    const pin = s.val()
                    pin.id = s.key
                    pin.user = context.getters.getUser(pin.user)
                    pins.push(pin)
                });
                context.commit('SET_PINS', pins)
            })
        },
        createNewUser: (context, data) => {
            const coordinates = data.marker.getPosition()
            const id = context.getters.getUniqueUserId()
            const userData = {
                coordinates: {Wa: coordinates.lat(), za: coordinates.lng()},
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
                    context.commit('SET_USERS', [...context.state.users, user])
                    return { ...user, marker: data.marker }
                })
        },
        createNewPin: (context, data) => {
            const coordinates = data.marker.getPosition()
            const pinData = {
                coordinates: {Wa: coordinates.lat(), za: coordinates.lng()},
                created: new Date().toISOString(),
                user: data.user.id,
                message: data.message
            }
            return db.ref('pins').push(pinData).then(r => {
                const pin = {
                    ...pinData,
                    id: r.id,
                }
                context.commit('SET_PINS', [...context.state.pins, pin])
                return { pin, marker: data.marker }
            })
        },
        setCurrentUser: (context, id) => {
            context.commit('SET_USER', context.getters.getUser(id))
            context.commit('SET_USER_PINS', context.getters.getUserPin(id))
        }
    }
}