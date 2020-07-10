import React from "react";
import io from "socket.io-client";
import { CenteredCard, Or, Loader } from "../common";
import { Context, EHomeStatuses } from "../global/Context";
import "./Join.css";

let socket: SocketIOClient.Socket;

export const Join = ({ location, match, history }) => {
  const ENDPOINT = process.env.REACT_APP_ENDPOINT || "localhost:3333";
  const { initRoom, changeHomeStatus } = React.useContext(Context);
  const [userName, set__userName] = React.useState("");
  const [roomId, set__roomId] = React.useState("");
  const [loading, set__loading] = React.useState(false);

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
        ({ roomExists }) => {
          if (roomExists) {
            set__roomId(roomIdParam);
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
  }, [location.pathname]);

  const handleJoinRoom = () => {
    if (roomId) {
      initRoom({ userName, roomId });
      history.push(`/${roomId}`);
      set__userName("");
    }
  };

  if (loading) return <Loader />;

  if (!roomId && !loading) return null;

  return (
    <CenteredCard>
      <div className="Join flex-centered">
        <div className="input-field col s12">
          <input
            id="user-name"
            type="text"
            className="validate"
            value={userName}
            onChange={(e) => set__userName(e.target.value)}
          />
          <label htmlFor="user-name">Your Name</label>
        </div>
        <button
          className="waves-effect waves-light btn-large blue darken-4 join-room-btn"
          onClick={handleJoinRoom}
        >
          <i className="material-icons right">arrow_forward</i>join
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </button>
        <Or text="create a new room:" />
        <button
          className="waves-effect waves-light btn-small blue darken-4 "
          onClick={() => {
            changeHomeStatus(EHomeStatuses.cameFromJoin);
            history.push("/");
          }}
        >
          <i className="material-icons left">add</i>create new room
        </button>
      </div>
    </CenteredCard>
  );
};
