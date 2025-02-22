import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  CenteredCard,
  Loader,
  Or,
  useSocketConnection,
} from "../common";
import { EHomeStatuses, EUserRole } from "../common/models";
import { Context } from "../global/Context";
import "./Join.css";

export const Join = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { initRoom, changeHomeStatus } = useContext(Context);
  const [userName, set__userName] = useState("");
  const [roomId, set__roomId] = useState("");
  const [loading, set__loading] = useState(false);
  const [capacity, set__capacity] = useState<{
    max: boolean;
    error: string | null;
  }>({
    max: false,
    error: null,
  });

  const { socket, isConnecting, connectionError } = useSocketConnection({
    onError: (error) => {
      set__loading(false);
      throw new Error(`Socket connection error: ${error}`);
    },
  });

  useEffect(() => {
    set__loading(true);
    let roomIdParam: string | undefined = params.roomId;

    if (socket && roomIdParam) {
      // validate roomId
      // const socket = io(ENDPOINT);

      socket.emit(
        "validateRoomExists",
        { roomId: roomIdParam },
        ({
          roomExists,
          maxCapacity,
          error,
        }: {
          roomExists: boolean;
          maxCapacity?: boolean;
          error?: string;
        }) => {
          if (maxCapacity)
            return set__capacity({
              max: true,
              error,
            });

          if (roomExists) {
            set__roomId(roomIdParam as string);
          } else {
            changeHomeStatus(EHomeStatuses.wrongRoomId);
            navigate("/", {
              state: { triedRoomId: roomIdParam },
            });
          }

          set__loading(false);
        }
      );

      return () => {
        socket.off("validateRoomExists");
        socket.disconnect();
      };
    } else {
      set__loading(false);
    }
  }, [socket, params.roomId]);
  // }, [ENDPOINT, location.pathname, params.roomId, navigate, changeHomeStatus]);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId) {
      initRoom({
        userName,
        userRole: EUserRole.regularUser,
        roomId,
        roomName: "", // Add empty roomName to satisfy the interface
      });
      navigate(`/${roomId}`);
      set__userName("");
    }
  };

  if (loading || isConnecting) return <Loader />;

  if (connectionError) {
    throw new Error(
      "Having trouble connecting to the server. Please try again."
    );
  }

  if (capacity.max)
    return (
      <CenteredCard>
        <Alert
          text={capacity.error || "Room is at maximum capacity"}
          type="warning"
        />
      </CenteredCard>
    );

  if (!roomId && !loading) {
    console.error(`Room ID ${roomId} is not valid`);
    return null;
  }

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
          className="waves-effect waves-light btn-small blue darken-4"
          onClick={() => {
            changeHomeStatus(EHomeStatuses.cameFromJoin);
            navigate("/");
          }}
        >
          <i className="material-icons left">add</i>create new room
        </button>
      </form>
    </CenteredCard>
  );
};
