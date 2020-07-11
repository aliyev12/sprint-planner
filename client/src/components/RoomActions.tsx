import React from "react";
import M from "materialize-css";
import "./RoomActions.css";
import { Context, ERoomStatus } from "../global/Context";

interface Props {}

export const RoomActions = (props: Props) => {
  let _categoriesDropdownRef;
  const {
    roomStatus,
    set__roomStatus,
    editCategoriesValues,
    set__editCategoriesValues,
  } = React.useContext(Context);

  React.useEffect(() => {
    M.Dropdown.init(_categoriesDropdownRef);
  }, []);

  const editDropdownStyle = {
    display: roomStatus === ERoomStatus.initial ? "block" : "none",
  };
  const doneEditingStyle = {
    display: roomStatus === ERoomStatus.initial ? "none" : "block",
  };

  const doneSaveContent = () => {
    if (roomStatus === ERoomStatus.editingCategories) {
      return { icon: "save", text: "Save Changes" };
    } else if (roomStatus === ERoomStatus.editingCards) {
      return { icon: "done", text: "Done Editing" };
    } else {
      return { icon: "", text: "" };
    }
  };

  const handleDoneSave = () => {
    set__roomStatus(ERoomStatus.initial);
    // console.log("in handleDoneSave roomStatus = ", roomStatus);
    // if (roomStatus === ERoomStatus.editingCategories) {
    //   console.log("editCategoriesValues = ", editCategoriesValues);
    // } else if (roomStatus === ERoomStatus.editingCards) {
    //   set__roomStatus(ERoomStatus.initial);
    // }
    // If saving categories:
    // get inputs for edit categories from context, validate them..
    // emit a socket with the input values
    // handle adding/modifying/deleting categories on backend..
  };

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
          style={doneEditingStyle}
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={handleDoneSave}
        >
          <i className="material-icons right">done</i>
          Done Editing
        </button>

        <button
          style={editDropdownStyle}
          ref={(categoriesDropdownRef) => {
            _categoriesDropdownRef = categoriesDropdownRef;
          }}
          className="dropdown-trigger btn-small blue darken-4 btn-small"
          data-target="dropdown1"
        >
          <i className="material-icons right">create</i>Edit
        </button>

        <ul
          id="dropdown1"
          className="dropdown-content"
          style={editDropdownStyle}
        >
          <li className="flex-centered">
            <button
              className="btn-flat edit-dropdown-btn "
              onClick={() => set__roomStatus(ERoomStatus.editingCategories)}
            >
              Edit Categories
            </button>
          </li>
          <li className="flex-centered">
            <button
              className="btn-flat edit-dropdown-btn"
              onClick={() => set__roomStatus(ERoomStatus.editingCards)}
            >
              Edit Cards
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
