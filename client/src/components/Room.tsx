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

export const Room = ({ location, match }) => {
  const {
    socket,
    roomState,
    roomStatus,
    set__currentSession,
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
        (error) => {
          if (error) alert(error);
        }
      );
    }

    return () => socket.off("join");
  }, [location.pathname]);

  React.useEffect(() => {
    onMessase(socket);

    socket.on("roomData", (result: { users: IUser[]; room: IRoom }) => {
      if (result.users) set__Users(result.users);
      if (result.room && result.room.currentSession && result.room.name) {
        set__currentSession(result.room.currentSession);
        set__roomData(result.room);
        set__roomName(result.room.name);
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

  if (!roomData || !users) return null;

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
          <h4>
            {roomStatus === ERoomStatus.editingCategories
              ? "Categories"
              : "Current Category"}
          </h4>

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
