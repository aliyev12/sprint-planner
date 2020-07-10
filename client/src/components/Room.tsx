import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import "./Room.css";
import { Context } from "../global/Context";
import { toast } from "react-toastify";
import { VotingCards } from "./VotingCards";
import { Categories } from "./Categories";
import { RoomActions } from "./RoomActions";
import { Users } from "./Users";
import Issues from "./Issues";

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

let socket: SocketIOClient.Socket;

export const Room = (props) => {
  const ENDPOINT = process.env.REACT_APP_ENDPOINT || "localhost:3333";
  const { roomState } = React.useContext(Context);
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
    console.log("roomData = ", roomData);

    // Next, build a dropdown of categories, and make each votingcards component belong to whichever category is active 🤓
  }, [roomData]);

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
      console.log(message);
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
        console.log("#### room = ", room);
        console.log("#### users = ", users);
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

  const handleNewCard = (categoryId: string, unit: number) => {
    console.log("in handleNewCard ... ");
    if (roomId) {
      socket.emit(
        "addNewCard",
        {
          roomId,
          categoryId,
          unit,
        },
        (updatedRooms) => {
          console.log("updatedRooms = ", updatedRooms);
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
          <h4>Current Category</h4>
          {roomData && roomData.categories ? (
            <Categories
              categories={roomData.categories}
              handleNewCard={handleNewCard}
            />
          ) : null}
        </main>

        <aside className="issues-aside">
          <h4>Actions</h4>
          <RoomActions />
          <h4>Issues</h4>
          <Issues />
        </aside>
      </div>
    </div>
  );
};
