import { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
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
  EUserRole,
} from "../common/models";
import { Context } from "../global/Context";
import "./RoomActions.css";

interface Props {
  roomData: IRoom;
}

export const RoomActions = ({ roomData }: Props) => {
  const categoriesDropdownRef = useRef<HTMLButtonElement>(null);

  const {
    socket,
    status,
    send,
    editCategoriesValues,
    currentUser,
    set__editCategoriesValues,
    currentSession,
    currentCategoryId,
  } = useContext(Context);

  const navigate = useNavigate();

  const { initial, editingCards, editingCategories, viewingStats } =
    ERoomStatus;

  const { EDIT_CARDS, EDIT_CATEGORIES, VIEW_STATS, DONE } = ERoomEvents;

  useEffect(() => {
    if (categoriesDropdownRef.current) {
      M.Dropdown.init(categoriesDropdownRef.current);
    }
  }, []);

  if (!currentSession || !socket) return null;

  const handleDoneEditing = () => {
    if (status.matches(editingCategories)) {
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

    handleRoomStatus(ERoomStatus.initial);
    send({ type: DONE });
  };

  const handleStartStopVoting = () => {
    let votingAction = EAction.start;
    if (currentSession.active && !votesExist(currentSession)) {
      votingAction = EAction.reset;
    }
    if (afterVoteMode()) {
      votingAction = EAction.reset;
    }
    if (currentSession.active && votesExist(currentSession)) {
      votingAction = EAction.end;
    }
    // Update status machine
    send({ type: DONE });

    // Update server side data model
    socket.emit(
      "handleVotingSession",
      {
        roomId: roomData.id,
        action: votingAction,
        categoryId: currentCategoryId,
      },
      (result: IResult) => {
        // Handle result if needed
      }
    );
  };

  const afterVoteMode = () => {
    if (currentSession.active === false && currentSession.session) return true;
    return false;
  };

  const handleRoomStatus = (newStatus: ERoomStatus) => {
    socket.emit(
      "updateCategories",
      {
        action: EAction.updateStatus,
        roomId: roomData.id,
        status: newStatus,
      },
      (res: IResult) => (res.error ? toast.error(res.error) : null)
    );
  };

  const voteActionTxt = voteActionText(afterVoteMode, currentSession);
  const viewStatsTxt = viewStatsText(afterVoteMode, status);
  const editStyle = editDropdownStyle(currentSession, status);
  const doneEdtStyle = doneEditingStyle(currentSession, status);

  return (
    <div className="RoomActions">
      <div className="buttons-container">
        {currentUser?.role === EUserRole.admin &&
        voteActionTxt.txt !== "error" ? (
          <button
            disabled={
              roomData.status === ERoomStatus.edit ||
              status.matches(editingCards) ||
              status.matches(editingCategories)
            }
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
          title={viewStatsTxt.title}
          className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
          onClick={() => {
            if (status.matches(viewingStats)) {
              send({ type: DONE });
            } else {
              send({ type: VIEW_STATS });
            }
          }}
        >
          <i className={`material-icons ${viewStatsTxt.icoPos}`}>
            {viewStatsTxt.ico}
          </i>
          {viewStatsTxt.txt}
        </button>

        {currentUser?.role === EUserRole.admin ? (
          <>
            <button
              style={doneEdtStyle}
              className="waves-effect waves-light btn-small blue darken-4 room-action-btn"
              onClick={handleDoneEditing}
            >
              <i className="material-icons right">done</i>
              Done Editing
            </button>

            <button
              style={editStyle}
              ref={categoriesDropdownRef}
              className="dropdown-trigger btn-small blue darken-4 btn-small"
              data-target="dropdown1"
            >
              <i className="material-icons right">create</i>Edit
            </button>

            <ul id="dropdown1" className="dropdown-content" style={editStyle}>
              <li className="flex-centered">
                <button
                  className="btn-flat edit-dropdown-btn"
                  onClick={() => {
                    // When admin starts editing by clicking edit categories or edit cards
                    // emit an event to the server that will set editing status to true
                    handleRoomStatus(ERoomStatus.edit);
                    send({ type: EDIT_CATEGORIES });
                  }}
                >
                  Edit Categories
                </button>
              </li>
              <li className="flex-centered">
                <button
                  className="btn-flat edit-dropdown-btn"
                  onClick={() => {
                    handleRoomStatus(ERoomStatus.edit);
                    send({ type: EDIT_CARDS });
                  }}
                >
                  Edit Cards
                </button>
              </li>
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
};
