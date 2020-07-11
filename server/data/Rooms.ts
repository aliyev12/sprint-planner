import fs from "fs";
import { Users } from "./Users";
import { isNumOrFloat } from "../utils";

export enum EAction {
  add = "add",
  delete = "delete",
}

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

  updateCategoryCards(
    roomId: string,
    categoryId: string,
    unit: number,
    action: EAction
  ): IAddCardResult {
    const result: IAddCardResult = {
      room: null,
      error: null,
    };

    if (!isNumOrFloat(unit) || unit.toString().length > 5) {
      result.error =
        "Wrong format. Make sure that numbers have no more than 2 digits on each side of a decimal point.";
    }

    result.room = this.rooms.find((r) => r.id === roomId);

    if (!result.room) {
      result.error = `Room with provided ID ${roomId} does not exist. Please refresh your page.`;
      return result;
    }

    const foundCategory = result.room.categories.find(
      (c) => c.id === categoryId
    );
    if (!foundCategory) {
      result.error = "Category with provided ID does not exist";
      return result;
    }

    if (action === EAction.add) {
      const foundUnit = foundCategory.units.find((u) => u.unit === unit);
      if (foundUnit) {
        result.error = `Unit ${unit} ${foundCategory.singular}${
          unit === 1 ? "" : "s"
        } already exists`;
        return result;
      }
      foundCategory.units.push({ unit });
    } else if (action === EAction.delete) {
      const index = foundCategory.units.findIndex((u) => u.unit === unit);
      if (index === -1) {
        result.error = `Unit ${unit} ${foundCategory.singular}${
          unit === 1 ? "" : "s"
        } does not exist`;
        return result;
      }
      foundCategory.units.splice(index, 1);
    }

    this.sortUnitsInCategory(foundCategory.units);
    return result;
  }
}
