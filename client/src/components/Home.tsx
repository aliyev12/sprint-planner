import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import uniqid from "uniqid";
import {
  Alert,
  CenteredCard,
  extractRoomId,
  Loader,
  LoaderInline,
  Or,
  WrongRoomAlert,
} from "../common";
import { EHomeStatuses, EUserRole } from "../common/models";
import { Context } from "../global/Context";
import "./Home.css";

export const Home = () => {
  const suggestedRoomName = `Sprint Planning ${new Date().toLocaleDateString()}`;
  const navigate = useNavigate();
  const location = useLocation();
  const {
    initRoom,
    homeStatus,
    changeHomeStatus,
    isConnected,
    isConnecting,
    connectionError,
  } = useContext(Context);

  const [userName, set__userName] = useState("");
  const [roomName, set__roomName] = useState("");
  const [roomIdInput, set__roomIdInput] = useState("");
  const [errorAlert, set__errorAlert] = useState<React.ReactNode>(null);

  const { initial, creatingNewRoom, cameFromJoin, wrongRoomId } = EHomeStatuses;

  useEffect(() => {
    if (homeStatus === wrongRoomId) {
      const locationState = location.state as { triedRoomId?: string } | null;
      const triedRoomId = locationState?.triedRoomId || "";

      set__errorAlert(<WrongRoomAlert roomId={triedRoomId} />);

      const timer = setTimeout(() => {
        set__errorAlert(null);
      }, 1000000); // 1000 seconds (original was 10000 * 100)

      return () => clearTimeout(timer);
    }
  }, [homeStatus, location.state, wrongRoomId]);

  useEffect(() => {
    set__roomName(suggestedRoomName);
  }, [suggestedRoomName]);

  const resetFields = () => {
    set__userName("");
    set__roomName("");
  };

  const handleCreateNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    // example: 2020-07-20-23bhb2h3b
    const newRoomId = `${
      new Date().toISOString().split("T")[0]
    }-${uniqid.time()}`;

    initRoom({
      userName,
      userRole: EUserRole.admin,
      roomId: newRoomId,
      roomName,
    });
    navigate(`/${newRoomId}`);
    resetFields();
  };

  const roomIdValid =
    roomIdInput && /20\d{2}-\d{2}-\d{2}-(.+)/gim.test(roomIdInput);

  const sectionTitle = () => {
    if (homeStatus === creatingNewRoom || homeStatus === cameFromJoin)
      return "Creating New Room";
    return "Choose How To Start";
  };

  return (
    <CenteredCard>
      <div className="Home">
        {homeStatus === wrongRoomId ? errorAlert : null}
        <h4 className="section-title">{sectionTitle()}</h4>
        {homeStatus === initial || homeStatus === wrongRoomId ? (
          <button
            type="button"
            className="waves-effect waves-light btn-large blue darken-4 create-new-room-btn"
            onClick={() => changeHomeStatus(creatingNewRoom)}
            disabled={!isConnected}
          >
            <i className="material-icons left">add</i>create new room
          </button>
        ) : null}

        {homeStatus === creatingNewRoom || homeStatus === cameFromJoin ? (
          <form onSubmit={handleCreateNewRoom}>
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
            <div className="input-field col s12">
              <input
                id="room-name"
                type="text"
                className="validate"
                value={roomName}
                onChange={(e) => set__roomName(e.target.value)}
              />
              <label htmlFor="room-name" className="active">
                Room Name
              </label>
            </div>

            <div className="flex-centered">
              <button
                type="button"
                className="waves-effect waves-light btn-small blue darken-4 back-to-initial-btn"
                onClick={() => {
                  if (homeStatus === cameFromJoin) {
                    navigate(-1); // Equivalent to history.goBack()
                    resetFields();
                  } else {
                    changeHomeStatus(initial);
                    resetFields();
                  }
                }}
              >
                <i className="material-icons left">arrow_back</i>back
              </button>
              <button
                type="submit"
                disabled={!userName || !roomName}
                className="waves-effect waves-light btn-small blue darken-4 ready-to-create-btn"
              >
                <i className="material-icons right">arrow_forward</i>start
                <span role="img" aria-label="rocket">
                  🚀
                </span>
              </button>
            </div>
          </form>
        ) : null}

        {homeStatus === initial ||
        homeStatus === cameFromJoin ||
        homeStatus === wrongRoomId ? (
          <>
            <Or />
            <form
              className="join-container flex-centered"
              onSubmit={(e) => {
                e.preventDefault();
                if (roomIdValid) {
                  navigate(`/${roomIdInput}`);
                }
              }}
            >
              <div className="input-field col s12">
                <input
                  id="existing-room-id"
                  type="text"
                  className="validate"
                  value={roomIdInput}
                  onChange={(e) =>
                    set__roomIdInput(extractRoomId(e.target.value))
                  }
                />
                <label htmlFor="existing-room-id">Room ID</label>
              </div>

              <button
                type="submit"
                disabled={!isConnected || !roomIdValid}
                className="waves-effect waves-light btn-small blue darken-4 join-btn"
              >
                join
              </button>
            </form>
          </>
        ) : null}

        {isConnected && (
          <div className="connected-message">
            <p>
              You are connected!{" "}
              <i className="material-icons right green">check</i>
            </p>
          </div>
        )}
        {isConnecting && (
          <div className="connecting-message">
            <p>Connecting to remote server</p>
            <LoaderInline />
          </div>
        )}
        {connectionError && (
          <div className="connection-error">
            <Alert
              text="Something went wrong while connecting to remote server. Please
              reload the page and try again."
              type="error"
            />

            <button
              type="button"
              className="waves-effect waves-light btn-small blue darken-4"
              onClick={() => window.location.reload()}
            >
              reload
            </button>
          </div>
        )}
      </div>
    </CenteredCard>
  );
};
