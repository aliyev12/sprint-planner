export enum EAction {
  add = "add",
  delete = "delete",
  update = "update",
  start = "start",
  end = "end",
  save = "save",
  vote = "vote",
  reset = "reset",
  updateStatus = "updateStatus",
}

export enum EUserRole {
  regularUser = "regularUser",
  admin = "admin",
}

export interface IUser {
  id: string;
  name: string;
  role: EUserRole;
  room: string;
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

export enum ERoomStatus {
  initial = "initial",
  edit = "edit",
}

export interface IRoom {
  id: string;
  name: string;
  categories: ICategory[];
  currentSession: ICurrentSession;
  issues: IIsue[];
  status: ERoomStatus;
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
  status?: ERoomStatus;
}

export interface IHandleSessionArgs {
  roomId: string;
  action: EAction;
  categoryId?: string;
  vote?: IVote;
}

export interface IAddRoomProps {
  id: string;
  name: string;
}
