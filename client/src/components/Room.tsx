import React, { useState } from "react";
import { toast } from "react-toastify";
import { ERoomStatus, IResult, IValues } from "../common/models";
import { EAction, IRoom, IUser, IUpCatArgs } from "../common/models";
import { Context } from "../global/Context";
import { Categories } from "./Categories";
import { RoomActions } from "./RoomActions";
import { Users } from "./Users";
import { onMessase } from "../common/sockets";
import "./Room.css";
import { triggedDomEvent } from "../common/utils";

export const Room = ({ location, match }) => {
  const {
    socket,
    currentUser,
    currentCategoryId,
    currentSession,
    set__currentUser,
    roomState,
    roomStatus,
    set__currentSession,
    set__currentCategoryId,
  } = React.useContext(Context);

  const [userName, set__userName] = useState("");
  const [roomData, set__roomData] = useState<IRoom | undefined>();
  const [roomId, set__roomId] = useState("");
  const [roomName, set__roomName] = useState("");
  // const [messages, set__Messages] = useState([]);
  const [users, set__Users] = useState<IUser[]>([]);

  React.useEffect(() => {
    let roomIdParam: string | undefined,
      _userName: string | undefined,
      _roomName = "unknown";
    if (match.params.roomId) roomIdParam = match.params.roomId;
    if (roomState.userName) _userName = roomState.userName;
    if (roomState.roomName) _roomName = roomState.roomName;

    if (roomIdParam && _userName) {
      set__userName(_userName);
      set__roomId(roomIdParam);
      set__roomName(_roomName);

      socket.emit(
        "join",
        { userName: _userName, roomId: roomIdParam, roomName: _roomName },
        (res: { user?: IUser; error?: string }) => {
          console.log("res = ", res);
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
      console.log("roomData result = ", result);
      if (result.room && result.room.currentSession && result.room.name) {
        set__currentSession(result.room.currentSession);
        set__roomData(result.room);
        set__roomName(result.room.name);

        if (result.room.currentSession.activeCategoryId) {
          set__currentCategoryId(result.room.currentSession.activeCategoryId);
          triggedDomEvent();
        }
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
        if (res.error) toast.error(res.error);
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
    console.log("roomData = ", roomData);
    console.log("currentCategoryId = ", currentCategoryId);
    if (currentSession.active && currentSession.activeCategoryId) {
      const currentCategory = roomData.categories.find(
        (c) => c.id === currentSession.activeCategoryId
      );
      return (
        <h4 className="active-category">
          Voting is currently in session for: {currentCategory.name}
        </h4>
      );
    } else if (roomStatus === ERoomStatus.editingCategories) {
      return <h4>Categories</h4>;
    } else {
      return <h4>Current Category</h4>;
    }
  };

  if (!currentUser || !roomData || !users) return null;

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

          {roomData && roomData.categories ? (
            <Categories
              categories={roomData.categories}
              currentSession={roomData.currentSession}
              updateCategoryCards={updateCategoryCards}
              updateCategories={updateCategories}
            />
          ) : null}
        </main>

        <aside className="issues-aside">
          <h4>Actions</h4>
          <RoomActions roomData={roomData} />
          {/* <h4>Issues</h4>
          <Issues /> */}
        </aside>
      </div>
    </div>
  );
};
