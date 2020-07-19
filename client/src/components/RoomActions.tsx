import M from "materialize-css";
import React from "react";
import { useHistory } from "react-router-dom";
import { useMachine } from "@xstate/react";
import { toast } from "react-toastify";
import {
  allCatChangesSaved,
  doneEditingStyle,
  editDropdownStyle,
  getConfirmMsg,
  viewStatsText,
  voteActionText,
  votesExist,
} from "../common/categoriesHelpers";
import {
  EAction,
  ERoomStatus,
  ERoomEvents,
  IResult,
  IRoom,
} from "../common/models";
import { Context } from "../global/Context";
import { roomMachine } from "../stateMachines";
import "./RoomActions.css";

interface Props {
  roomData: IRoom;
}

export const RoomActions = ({ roomData }: Props) => {
  let _categoriesDropdownRef;
  const {
    socket,
    state,
    send,
    editCategoriesValues,
    set__editCategoriesValues,
    currentSession,
    currentCategoryId,
  } = React.useContext(Context);

  const history = useHistory();

  const {
    initial,
    editingCards,
    editingCategories,
    viewingStats,
  } = ERoomStatus;

  const { EDIT_CARDS, EDIT_CATEGORIES, VIEW_STATS, DONE } = ERoomEvents;

  React.useEffect(() => {
    M.Dropdown.init(_categoriesDropdownRef);
  }, []);

  if (!currentSession) return null;

  const handleDoneEditing = () => {
    if (state.value === editingCategories) {
      const incompleteCatsExist = roomData.categories.some(
        (c) => !c.name || !c.singular
      );

      const unsavedChangesExist = roomData.categories.some(
        (c, _, arr) => !allCatChangesSaved(c.id, arr, editCategoriesValues)
      );

      if (incompleteCatsExist || unsavedChangesExist) {
        const confirmation = window.confirm(
          getConfirmMsg(incompleteCatsExist, unsavedChangesExist)
        );

        if (!confirmation) return;

        const incompleteCats = roomData.categories.filter(
          (c) => !c.name || !c.singular
        );

        incompleteCats.forEach((c) => {
          socket.emit(
            "updateCategories",
            {
              action: EAction.delete,
              roomId: roomData.id,
              categoryId: c.id,
            },
            (res: IResult) => (res.error ? toast.error(res.error) : null)
          );
        });
      }
    }
    send(DONE);
  };

  const handleStartStopVoting = () => {
    send(DONE);

    let votingAction = EAction.start;
    if (currentSession.active && !votesExist(currentSession))
      votingAction = EAction.reset;
    if (afterVoteMode()) votingAction = EAction.reset;
    if (currentSession.active && votesExist(currentSession))
      votingAction = EAction.end;

    socket.emit(
      "handleVotingSession",
      {
        roomId: roomData.id,
        action: votingAction,
        categoryId: currentCategoryId,
      },
      (result: IResult) => {}
    );
  };

  const afterVoteMode = () => {
    if (currentSession.active === false && currentSession.session) return true;
    return false;
  };
  console.log("state.value = ", state.value);
  const voteActionTxt = voteActionText(afterVoteMode, currentSession);
  const viewStatsTxt = viewStatsText(state);
  const editStyle = editDropdownStyle(currentSession, state);
  const doneEdtStyle = doneEditingStyle(currentSession, state);
  return (
    <div className="RoomActions">
      <div className="buttons-container">
        {voteActionTxt.txt !== "error" ? (
          <button
            title={voteActionTxt.title}
            className="waves-effect waves-light btn-large blue darken-4 room-action-btn"
            onClick={handleStartStopVoting}
          >
            <i className="material-icons right">{voteActionTxt.ico}</i>
            {voteActionTxt.txt}
          </button>
        ) : null}

        <button
          disabled={!afterVoteMode()}
          title={voteActionTxt.title}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {
            if (state.value === viewingStats) {
              send(DONE);
            } else {
              send(VIEW_STATS);
            }
          }}
        >
          <i className={`material-icons ${viewStatsTxt.icoPos}`}>
            {viewStatsTxt.ico}
          </i>
          {viewStatsTxt.txt}
        </button>

        {/* <button
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {}}
        >
          <i className="material-icons right">refresh</i>Reset
        </button> */}
        <button
          style={doneEdtStyle}
          // disabled={!userName || !roomName}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={handleDoneEditing}
        >
          <i className="material-icons right">done</i>
          Done Editing
        </button>

        <button
          style={editStyle}
          ref={(categoriesDropdownRef) => {
            _categoriesDropdownRef = categoriesDropdownRef;
          }}
          className="dropdown-trigger btn-small blue darken-4 btn-small"
          data-target="dropdown1"
        >
          <i className="material-icons right">create</i>Edit
        </button>

        <ul id="dropdown1" className="dropdown-content" style={editStyle}>
          <li className="flex-centered">
            <button
              className="btn-flat edit-dropdown-btn "
              onClick={() => send(EDIT_CATEGORIES)}
            >
              Edit Categories
            </button>
          </li>
          <li className="flex-centered">
            <button
              className="btn-flat edit-dropdown-btn"
              onClick={() => send(EDIT_CARDS)}
            >
              Edit Cards
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
