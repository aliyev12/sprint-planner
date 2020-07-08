import React from "react";

export enum HomeStatuses {
  initial = "initial",
  creatingNewRoom = "creating-new-room",
  cameFromJoin = "came-from-join",
  wrongRoomId = "wrong-room-id",
}

export interface IRoomState {
  userName: string;
  roomId: string;
  roomName?: string;
}

const EMPTY_ROOM_STATE: IRoomState = {
  userName: "",
  roomId: "",
  roomName: "",
};

const Context = React.createContext({
  initRoom: (r: IRoomState): void => {},
  roomState: { ...EMPTY_ROOM_STATE },
  homeStatus: "initial",
  changeHomeStatus: (s: string): void => {},
});

const GlopalProvider = ({ children }) => {
  const [roomState, set__roomState] = React.useState({ ...EMPTY_ROOM_STATE });
  const [homeStatus, set__homeStatus] = React.useState("initial");

  const initRoom = (newRoomData: IRoomState): void => {
    set__roomState(newRoomData);
  };

  const changeHomeStatus = (newStatus: string) => {
    console.log("newStatus = ", newStatus);
    set__homeStatus(newStatus);
  };

  return (
    <Context.Provider
      value={{
        initRoom,
        roomState,
        homeStatus,
        changeHomeStatus,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, GlopalProvider };
