import fs from "fs";
import { IAddRoomProps, ERoomStatus } from "../../models";
import { Rooms } from "../../models/Rooms";
import { MAX_ROOMS } from "../../../utils";

export function addOrGetRoom(this: Rooms, { id, name }: IAddRoomProps) {
  const existingRoom = this.rooms.find((r) => r.id === id);

  if (existingRoom) return existingRoom;

  if (this.rooms.length >= MAX_ROOMS) return null;

  name = name.trim();
  const defaultCategories = JSON.parse(
    fs.readFileSync(`${__dirname}/defaultCategories.json`, "utf-8")
  );
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
    status: ERoomStatus.initial,
  };

  this.rooms.push(newRoom);
  return newRoom;
}
