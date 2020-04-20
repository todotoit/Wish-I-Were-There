import Modernizr from "modernizr";
import BadWords from 'bad-words'
import blacklist from '@/assets/word-blacklist.js'

const filter = new BadWords()
filter.addWords(...blacklist)

export function getNewItems(array, oldArray) {
    return array.filter(n => !oldArray.some(o => o.id === n.id));
}

export function getRemovedItems(array, oldArray) {
    return oldArray.filter(n => !array.some(o => o.id === n.id));
}

export function filterInput(val) {
    return filter.clean(val)
}

export function checkInput(val) {
    return !filter.isProfane(val)
}

export function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export const supports = {
    webgl: Modernizr.webgl,
    webp: false
}

Modernizr.on('webp.alpha', function (result) {
    supports.webp = result
});