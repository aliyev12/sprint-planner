import React from "react";
import M from "materialize-css";
import "./RoomActions.css";

interface Props {}

export const RoomActions = (props: Props) => {
  let _categoriesDropdownRef;

  React.useEffect(() => {
    M.Dropdown.init(_categoriesDropdownRef);
  }, []);

  return (
    <div className="RoomActions">
      <div className="buttons-container">
        <button
          className="waves-effect waves-light btn-large blue darken-4 room-action-btn"
          onClick={() => {}}
        >
          <i className="material-icons right">done_all</i>Vote!
        </button>

        <button
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {}}
        >
          <i className="material-icons right">pie_chart</i>Stats
        </button>

        <button
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {}}
        >
          <i className="material-icons right">refresh</i>Reset
        </button>

        <button
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {}}
        >
          <i className="material-icons right">done</i>Done Editing
        </button>

        <button
          ref={(categoriesDropdownRef) => {
            _categoriesDropdownRef = categoriesDropdownRef;
          }}
          className="dropdown-trigger btn-small blue darken-4 btn-small"
          data-target="dropdown1"
        >
          <i className="material-icons right">create</i>Edit
        </button>

        <ul id="dropdown1" className="dropdown-content">
          <li className="flex-centered">
            <button
              className="btn-flat edit-dropdown-btn"
              onClick={() => console.log("Edit Categories")}
            >
              Edit Categories
            </button>
          </li>
          <li className="flex-centered">
            <button
              className="btn-flat edit-dropdown-btn"
              onClick={() => console.log("Edit Cards")}
            >
              Edit Cards
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
