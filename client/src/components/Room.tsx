import React, { useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { useMachine } from "@xstate/react";
import {
  ERoomStatus,
  ERoomEvents,
  IResult,
  IValues,
  EUserRole,
} from "../common/models";
import { EAction, IRoom, IUser, IUpCatArgs } from "../common/models";
import { Context } from "../global/Context";
import { Categories } from "./Categories";
import { RoomActions } from "./RoomActions";
import { Users } from "./Users";
import { onMessase } from "../common/sockets";
import { triggedDomEvent, getEndpoint } from "../common/utils";
import { Stats } from "./Stats";
import { roomMachine } from "../stateMachines";
import "./Room.css";
import { votesExist } from "../common/categoriesHelpers";

// let socket: SocketIOClient.Socket;

export const Room = ({ location, match, history }) => {
  const ENDPOINT = getEndpoint() || "localhost:3333";

  const {
    socket,
    // state,
    // send,
    // service,
    currentUser,
    currentCategoryId,
    currentSession,
    set__currentUser,
    roomState,
    set__currentSession,
    set__currentCategoryId,
  } = React.useContext(Context);

  const roomMachineData = useMachine(roomMachine);
  const [state, send, service] = roomMachineData;

  service.onTransition((state) => {
    if (state.changed) {
      console.log("state.value = ", state.value);
    }
  });

  const [userName, set__userName] = useState("");
  const [roomData, set__roomData] = useState<IRoom | undefined>();
  const [roomId, set__roomId] = useState("");
  const [roomName, set__roomName] = useState("");
  // const [messages, set__Messages] = useState([]);
  const [users, set__Users] = useState<IUser[]>([]);

  service.onTransition((state, ctx) => {
    if (state.changed) {
      // console.log(state.value);
      // console.log("context = ", state.context);
    }
    // if (state.matches("broken")) {
    //   console.log("i'm broke");
    // }
  });

  const {
    initial,
    editingCards,
    editingCategories,
    viewingStats,
  } = ERoomStatus;
  const { EDIT_CARDS, EDIT_CATEGORIES, VIEW_STATS, DONE } = ERoomEvents;

  React.useEffect(() => {
    let roomIdParam: string | undefined,
      _userName: string | undefined,
      _userRole: EUserRole,
      _roomName = "unknown";
    if (match.params.roomId) roomIdParam = match.params.roomId;
    if (roomState.userName) _userName = roomState.userName;
    if (roomState.userRole) _userRole = roomState.userRole;
    if (roomState.roomName) _roomName = roomState.roomName;

    if (roomIdParam && _userName && _userRole) {
      // socket = io(ENDPOINT);

      set__userName(_userName);
      set__roomId(roomIdParam);
      set__roomName(_roomName);

      socket.emit(
        "join",
        {
          userName: _userName,
          userRole: _userRole,
          roomId: roomIdParam,
          roomName: _roomName,
        },
        (res: { user?: IUser; error?: string }) => {
          // console.log("res = ", res);
          if (res.error) toast.error(res.error);
          if (res.user) set__currentUser(res.user);
        }
      );
    }

    return () => socket.off("join");
  }, [location.pathname]);

  React.useEffect(() => {
    onMessase(socket);

    socket.on("roomData", (result: { users: IUser[]; room: IRoom }) => {
      if (result.users) set__Users(result.users);
      // console.log("roomData result = ", result);
      console.log("roomData room = ", result.room);
      if (result.room && result.room.currentSession && result.room.name) {
        const { active, session } = result.room.currentSession;
        send({ type: "ROOM_DATA_CHANGE", roomData: result });
        if (active && votesExist(result.room.currentSession)) {
          send("VOTE");
        }
        if (active && !votesExist(result.room.currentSession)) {
          send("UNVOTE");
        }
        if (!active && session) {
          send("SESSION");
        }
      }

      set__currentSession(result.room.currentSession);
      set__roomData(result.room);
      set__roomName(result.room.name);

      if (result.room.currentSession.activeCategoryId) {
        set__currentCategoryId(result.room.currentSession.activeCategoryId);
        triggedDomEvent();
      }
    });

    return () => {
      socket.off("message");
      socket.off("roomData");
    };
  }, []);
  // }, [messages]);

  const updateCategories = (
    action: EAction,
    categoryId?: string,
    values?: IValues
  ) => {
    if (roomId) {
      const args: IUpCatArgs = { roomId, action };
      if (action !== EAction.add && categoryId && values) {
        args.categoryId = categoryId;
        args.values = values;
      }
      socket.emit("updateCategories", args, (res: IResult) => {
        if (res.error) return toast.error(res.error);
        if (action === EAction.add) {
          const lastCat = res.room.categories[res.room.categories.length - 1];
          if (!lastCat.name && !lastCat.singular) {
            set__currentCategoryId(lastCat.id);
          }
        }
      });
    }
  };

  const updateCategoryCards = (
    categoryId: string,
    unit: number,
    action: EAction
  ) => {
    if (roomId) {
      socket.emit(
        "updateCategoryCards",
        {
          roomId,
          categoryId,
          unit,
          action,
        },
        (res: IResult) => {
          if (res.error) toast.error(res.error);
        }
      );
    }
  };

  const categoriesTitle = () => {
    // console.log("roomData = ", roomData);
    // console.log("currentCategoryId = ", currentCategoryId);
    if (currentSession.active && currentSession.activeCategoryId) {
      const currentCategory = roomData.categories.find(
        (c) => c.id === currentSession.activeCategoryId
      );
      return (
        <h4 className="active-category">
          Voting is currently in session for: {currentCategory.name}
        </h4>
      );
    } else if (state.matches(editingCategories)) {
      return <h4>Categories</h4>;
    } else if (state.matches(viewingStats)) {
      return <h4>Voting Results</h4>;
    } else if (state.matches(editingCards)) {
      const foundCat = roomData.categories.find(
        (c) => c.id === currentCategoryId
      );
      return <h4>Edit cards for: {foundCat.name}</h4>;
    } else {
      return <h4>Current Category</h4>;
    }
  };

  if (!currentUser || !roomData || !roomData.categories || !users) return null;

  return (
    <div className="Room container">
      <div className="room-grid-container">
        <section className="room-name">
          <h1>{roomName}</h1>
        </section>
        <aside className="users-aside">
          <h4>Users</h4>
          <Users users={users} />
        </aside>

        <main>
          {categoriesTitle()}
          {state.matches(viewingStats) ? (
            <Stats roomData={roomData} />
          ) : (
            <Categories
              categories={roomData.categories}
              currentSession={roomData.currentSession}
              updateCategoryCards={updateCategoryCards}
              updateCategories={updateCategories}
              roomMachineData={roomMachineData}
            />
          )}
        </main>

        <aside className="issues-aside">
          <h4>Actions</h4>
          <RoomActions roomData={roomData} roomMachineData={roomMachineData} />
          {/* <h4>Issues</h4>
          <Issues /> */}
        </aside>
      </div>
    </div>
  );
};
