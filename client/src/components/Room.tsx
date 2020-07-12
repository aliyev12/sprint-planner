import React, { useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";
import {
  EAction,
  ERoomStatus,
  IAddCardResult,
  IRoom,
  IUser,
} from "../common/models";
import { Context } from "../global/Context";
import { Categories } from "./Categories";
import "./Room.css";
import { RoomActions } from "./RoomActions";
import { Users } from "./Users";

let socket: SocketIOClient.Socket;

export const Room = (props) => {
  const ENDPOINT = process.env.REACT_APP_ENDPOINT || "localhost:3333";
  const { roomState, roomStatus, set__currentSession } = React.useContext(
    Context
  );

  const { location, match } = props;

  const [name, set__Name] = useState("");
  const [room, set__Room] = useState("");

  const [userName, set__userName] = useState("");
  const [roomData, set__roomData] = useState<IRoom | undefined>();
  const [roomId, set__roomId] = useState("");
  const [roomName, set__roomName] = useState("");
  const [message, set__Message] = useState("");
  const [messages, set__Messages] = useState([]);
  const [users, set__Users] = useState<IUser[]>([]);

  React.useEffect(() => {
    let roomIdParam: string | undefined,
      _userName: string | undefined,
      _roomName = "unknown";
    if (match.params.roomId) roomIdParam = match.params.roomId;
    if (roomState.userName) _userName = roomState.userName;
    if (roomState.roomName) _roomName = roomState.roomName;

    socket = io(ENDPOINT);

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

    return () => {
      socket.emit("disconnect");
      socket.off("join");
    };
  }, [ENDPOINT, location.pathname]);

  React.useEffect(() => {
    socket.on("message", (message) => {
      toast.success(
        <span>
          <strong style={{ fontWeight: 800, color: "#0e47a1" }}>
            {message.user}:{" "}
          </strong>
          {message.text}
        </span>
      );
      set__Messages([...messages, message]);
    });

    socket.on(
      "roomData",
      ({ users, room }: { users: IUser[]; room: IRoom }) => {
        console.log("room = ", room);
        set__currentSession(room.currentSession);
        set__roomData(room);
        set__roomName(room.name);
        set__Users(users);
      }
    );

    return () => {
      socket.off("message");
      socket.off("roomData");
    };
  }, [messages]);

  const updateCategories = (
    action: EAction,
    categoryId?: string,
    values?: { name: string; singular: string }
  ) => {
    if (roomId) {
      if (action === EAction.add) {
        console.log("socket from room = ", socket);
        socket.emit(
          "updateCategories",
          {
            roomId,
            action,
          },
          (updateCategoriesResult: any) => {
            if (updateCategoriesResult.error) {
              toast.error(updateCategoriesResult.error);
            }
          }
        );
      } else {
        socket.emit(
          "updateCategories",
          {
            roomId,
            action,
            categoryId,
            values,
          },
          (updateCategoriesResult: any) => {
            if (updateCategoriesResult.error) {
              toast.error(updateCategoriesResult.error);
            }
          }
        );
      }
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
        (updateCardResult: IAddCardResult) => {
          if (updateCardResult.error) {
            toast.error(updateCardResult.error);
          }
        }
      );
    }
  };

  if (!roomData) return null;

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
