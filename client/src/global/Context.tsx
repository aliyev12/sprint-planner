import React from "react";

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

const EMPTY_ROOM_STATE: IRoomState = {
  userName: "",
  roomId: "",
  roomName: "",
};

const Context = React.createContext({
  initRoom: (r: IRoomState): void => {},
  roomState: { ...EMPTY_ROOM_STATE },
  homeStatus: EHomeStatuses.initial,
  changeHomeStatus: (s: string): void => {},
  theme: ETheme.dark,
  set__theme: (t: ETheme): void => {},
  roomStatus: ERoomStatus.initial,
  set__roomStatus: (r: ERoomStatus): void => {},
  editCategoriesValues: null,
  set__editCategoriesValues: (c: IEditCategory | null) => {},
});

const GlopalProvider = ({ children }) => {
  const [roomState, set__roomState] = React.useState({ ...EMPTY_ROOM_STATE });
  const [homeStatus, set__homeStatus] = React.useState(EHomeStatuses.initial);
  const [roomStatus, set__roomStatus] = React.useState(ERoomStatus.initial);
  const [theme, set__theme] = React.useState<ETheme>(ETheme.dark);
  const [
    editCategoriesValues,
    set__editCategoriesValues,
  ] = React.useState<IEditCategory | null>(null);

  const initRoom = (newRoomData: IRoomState): void => {
    set__roomState(newRoomData);
  };

  const changeHomeStatus = (newStatus: EHomeStatuses) => {
    set__homeStatus(newStatus);
  };

  return (
    <Context.Provider
      value={{
        initRoom,
        roomState,
        homeStatus,
        changeHomeStatus,
        theme,
        set__theme,
        roomStatus,
        set__roomStatus,
        editCategoriesValues,
        set__editCategoriesValues,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, GlopalProvider };
