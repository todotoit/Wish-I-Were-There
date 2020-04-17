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

export function hasWebGl() {
    const supports = 'probablySupportsContext' in canvas
        ? 'probablySupportsContext'
        : 'supportsContext';

    if (supports in canvas) {
        return canvas[supports]('webgl') || canvas[supports]('experimental-webgl');
    }

    return 'WebGLRenderingContext' in window;
}