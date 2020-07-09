import React from "react";

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
});

const GlopalProvider = ({ children }) => {
  const [roomState, set__roomState] = React.useState({ ...EMPTY_ROOM_STATE });

  const initRoom = (newRoomData: IRoomState): void => {
    set__roomState(newRoomData);
  };

  return (
    <Context.Provider
      value={{
        initRoom,
        roomState,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, GlopalProvider };
