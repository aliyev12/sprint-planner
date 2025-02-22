import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, CenteredCard, Loader, useSocketConnection } from "../common";
import { EHomeStatuses } from "../common/models";
import { Context } from "../global/Context";
import "./Overview.css";

interface RoomValidationResponse {
  roomExists: boolean;
  roomData?: any; // Replace with proper room data type
  error?: string;
}

export const Overview = () => {
  // const ENDPOINT = getEndpoint() || "localhost:3333";
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { changeHomeStatus } = useContext(Context);
  const [loading, set__loading] = useState(false);
  const [roomId, set__roomId] = useState("");
  const [roomData, set__roomData] = useState<any>(null); // Replace with proper room data type

  const { socket, isConnecting, connectionError } = useSocketConnection({
    onError: (error) => {
      console.error("Socket connection error:", error);
    },
  });

  useEffect(() => {
    set__loading(true);
    const roomIdParam = params.roomId;

    if (socket && roomIdParam) {
      // validate roomId
      // const socket: Socket = io(ENDPOINT);

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
  }, [socket, params.roomId]);
  // }, [ENDPOINT, location.pathname, params.roomId, navigate, changeHomeStatus]);

  if (loading || isConnecting) return <Loader />;

  if (connectionError) {
    return (
      <CenteredCard>
        <Alert
          text="Having trouble connecting to the server. Please try again."
          type="error"
        />
      </CenteredCard>
    );
  }

  // You can expand this component with the actual overview UI
  return (
    <CenteredCard>
      <div className="Overview">
        <Alert
          text="Thank you for visiting the room overview page! This page is currently under development. Please check back later for updates."
          type="info"
        />
      </div>
    </CenteredCard>
  );
};
