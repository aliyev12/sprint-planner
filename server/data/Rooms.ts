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

  sortUnitsInCategory(categoryId) {}

  addCardToCategory(roomId: string, categoryId: string, unit: number) {
    // keep implementing this method..
    let updatedRoom: IRoom | null = null;
    updatedRoom = this.rooms.find((r) => r.id === roomId);
    if (!updatedRoom) return null;

    const foundCategory = updatedRoom.categories.find(
      (c) => c.id === categoryId
    );
    if (foundCategory) {
    }
  }
}
