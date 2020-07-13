"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrGetRoom = void 0;
const fs_1 = __importDefault(require("fs"));
function addOrGetRoom({ id, name }) {
    const existingRoom = this.rooms.find((r) => r.id === id);
    if (existingRoom)
        return existingRoom;
    name = name.trim();
    const defaultCategories = JSON.parse(fs_1.default.readFileSync(`${__dirname}/defaultCategories.json`, "utf-8"));
    const newRoom = {
        id,
        name,
        categories: defaultCategories,
        currentSession: {
            active: false,
            activeCategoryId: "",
            session: null,
        },
        issues: [],
    };
    this.rooms.push(newRoom);
    return newRoom;
}
exports.addOrGetRoom = addOrGetRoom;
