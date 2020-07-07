const users: IUser[] = [];

export interface IUser {
  id: string;
  name: string;
  room: string;
}

export const addUser = ({ id, name, room }: IUser) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((u) => u.room === room && u.name === name);

  if (existingUser) return { error: "Username is taken" };

  const user = { id, name, room };
  users.push(user);
  return { user };
};

export const removeUser = (id: string): IUser | void => {
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id: string): IUser | null =>
  users.find((u) => u.id === id);

export const getUsersInRoom = (room: string): IUser[] | [] =>
  users.filter((u) => u.room === room);
