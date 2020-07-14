import M from "materialize-css";
import React from "react";
import { ERoomStatus, IRoom, EAction, IResult } from "../common/models";
import { Context } from "../global/Context";
import "./RoomActions.css";
import { useHistory } from "react-router-dom";
import { statsData } from "../common";
import { toast } from "react-toastify";

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

  const history = useHistory();

  React.useEffect(() => {
    M.Dropdown.init(_categoriesDropdownRef);
  }, []);

  if (!currentSession) return null;

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

  const doneEditingStyle = () => {
    const style = { display: "block" };
    if (
      currentSession.active ||
      roomStatus === ERoomStatus.initial ||
      roomStatus === ERoomStatus.viewingStats
    )
      style.display = "none";
    return style;
  };

  const handleStartStopVoting = () => {
    set__roomStatus(ERoomStatus.initial);

    let votingAction = EAction.start;
    if (currentSession.active && !votesExist()) votingAction = EAction.reset;
    if (afterVoteMode()) votingAction = EAction.reset;
    if (currentSession.active && votesExist()) votingAction = EAction.end;

    socket.emit(
      "handleVotingSession",
      {
        roomId: roomData.id,
        action: votingAction,
        categoryId: currentCategoryId,
      },
      (result: IResult) => {
        // console.log("result = ", result);
      }
    );
  };

  const votesExist = () => {
    if (
      !currentSession ||
      !currentSession.session ||
      !currentSession.session.sessionCategories ||
      !Array.isArray(currentSession.session.sessionCategories)
    )
      return false;
    const foundSessionCat = currentSession.session.sessionCategories.find(
      (s) => s.categoryId === currentSession.activeCategoryId
    );
    if (!foundSessionCat) return false;
    return foundSessionCat.votes.length > 0;
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

  const viewStatsText = () => {
    if (roomStatus === ERoomStatus.viewingStats) {
      return {
        txt: "Back to cards",
        ico: "arrow_back",
        icoPos: "left",
        title: "Go back to cards",
      };
    } else {
      return {
        txt: "View stats",
        ico: "pie_chart",
        icoPos: "right",
        title: "View stats",
      };
    }
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
          title={voteActionText().title}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {
            if (roomStatus === ERoomStatus.viewingStats) {
              set__roomStatus(ERoomStatus.initial);
            } else {
              set__roomStatus(ERoomStatus.viewingStats);
            }
          }}
        >
          <i className={`material-icons ${viewStatsText().icoPos}`}>
            {viewStatsText().ico}
          </i>
          {viewStatsText().txt}
        </button>

        {/* <button
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {}}
        >
          <i className="material-icons right">refresh</i>Reset
        </button> */}
        <button
          style={doneEditingStyle()}
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
