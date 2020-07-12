import M from "materialize-css";
import React from "react";
import { ERoomStatus, IRoom, EAction, IResult } from "../common/models";
import { Context } from "../global/Context";
import "./RoomActions.css";

interface Props {
  roomData: IRoom;
}

export const RoomActions = ({ roomData }: Props) => {
  let _categoriesDropdownRef;
  const {
    socket,
    roomStatus,
    set__roomStatus,
    editCategoriesValues,
    set__editCategoriesValues,
    currentSession,
    currentCategoryId,
  } = React.useContext(Context);

  React.useEffect(() => {
    M.Dropdown.init(_categoriesDropdownRef);
  }, []);

  // const editMode =
  // !categoryActive(currentSession, category.id) &&
  // roomStatus === ERoomStatus.editingCards;

  const editDropdownStyle = {
    display:
      !currentSession.active &&
      !currentSession.session &&
      roomStatus === ERoomStatus.initial
        ? "block"
        : "none",
  };

  const doneEditingStyle = {
    display:
      currentSession.active || roomStatus === ERoomStatus.initial
        ? "none"
        : "block",
  };

  const handleStartStopVoting = () => {
    set__roomStatus(ERoomStatus.initial);

    let votingAction = EAction.start;
    if (afterVoteMode()) votingAction = EAction.reset;
    if (currentSession.active) votingAction = EAction.end;

    socket.emit(
      "handleVotingSession",
      {
        roomId: roomData.id,
        action: votingAction,
        categoryId: currentCategoryId,
      },
      (result: IResult) => {
        console.log("result = ", result);
      }
    );
  };

  const afterVoteMode = () => {
    if (currentSession.active === false && currentSession.session) return true;
    return false;
  };

  const voteActionText = () => {
    if (afterVoteMode())
      return {
        txt: "Reset",
        ico: "refresh",
        title: "Reset recent voting session",
      };
    if (!currentSession.active)
      return {
        txt: "Vote",
        ico: "done_all",
        title: "Start new voting session",
      };
    if (currentSession.active)
      return {
        txt: "Done voting",
        ico: "done_all",
        title: "End current voting session",
      };
    console.error(
      "fix voteActionText() funciton. None of the conditions for text and icon have been met."
    );
    return { txt: "error", ico: "done_all" };
  };

  return (
    <div className="RoomActions">
      <div className="buttons-container">
        {voteActionText().txt !== "error" ? (
          <button
            title={voteActionText().title}
            className="waves-effect waves-light btn-large blue darken-4 room-action-btn"
            onClick={handleStartStopVoting}
          >
            <i className="material-icons right">{voteActionText().ico}</i>
            {voteActionText().txt}
          </button>
        ) : null}

        <button
          disabled={!afterVoteMode()}
          title={!afterVoteMode() ? "Vote first to view stats" : "View stats"}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {}}
        >
          <i className="material-icons right">pie_chart</i>Stats
        </button>

        {/* <button
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {}}
        >
          <i className="material-icons right">refresh</i>Reset
        </button> */}
        <button
          style={doneEditingStyle}
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => set__roomStatus(ERoomStatus.initial)}
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

// const doneSaveContent = () => {
//   if (roomStatus === ERoomStatus.editingCategories) {
//     return { icon: "save", text: "Save Changes" };
//   } else if (roomStatus === ERoomStatus.editingCards) {
//     return { icon: "done", text: "Done Editing" };
//   } else {
//     return { icon: "", text: "" };
//   }
// };

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
