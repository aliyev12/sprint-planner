import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Context } from "./Context";
import { CenteredCard } from "./common";
import "./Join.css";

export const Join = ({ location, match }) => {
  const history = useHistory();
  const { initRoom } = React.useContext(Context);
  const [userName, set__userName] = React.useState("");
  const [roomId, set__roomId] = React.useState("");

  React.useEffect(() => {
    let roomIdParam: string | undefined;
    if (match && match.params && match.params.roomId)
      roomIdParam = match.params.roomId;

    if (roomIdParam) {
      set__roomId(roomIdParam);
    }
  }, [location.pathname]);

  const handleJoinRoom = () => {
    if (roomId) {
      initRoom({ userName, roomId });
      history.push(`/${roomId}`);
      set__userName("");
    }
  };

  return (
    <CenteredCard>
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
      <div className="buttons-container">
        {/* <button
              disabled={!userName || !roomName}
              className="waves-effect waves-light btn-small blue darken-4 back-to-initial-btn"
              onClick={() => {
                set__status("initial");
                set__userName("");
              }}
            >
              <i className="material-icons left">arrow_back</i>back
            </button> */}
        <button
          className="waves-effect waves-light btn-small blue darken-4 ready-to-create-btn"
          onClick={handleJoinRoom}
        >
          <i className="material-icons right">arrow_forward</i>join
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </button>
      </div>
    </CenteredCard>
  );
};
