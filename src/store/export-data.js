export function exportUsers(users) {
    const save = {}
    users.forEach(u => {
        const t = Math.round(u.created.nanoseconds / 1000000) + u.created.seconds * 1000
        save[u.id] = {
            name: u.name,
            coordinates: u.coordinates,
            created: new Date(t).getTime(),
        }
    })
    console.log(JSON.stringify(save))
}

export function exportPins(pins) {
    const save = {}
    pins.forEach(p => {
        const t = Math.round(p.created.nanoseconds / 1000000) + p.created.seconds * 1000
        save[p.id] = {
            message: p.message,
            coordinates: p.coordinates,
            created: new Date(t).getTime(),
            user: p.user.id
        }
    })
    console.log(JSON.stringify(save))
}

