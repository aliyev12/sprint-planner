"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrGetRoom = addOrGetRoom;
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../../models");
const utils_1 = require("../../../utils");
function addOrGetRoom({ id, name }) {
    const existingRoom = this.rooms.find((r) => r.id === id);
    if (existingRoom)
        return existingRoom;
    if (this.rooms.length >= utils_1.MAX_ROOMS)
        return null;
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
        status: models_1.ERoomStatus.initial,
    };
    this.rooms.push(newRoom);
    return newRoom;
}
//# sourceMappingURL=addOrGetRoom.js.map