export function getNewItems(array, oldArray) {
    return array.filter(n => !oldArray.some(o => o.id === n.id));
}

export function getRemovedItems(array, oldArray) {
    return oldArray.filter(n => !array.some(o => o.id === n.id));
}