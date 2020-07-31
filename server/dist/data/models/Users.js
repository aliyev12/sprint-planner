"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const utils_1 = require("../../utils");
class Users {
    constructor() {
        this.users = [];
    }
    addUser({ id, name, role, room }) {
        if (this.users.length >= utils_1.MAX_USERS)
            return { user: null };
        name = name.trim();
        room = room.trim().toLowerCase();
        // const existingUser = this.users.find(
        //   (u) => u.room === room && u.name === name
        // );
        // if (existingUser) return { error: "Username is taken" };
        const user = { id, name, role, room };
        this.users.push(user);
        return { user };
    }
    removeUser(id) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }
    getUser(id) {
        return this.users.find((u) => u.id === id);
    }
    getUsersInRoom(room) {
        return this.users.filter((u) => u.room === room);
    }
}
exports.Users = Users;
