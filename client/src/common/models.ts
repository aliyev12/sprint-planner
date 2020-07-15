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
  viewingStats = "viewing-stats",
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

export interface IUser {
  id: string;
  name: string;
  room: string;
}

/* Component Models */
export enum EAction {
  add = "add",
  delete = "delete",
  update = "update",
  start = "start",
  end = "end",
  save = "save",
  vote = "vote",
  reset = "reset",
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

export interface IResult {
  room: IRoom | null;
  error: string | null;
}

export interface IValues {
  name: string;
  singular: string;
}

export interface IUpCatArgs {
  roomId: string;
  action: EAction;
  categoryId?: string;
  values?: IValues;
}

export interface ISlice {
  title: string;
  value: number;
  color: string;
}

export interface ITopVote {
  unit: string;
  count: number;
  perc: number;
  singleUnit: string;
  tie: boolean;
}

export interface IStatResult {
  pie?: ISlice[];
  topVote?: ITopVote;
  error?: string;
}
