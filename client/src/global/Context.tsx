import React from "react";
import io from "socket.io-client";
import {
  EHomeStatuses,
  ERoomStatus,
  ETheme,
  IEditCategory,
  IRoomState,
  ICurrentSession,
  IUser,
  EUserRole,
} from "../common/models";
import { getEndpoint } from "../common";
import { useMachine } from "@xstate/react";
import { roomMachine } from "../stateMachines";

let socket: SocketIOClient.Socket;

const EMPTY_ROOM_STATE: IRoomState = {
  userName: "",
  userRole: EUserRole.regularUser,
  roomId: "",
  roomName: "",
};

const EMPTY_CURRENT_SESSION: ICurrentSession = {
  active: false,
  activeCategoryId: "",
  session: null,
};

const Context = React.createContext({
  socket: undefined,
  state: null,
  send: null,
  service: null,
  currentUser: null,
  set__currentUser: (u: IUser) => {},
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
  currentSession: EMPTY_CURRENT_SESSION,
  set__currentSession: (c: ICurrentSession) => {},
  currentCategoryId: "",
  set__currentCategoryId: (c: string) => {},
});

const GlopalProvider = ({ children }) => {
  const ENDPOINT = getEndpoint() || "localhost:3333";

  const [state, send, service] = useMachine(roomMachine);

  const [currentUser, set__currentUser] = React.useState<IUser | null>(null);
  const [roomState, set__roomState] = React.useState({ ...EMPTY_ROOM_STATE });
  const [homeStatus, set__homeStatus] = React.useState(EHomeStatuses.initial);
  const [roomStatus, set__roomStatus] = React.useState(ERoomStatus.initial);
  const [theme, set__theme] = React.useState<ETheme>(ETheme.dark);
  const [currentCategoryId, set__currentCategoryId] = React.useState("");
  const [
    editCategoriesValues,
    set__editCategoriesValues,
  ] = React.useState<IEditCategory | null>(null);
  const [currentSession, set__currentSession] = React.useState<ICurrentSession>(
    EMPTY_CURRENT_SESSION
  );

  React.useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.disconnect();
      socket.emit("disconnect");
    };
  }, []);

  const initRoom = (newRoomData: IRoomState): void => {
    set__roomState(newRoomData);
  };

  const changeHomeStatus = (newStatus: EHomeStatuses) => {
    set__homeStatus(newStatus);
  };

  return (
    <Context.Provider
      value={{
        socket,
        state,
        send,
        service,
        currentUser,
        set__currentUser,
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
        currentSession,
        set__currentSession,
        currentCategoryId,
        set__currentCategoryId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, GlopalProvider };
