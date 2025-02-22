import { createContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useMachine } from "@xstate/react";
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
import { roomMachine } from "../stateMachines";

// Define context type
interface ContextType {
  socket: Socket | null;
  status: any; // Replace with actual XState type when available
  send: any; // Replace with actual XState type when available
  service: any; // Replace with actual XState type when available
  currentUser: IUser | null;
  set__currentUser: (u: IUser) => void;
  initRoom: (r: IRoomState) => void;
  roomState: IRoomState;
  homeStatus: EHomeStatuses;
  changeHomeStatus: (s: EHomeStatuses) => void;
  theme: ETheme;
  set__theme: (t: ETheme) => void;
  roomStatus: ERoomStatus;
  set__roomStatus: (r: ERoomStatus) => void;
  editCategoriesValues: IEditCategory | null;
  set__editCategoriesValues: (c: IEditCategory | null) => void;
  currentSession: ICurrentSession;
  set__currentSession: (c: ICurrentSession) => void;
  currentCategoryId: string;
  set__currentCategoryId: (c: string) => void;
}

// Define props interface for GlobalProvider
interface GlobalProviderProps {
  children: ReactNode;
}

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

// Create default context
const Context = createContext<ContextType>({
  socket: null,
  status: null,
  send: null,
  service: null,
  currentUser: null,
  set__currentUser: () => {},
  initRoom: () => {},
  roomState: { ...EMPTY_ROOM_STATE },
  homeStatus: EHomeStatuses.initial,
  changeHomeStatus: () => {},
  theme: ETheme.dark,
  set__theme: () => {},
  roomStatus: ERoomStatus.initial,
  set__roomStatus: () => {},
  editCategoriesValues: null,
  set__editCategoriesValues: () => {},
  currentSession: EMPTY_CURRENT_SESSION,
  set__currentSession: () => {},
  currentCategoryId: "",
  set__currentCategoryId: () => {},
});

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const ENDPOINT = getEndpoint() || "localhost:3333";
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, send, service] = useMachine(roomMachine);

  const [currentUser, set__currentUser] = useState<IUser | null>(null);
  const [roomState, set__roomState] = useState<IRoomState>({
    ...EMPTY_ROOM_STATE,
  });
  const [homeStatus, set__homeStatus] = useState<EHomeStatuses>(
    EHomeStatuses.initial
  );
  const [roomStatus, set__roomStatus] = useState<ERoomStatus>(
    ERoomStatus.initial
  );
  const [theme, set__theme] = useState<ETheme>(ETheme.dark);
  const [currentCategoryId, set__currentCategoryId] = useState<string>("");
  const [editCategoriesValues, set__editCategoriesValues] =
    useState<IEditCategory | null>(null);
  const [currentSession, set__currentSession] = useState<ICurrentSession>(
    EMPTY_CURRENT_SESSION
  );

  useEffect(() => {
    // Connect to socket.io server
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [ENDPOINT]);

  const initRoom = (newRoomData: IRoomState): void => {
    set__roomState(newRoomData);
  };

  const changeHomeStatus = (newStatus: EHomeStatuses): void => {
    set__homeStatus(newStatus);
  };

  return (
    <Context.Provider
      value={{
        socket,
        status,
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

export { Context, GlobalProvider };
