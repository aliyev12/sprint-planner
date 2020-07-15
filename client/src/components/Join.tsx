import React from "react";
import io from "socket.io-client";
import { CenteredCard, Loader, Or, getEndpoint } from "../common";
import { EHomeStatuses } from "../common/models";
import { Context } from "../global/Context";
import "./Join.css";

let socket: SocketIOClient.Socket;

export const Join = ({ location, match, history }) => {
  const ENDPOINT = getEndpoint() || "localhost:3333";
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

    return () => socket.off("validateRoomExists");
  }, [ENDPOINT, location.pathname]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
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
      <form className="Join flex-centered" onSubmit={handleJoinRoom}>
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
          disabled={!userName}
          type="submit"
          className="waves-effect waves-light btn-large blue darken-4 join-room-btn"
        >
          <i className="material-icons right">arrow_forward</i>join
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </button>
        <Or text="create a new room:" />
        <button
          type="button"
          className="waves-effect waves-light btn-small blue darken-4 "
          onClick={() => {
            changeHomeStatus(EHomeStatuses.cameFromJoin);
            history.push("/");
          }}
        >
          <i className="material-icons left">add</i>create new room
        </button>
      </form>
    </CenteredCard>
  );
};
