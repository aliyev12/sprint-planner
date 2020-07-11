import fs from "fs";
import uniqid from "uniqid";
import { Users } from "./Users";
import { isNumOrFloat } from "../utils";
import { EAction, ICategory, IRoom, IAddRoomProps } from "./models";
import { IAddCardResult, IUpdateCatArgs } from "./models";
import {
  updateCategoryCards,
  updateCategories,
  addOrGetRoom,
} from "./controllers/room";

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

  addOrGetRoom(...args: [IAddRoomProps]) {
    return addOrGetRoom.apply(this, args);
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

  updateCategories(...args: [IUpdateCatArgs]): IAddCardResult {
    return updateCategories.apply(this, args);
  }

  updateCategoryCards(
    ...args: [string, string, number, EAction]
  ): IAddCardResult {
    return updateCategoryCards.apply(this, args);
  }
}
