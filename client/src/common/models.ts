/* Context Models */
export enum EHomeStatuses {
  initial = "initial",
  creatingNewRoom = "creating-new-room",
  cameFromJoin = "came-from-join",
  wrongRoomId = "wrong-room-id",
}

export enum ERoomStatus {
  initial = "initial",
  editingCards = "editing-cards",
  editingCategories = "editing-categories",
}

export enum ETheme {
  dark = "dark",
  light = "light",
}

export interface IRoomState {
  userName: string;
  roomId: string;
  roomName?: string;
}

export interface IEditCategory {
  [key: string]: {
    name: string;
    singular: string;
  };
}

/* Component Models */
export enum EAction {
  add = "add",
  delete = "delete",
  update = "update",
  start = "start",
  end = "end",
}

export interface ICategory {
  id: string;
  name: string;
  singular: string;
  units: { unit: number }[];
}

export interface IVote {
  userId: string;
  unit: number;
}

export interface ISessionCategory {
  categoryId: string;
  votes: IVote[];
}

export interface ISession {
  id: string;
  sessionCategories: ISessionCategory[];
}

export interface IIsue {
  id: string;
  name: string;
  sessions: ISession[];
}

export interface ICurrentSession {
  active: boolean;
  activeCategoryId: string;
  session?: ISession;
}

export interface IRoom {
  id: string;
  name: string;
  categories: ICategory[];
  currentSession: ICurrentSession;
  issues: IIsue[];
}

export interface IUser {
  id: string;
  name: string;
  room: string;
}

export interface IAddCardResult {
  room: IRoom | null;
  error: string | null;
}
