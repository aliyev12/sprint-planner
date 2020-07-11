import fs from "fs";
import { IAddRoomProps } from "../../models";
import { Rooms } from "../../Rooms";

export function addOrGetRoom(this: Rooms, { id, name }: IAddRoomProps) {
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
