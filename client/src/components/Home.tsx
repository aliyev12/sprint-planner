import React from "react";
import uniqid from "uniqid";
import { CenteredCard, Or, Alert, WrongRoomAlert } from "../common";
import { Context } from "../global/Context";
import {
  EAction,
  ICategory,
  IVote,
  ISessionCategory,
  ISession,
  IIsue,
  IRoom,
  IUser,
  IAddCardResult,
  EHomeStatuses,
} from "../common/models";
import "./Home.css";

export const Home = ({ history, location }) => {
  const { initRoom, homeStatus, changeHomeStatus } = React.useContext(Context);
  const [userName, set__userName] = React.useState("");
  const [roomName, set__roomName] = React.useState("");
  const [roomIdInput, set__roomIdInput] = React.useState("");
  const [errorAlert, set__errorAlert] = React.useState(null);
  const { initial, creatingNewRoom, cameFromJoin, wrongRoomId } = EHomeStatuses;

  React.useEffect(() => {
    if (homeStatus === wrongRoomId) {
      let triedRoomId = "";
      if (location.state && location.state.triedRoomId)
        triedRoomId = location.state.triedRoomId;
      set__errorAlert(<WrongRoomAlert roomId={triedRoomId} />);
      setTimeout(() => {
        set__errorAlert(null);
      }, 10000);
    }
  }, [homeStatus]);

  const resetFields = () => {
    set__userName("");
    set__roomName("");
  };

  const handleCreateNewRoom = () => {
    // example: 2020-07-20-23bhb2h3b
    const newRoomId = `${
      new Date().toISOString().split("T")[0]
    }-${uniqid.time()}`;

    initRoom({ userName, roomId: newRoomId, roomName });
    history.push(`/${newRoomId}`);
    resetFields();
  };

  const suggestedRoomName = `Sprint Planning ${new Date().toLocaleDateString()}`;
  const roomIdValid =
    roomIdInput && /^20\d{2}-\d{2}-\d{2}-(.+)/gim.test(roomIdInput);

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
            className="waves-effect waves-light btn-large blue darken-4 create-new-room-btn"
            onClick={() => changeHomeStatus(creatingNewRoom)}
          >
            <i className="material-icons left">add</i>create new room
          </button>
        ) : null}

        {homeStatus === creatingNewRoom || homeStatus === cameFromJoin ? (
          <>
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
              <label htmlFor="room-name">Room Name</label>
            </div>
            <div className="suggestion flex-centered">
              <div className="suggestion-text">
                Suggested room name: (click to apply)
              </div>
              <button
                className="waves-effect waves-teal btn-small btn-flat suggestion-btn"
                onClick={() => {
                  const roomNameInput = document.getElementById("room-name");
                  if (roomNameInput) roomNameInput.focus();
                  set__roomName(suggestedRoomName);
                }}
              >
                {suggestedRoomName}
              </button>
            </div>

            <div className="flex-centered">
              <button
                className="waves-effect waves-light btn-small blue darken-4 back-to-initial-btn"
                onClick={() => {
                  if (homeStatus === cameFromJoin) {
                    history.goBack();
                    resetFields();
                  } else {
                    changeHomeStatus("initial");
                    resetFields();
                  }
                }}
              >
                <i className="material-icons left">arrow_back</i>back
              </button>
              <button
                disabled={!userName || !roomName}
                className="waves-effect waves-light btn-small blue darken-4 ready-to-create-btn"
                onClick={handleCreateNewRoom}
              >
                <i className="material-icons right">arrow_forward</i>start
                <span role="img" aria-label="rocket">
                  🚀
                </span>
              </button>
            </div>
          </>
        ) : null}

        {homeStatus === initial ||
        homeStatus === cameFromJoin ||
        homeStatus === wrongRoomId ? (
          <>
            <Or />
            <div className="join-container flex-centered">
              <div className="input-field  col s12">
                <input
                  id="existing-room-id"
                  type="text"
                  className="validate"
                  value={roomIdInput}
                  onChange={(e) => set__roomIdInput(e.target.value)}
                />
                <label htmlFor="existing-room-id">Room ID</label>
              </div>

              <button
                disabled={!roomIdValid}
                className="waves-effect waves-light btn-small blue darken-4 join-btn"
                onClick={() => {
                  if (roomIdValid) {
                    history.push(`/${roomIdInput}`);
                  }
                }}
              >
                join
              </button>
            </div>
          </>
        ) : null}
      </div>
    </CenteredCard>
  );
};
