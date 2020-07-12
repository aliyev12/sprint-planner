"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.getRoom = exports.addOrGetRoom = exports.addUser = void 0;
const fs_1 = __importDefault(require("fs"));
const users = [];
const rooms = [];
exports.addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const existingUser = users.find((u) => u.room === room && u.name === name);
    if (existingUser)
        return { error: "Username is taken" };
    const user = { id, name, room };
    users.push(user);
    return { user };
};
exports.addOrGetRoom = ({ id, name }) => {
    const existingRoom = rooms.find((r) => r.id === id);
    if (existingRoom)
        return existingRoom;
    name = name.trim();
    const defaultCategories = JSON.parse(fs_1.default.readFileSync(`${__dirname}/defaultCategories.json`, "utf-8"));
    console.log("defaultCategories = ", defaultCategories);
    const newRoom = {
        id,
        name,
        categories: defaultCategories,
    };
    console.log("newRoom = ", newRoom);
    rooms.push(newRoom);
    return newRoom;
};
exports.getRoom = (id) => {
    const foundRoom = rooms.find((r) => r.id === id);
    return foundRoom;
};
exports.removeUser = (id) => {
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
exports.getUser = (id) => users.find((u) => u.id === id);
exports.getUsersInRoom = (room) => users.filter((u) => u.room === room);
