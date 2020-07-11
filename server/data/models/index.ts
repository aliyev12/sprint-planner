export enum EAction {
  add = "add",
  delete = "delete",
  update = "update",
  start = "start",
  end = "end",
  save = "save",
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
