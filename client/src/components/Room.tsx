import React, { useEffect, useState } from "react";
import queryString from "query-string";
import M from "materialize-css";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import "./Room.css";
import { Context, ERoomStatus } from "../global/Context";
import { toast } from "react-toastify";
import { VotingCards } from "./VotingCards";
import { Categories } from "./Categories";
import { RoomActions } from "./RoomActions";
import { Users } from "./Users";
import Issues from "./Issues";

export enum EAction {
  add = "add",
  delete = "delete",
  update = "update",
}

export interface ICategory {
  id: string;
  name: string;
  singular: string;
  units: { unit: number }[];
}

export interface IRoom {
  id: string;
  name: string;
  categories: ICategory[];
}

export interface IUser {
  id: string;
  name: string;
  room: string;
}

export interface IAddCardResult {
  room: IRoom | null;
  error: string | null;
}

let socket: SocketIOClient.Socket;

export const Room = (props) => {
  const ENDPOINT = process.env.REACT_APP_ENDPOINT || "localhost:3333";
  const { roomState, roomStatus } = React.useContext(Context);
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

  useEffect(() => {
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

  useEffect(() => {
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

  // // function for sending messages
  // const sendMessage = (event) => {
  //   event.preventDefault();
  //   if (message) {
  //     socket.emit("sendMessage", message, () => set__Message(""));
  //   }
  // };

  const updateCategories = (
    action: EAction,
    categoryId?: string,
    values?: { name: string; singular: string }
  ) => {
    if (roomId) {
      if (action === EAction.add) {
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
              updateCategoryCards={updateCategoryCards}
              updateCategories={updateCategories}
            />
          ) : null}
        </main>

        <aside className="issues-aside">
          <h4>Actions</h4>
          <RoomActions />
          {/* <h4>Issues</h4>
          <Issues /> */}
        </aside>
      </div>
    </div>
  );
};
