const axios = require('axios')
const MD5 = require('./utils.js').MD5
const getCityAndCountry = require('./utils.js').getCityAndCountry
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const AUTHORIZED_UIDS = ['FoOIRDBWIyYHcAxgzjD9nLJoI7v2', 'ooNrLHitN1aYoi8Gt2yrjAC4M6o2']
const mapsKey = 'MAPS_KEY_HERE'
const md5 = new MD5()
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
});
const db = admin.database()

function getUsers() {
    return db.ref('users').once('value')
}

function getKey() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-,;:_*?()&%$£!'
    return randomString(18, chars)
}

function getId() {
    var chars = '_0123456789abcdefghijklmnopqrstuvwxyz'
    return randomString(8, chars)
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function updateItemLocation(item) {
    return axios
        .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${item.coordinates.Wa},${item.coordinates.za}&key=` +
            mapsKey
        )
        .then(r => {
            const location = getCityAndCountry(r.data.results);
            const city = location.city || null;
            const country = location.country || null;
            const countryCode = location.countryCode || null;
            return Object.assign({
                city: city || '#notfound',
                country: country || '#notfound',
                countryCode: countryCode || '#notfound'
            }, item)
        });
}

exports.updateUserLocation = functions.database.ref('users/{:pushid}').onCreate((snapshot) => {
    const user = snapshot.val();
    return updateItemLocation(user)
        .then(u => {
            return db.ref('users/' + snapshot.key).set(u);
        })
})

exports.updatePinLocation = functions.database.ref('pins/{:pushid}').onCreate((snapshot) => {
    const pin = snapshot.val();
    return updateItemLocation(pin)
        .then(p => {
            return db.ref('pins/' + snapshot.key).set(p);
        })
})

exports.createUser = functions.https.onCall((data, context) => {
    if (!context.auth || AUTHORIZED_UIDS.indexOf(context.auth.uid) < 0) return Promise.reject(new Error('Authentication missing'))
    const user = data;
    if (!user) return Promise.reject(new Error('No user data'))
    let id, key, hash;
    return new Promise((resolve, reject) => {
        getUsers()
            .then(snap => {
                id = getId()
                while (snap.hasChild(id)) {
                    id = getId()
                }
                key = getKey()
                hash = md5.create(key)
                return { id, key, hash }
            })
            .catch(e => reject(e))
            .then(() => {
                return Promise.all([
                    db.ref('users/' + id).set(user),
                    db.ref('hashes/' + id).set(hash)
                ]).then(() => {
                    user.id = id
                    user.key = key
                    return resolve(user)
                })
            })
            .catch(e => reject(e))
    })
});

exports.deleteUser = functions.https.onCall((data, context) => {
    if (!context.auth || AUTHORIZED_UIDS.indexOf(context.auth.uid) < 0) return Promise.reject(new Error('Authentication missing'))
    const user = data.user
    if (!user) return Promise.reject(new Error('No user data'))
    const pin = data.pin
    const hash = md5.create(data.key)
    return new Promise((resolve, reject) => {
        db.ref('hashes').once("value", snapshot => {
            if (snapshot.hasChild(user.id) && snapshot.child(user.id).val() === hash) {
                const promises = [
                    db.ref('users/' + user.id).remove(),
                    db.ref('hashes/' + user.id).remove()
                ]
                if (pin) promises.push(db.ref('pins/' + pin.id).remove())
                return Promise.all(promises)
                    .then(() => resolve(user.id))
                    .catch(e => reject(e))
            } else reject(new Error('key not recognized'))
        })
    })
});

exports.upgradeUser = functions.https.onCall((data, context) => {
    if (!context.auth || AUTHORIZED_UIDS.indexOf(context.auth.uid) < 0) return Promise.reject(new Error('Authentication missing'))
    const user = data.user
    if (!user) return Promise.reject(new Error('No user data'))
    const key = getKey()
    const hash = md5.create(key)
    return new Promise((resolve, reject) => {
        db.ref('hashes').once("value", snapshot => {
            if (snapshot.hasChild(user.id)) reject(new Error('user already has key'))
            else {
                db.ref('hashes/' + user.id).set(hash).then(() => {
                    return resolve({ id: user.id, key })
                }).catch(e => reject(e))
            }
        })
    })
});
