import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "./Overview.css";
import { Context } from "../global/Context";
import { EHomeStatuses } from "../common/models";
import { getEndpoint } from "../common";

interface RoomValidationResponse {
  roomExists: boolean;
  roomData?: any; // Replace with proper room data type
  error?: string;
}

export const Overview = () => {
  const ENDPOINT = getEndpoint() || "localhost:3333";
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { changeHomeStatus } = useContext(Context);
  const [loading, set__loading] = useState(false);
  const [roomId, set__roomId] = useState("");
  const [roomData, set__roomData] = useState<any>(null); // Replace with proper room data type

  useEffect(() => {
    set__loading(true);
    const roomIdParam = params.roomId;

    if (roomIdParam) {
      // validate roomId
      const socket: Socket = io(ENDPOINT);

      socket.emit(
        "validateRoomExists",
        { roomId: roomIdParam },
        (response: RoomValidationResponse) => {
          const { roomExists, roomData, error } = response;

          if (roomExists) {
            set__roomId(roomIdParam);
            set__roomData(roomData);
            console.log("roomData = ", roomData);
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
  }, [ENDPOINT, location.pathname, params.roomId, navigate, changeHomeStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // You can expand this component with the actual overview UI
  return (
    <div className="Overview">
      <h2>Room Overview</h2>
      {roomData ? (
        <div className="room-data-overview">
          {/* Display room data here */}
          <p>Room ID: {roomId}</p>
          {/* Add other room data display elements */}
        </div>
      ) : (
        <p>No room data available</p>
      )}
    </div>
  );
};
