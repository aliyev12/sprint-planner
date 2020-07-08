import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import "./Room.css";
import { Context } from "./Context";
import { toast } from "react-toastify";

let socket: SocketIOClient.Socket;

export const Room = (props) => {
  const ENDPOINT = process.env.REACT_APP_ENDPOINT || "localhost:3333";
  const { roomState } = React.useContext(Context);
  const { location, match } = props;

  const [name, set__Name] = useState("");
  const [room, set__Room] = useState("");

  const [userName, set__userName] = useState("");
  const [roomId, set__roomId] = useState("");
  const [roomName, set__roomName] = useState("");
  const [message, set__Message] = useState("");
  const [messages, set__Messages] = useState([]);
  const [users, set__Users] = useState([]);

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
    socket.on("roomData", ({ users, room }) => {
      set__roomName(room.name);
      set__Users(users);
    });

    return () => {
      socket.off("message");
      socket.off("roomData");
    };
  }, [messages]);

  // function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => set__Message(""));
    }
  };

  return (
    <div className="container">
      <div className="room-grid-container">
        <aside className="users-aside">
          <h2>Users</h2>
          <ul className="collection">
            {users.map((user, i) => {
              return (
                <li className="collection-item avatar" key={user.id}>
                  <i className="material-icons circle">account_circle</i>
                  {/* <img src="images/yuna.jpg" alt="" className="circle" /> */}
                  <span className="title">{user.name}</span>
                  <a href="#!" className="secondary-content">
                    <i className="material-icons">grade</i>
                  </a>
                </li>
              );
            })}
          </ul>
        </aside>

        <main>
          <h1>{roomName}</h1>
        </main>

        <aside className="issues-aside">
          <h2>Issues</h2>
          <div className="collection">
            <a href="#!" className="collection-item black-text">
              Alvin
            </a>
            <a
              href="#!"
              className="collection-item white-text active blue darken-4"
            >
              Alvin
            </a>
            <a href="#!" className="collection-item black-text">
              Alvin
            </a>
            <a href="#!" className="collection-item black-text">
              Alvin
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};
