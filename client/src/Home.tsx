import React from "react";
import { useHistory } from "react-router-dom";
import uniqid from "uniqid";
import { CenteredCard } from "./common";
import { Context } from "./Context";
import "./Home.css";

export const Home = () => {
  const history = useHistory();
  const { initRoom } = React.useContext(Context);
  const [status, set__status] = React.useState("initial");
  const [userName, set__userName] = React.useState("");
  const [roomName, set__roomName] = React.useState("");

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

  return (
    <CenteredCard>
      <div className="Home">
        {status === "initial" && (
          <button
            className="waves-effect waves-light btn-large blue darken-4 create-new-room-btn"
            onClick={() => set__status("creating-new-room")}
          >
            <i className="material-icons left">add</i>create new room
          </button>
        )}

        {status === "creating-new-room" && (
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
            <div className="suggestion">
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

            <div className="buttons-container">
              <button
                className="waves-effect waves-light btn-small blue darken-4 back-to-initial-btn"
                onClick={() => {
                  set__status("initial");
                  resetFields();
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
        )}

        {status === "initial" && (
          <>
            <div className="or">or, join existing room:</div>
            <div className="input-field col s12">
              <input id="existing-room-id" type="text" className="validate" />
              <label htmlFor="emexisting-room-id">Room ID</label>
            </div>
          </>
        )}
      </div>
    </CenteredCard>
  );
};
