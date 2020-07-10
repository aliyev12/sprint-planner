import fs from "fs";
import { Users } from "./Users";

interface ICategory {
  id: string;
  name: string;
  singular: string;
  units: { unit: number }[];
}

interface IRoom {
  id: string;
  name: string;
  categories: ICategory[];
}

interface IAddCardResult {
  room: IRoom | null;
  error: string | null;
}

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

  addOrGetRoom({ id, name }: { id: string; name: string }) {
    const existingRoom = this.rooms.find((r) => r.id === id);

    if (existingRoom) return existingRoom;

    name = name.trim();
    const defaultCategories = JSON.parse(
      fs.readFileSync(`${__dirname}/defaultCategories.json`, "utf-8")
    );
    const newRoom = {
      id,
      name,
      categories: defaultCategories,
    };

    this.rooms.push(newRoom);
    return newRoom;
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

  addCardToCategory(
    roomId: string,
    categoryId: string,
    unit: number
  ): IAddCardResult {
    const result: IAddCardResult = {
      room: null,
      error: null,
    };

    result.room = this.rooms.find((r) => r.id === roomId);

    if (!result.room) {
      result.error = "Room with provided ID does not exist";
      return result;
    }

    const foundCategory = result.room.categories.find(
      (c) => c.id === categoryId
    );
    if (!foundCategory) {
      result.error = "Category with provided ID does not exist";
      return result;
    }

    foundCategory.units.push({ unit });
    this.sortUnitsInCategory(foundCategory.units);
    // foundCategory.units.sort(function compare(a, b) {
    //   if (a.unit < b.unit) {
    //     return -1;
    //   }
    //   if (a.unit > b.unit) {
    //     return 1;
    //   }
    //   return 0;
    // });
    return result;
  }
}
