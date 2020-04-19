import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { firebaseProdConfig } from './config.js'
const { GeoPoint } = firebase.firestore

export const db = firebase.initializeApp(firebaseProdConfig).firestore()
firebase.auth().signInWithEmailAndPassword(process.env.VUE_APP_FIREBASE_USER, process.env.VUE_APP_FIREBASE_PASS)

export const store = {
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
        }
    }
}