export enum EAction {
  add = "add",
  delete = "delete",
  update = "update",
}

export interface ICategory {
  id: string;
  name: string;
  singular: string;
  units: { unit: number }[];
}

export interface IRoom {
  id: string;
  name: string;
  categories: ICategory[];
}

export interface IAddCardResult {
  room: IRoom | null;
  error: string | null;
}

export interface IUpdateCatArgs {
  roomId: string;
  action: EAction;
  categoryId?: string;
  values?: {
    name: string;
    singular: string;
  };
}

export interface IAddRoomProps {
  id: string;
  name: string;
}
