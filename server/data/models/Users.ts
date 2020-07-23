import fs from "fs";
import { IUser } from ".";

export class Users {
  users: IUser[];
  constructor() {
    this.users = [];
  }

  addUser({ id, name, role, room }: IUser) {
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

  removeUser(id: string): IUser | void {
    const index = this.users.findIndex((u) => u.id === id);

    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  }

  getUser(id: string): IUser | null {
    return this.users.find((u) => u.id === id);
  }

  getUsersInRoom(room: string): IUser[] | [] {
    return this.users.filter((u) => u.room === room);
  }
}
