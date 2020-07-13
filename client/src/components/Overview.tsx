import React from "react";
import io from "socket.io-client";
import "./Overview.css";
import { Context } from "../global/Context";
import { EHomeStatuses } from "../common/models";

let socket: SocketIOClient.Socket;

export const Overview = ({ match, location, history }) => {
  const ENDPOINT = process.env.REACT_APP_ENDPOINT || "localhost:3333";
  const { changeHomeStatus } = React.useContext(Context);
  const [loading, set__loading] = React.useState(false);
  const [roomId, set__roomId] = React.useState("");

  React.useEffect(() => {
    set__loading(true);
    let roomIdParam: string | undefined;
    if (match && match.params && match.params.roomId)
      roomIdParam = match.params.roomId;

    if (roomIdParam) {
      // validate roomId
      socket = io(ENDPOINT);

      socket.emit(
        "validateRoomExists",
        { roomId: roomIdParam },
        ({ roomExists, roomData }) => {
          if (roomExists) {
            set__roomId(roomIdParam);
            console.log("roomData = ", roomData);
          } else {
            changeHomeStatus(EHomeStatuses.wrongRoomId);
            history.push({
              pathname: "/",
              state: { triedRoomId: roomIdParam },
            });
          }
        }
      );
    }
    set__loading(false);

    return () => socket.off("validateRoomExists");
  }, [ENDPOINT, location.pathname]);

  return <div>Overview</div>;
};
