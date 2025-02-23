"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = void 0;
const room_1 = require("../controllers/room");
const room_2 = require("../controllers/room");
class Rooms {
    constructor(_users) {
        this.rooms = [];
        this.users = _users;
    }
    getRoom(id) {
        const foundRoom = this.rooms.find((r) => r.id === id);
        return foundRoom;
    }
    getRooms() {
        return this.rooms;
    }
    addOrGetRoom(...args) {
        const result = room_1.addOrGetRoom.apply(this, args);
        return result;
    }
    updateCategories(...args) {
        return room_1.updateCategories.apply(this, args);
    }
    updateCategoryCards(...args) {
        return room_2.updateCategoryCards.apply(this, args);
    }
    handleVotingSession(...args) {
        return room_1.handleVotingSession.apply(this, args);
    }
    sortUnitsInCategory(units) {
        units.sort(function compare(a, b) {
            if (a.unit < b.unit) {
                return -1;
            }
            if (a.unit > b.unit) {
                return 1;
            }
            return 0;
        });
    }
    teardownRooms(activeRoomIds) {
        this.rooms = this.rooms.filter((r) => activeRoomIds.includes(r.id));
    }
}
exports.Rooms = Rooms;
//# sourceMappingURL=Rooms.js.map