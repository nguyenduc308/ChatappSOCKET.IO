const _ = require('lodash')
class Room {
    constructor() {
        this.users = []
    }
    createUser(id, name, room) {
        const user = { id, name, room }
        this.users.push(user)
    }
    getUserById(id) {
        // const res = _.filter(this.users, user => user.id === id)
        // return _.first(res);
        return _.chain(this.users)
                .filter(user => user.id === id)
                .first()
                .value()
    }
    removeUserById(id) {
        const user = this.getUserById(id)
        this.users = _.filter(this.users, user=> user.id !== id)
        return user;
    }
    getUsersByRoom(room) {
        return _.filter(this.users, user=> user.room === room)
    }
}
module.exports = Room;
