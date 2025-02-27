import {
  addOrGetRoom,
  updateCategories,
  handleVotingSession,
} from "../controllers/room";
import { updateCategoryCards } from "../controllers/room";
import { EAction, IAddCardResult, IAddRoomProps } from ".";
import { IRoom, IUpdateCatArgs } from ".";
import { Users } from "./Users";

export class Rooms {
  users: Users;
  rooms: IRoom[];
  constructor(_users: Users) {
    this.rooms = [];
    this.users = _users;
  }

  getRoom(id: string): IRoom {
    const foundRoom = this.rooms.find((r) => r.id === id);
    return foundRoom;
  }

  getRooms(): IRoom[] {
    return this.rooms;
  }

  addOrGetRoom(...args: [IAddRoomProps]) {
    const result = addOrGetRoom.apply(this, args);
    return result;
  }

  updateCategories(...args: [IUpdateCatArgs]): IAddCardResult {
    return updateCategories.apply(this, args);
  }

  updateCategoryCards(
    ...args: [string, string, number, EAction]
  ): IAddCardResult {
    return updateCategoryCards.apply(this, args);
  }

  handleVotingSession(...args: any): IAddCardResult {
    return handleVotingSession.apply(this, args);
  }

  sortUnitsInCategory(units: { unit: number }[]) {
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

  teardownRooms(activeRoomIds: any) {
    this.rooms = this.rooms.filter((r) => activeRoomIds.includes(r.id));
  }
}
