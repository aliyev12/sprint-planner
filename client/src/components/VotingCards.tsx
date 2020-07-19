import React from "react";
import { toast } from "react-toastify";
import { useMachine } from "@xstate/react";
import { EAction, ERoomStatus, ICategory, IResult } from "../common/models";
import { isNumOrFloat, categoryActive } from "../common/utils";
import { Context } from "../global/Context";
import "./VotingCards.css";
import { roomMachine } from "../stateMachines";

interface Props {
  category: ICategory;
  updateCategoryCards: (id: string, u: number, a: EAction) => void;
}

export const VotingCards = ({ category, updateCategoryCards }: Props) => {
  const [newUnit, set__newUnit] = React.useState("");

  const {
    state,
    send,
    socket,
    currentUser,
    roomState,
    currentSession,
  } = React.useContext(Context);

  const {
    initial,
    editingCards,
    editingCategories,
    viewingStats,
  } = ERoomStatus;

  if (!category) return null;

  const handleAddCard = (e) => {
    e.preventDefault();
    if (isNumOrFloat(newUnit)) {
      const parsedUnit = parseFloat(newUnit);
      updateCategoryCards(category.id, parsedUnit, EAction.add);
    } else {
      toast.error("Wrong format. Units need to be numbers");
    }
    set__newUnit("");
  };

  const handleVoteClick = (unit: number) => {
    if (socket && roomState.roomId) {
      socket.emit(
        "handleVotingSession",
        {
          roomId: roomState.roomId,
          action: EAction.vote,
          categoryId: category.id,
          vote: { unit },
        },
        (res: IResult) => {
          if (res.error) toast.error(res.error);
        }
      );
    }
  };

  const editMode =
    !categoryActive(currentSession, category.id) &&
    state.value === editingCards;

  const initialMode =
    state.value === initial && categoryActive(currentSession, category.id);

  const disabledMode =
    state.value !== initial || !categoryActive(currentSession, category.id);

  const isCurrentVote = (unit) => {
    // if (!categoryActive(currentSession, category.id) || !currentSession.session)
    //   return false;
    if (!currentSession.session) return false;
    const foundSessionCat = currentSession.session.sessionCategories.find(
      (s) => s.categoryId === category.id
    );
    if (!foundSessionCat) return false;
    const yourVote = foundSessionCat.votes.find(
      (v) => v.userId === currentUser.id
    );

    if (!yourVote) return false;
    if (yourVote.unit !== unit) return false;
    return true;
  };

  const cardStyle = (unit: number) => {
    const style = { backgroundColor: "transparent" };
    if (currentSession.active && isCurrentVote(unit)) {
      style.backgroundColor = "var(--green-transp)";
    } else if (!currentSession.active && isCurrentVote(unit)) {
      style.backgroundColor = "var(--blue-transp)";
    }

    return style;
  };

  return (
    <div className="VotingCards">
      <section className="voting-cards">
        {editMode ? (
          <form className="add-btn-container" onSubmit={handleAddCard}>
            <div className="input-field">
              <input
                type="text"
                maxLength={5}
                className="validate"
                aria-label="Number of units"
                value={newUnit}
                onChange={(e) => set__newUnit(e.target.value)}
              />
            </div>
            <button
              title="Add new card"
              type="submit"
              disabled={!newUnit || !isNumOrFloat(newUnit)}
              className="btn-floating btn-small waves-effect waves-light green add-card-btn"
            >
              <i className="material-icons">add</i>
            </button>
          </form>
        ) : null}

        <div className="row">
          {category.units.map(({ unit }, i) => {
            const currVote = isCurrentVote(unit);
            return (
              <div
                className="col s12 m6 xl4 voting-card-col"
                key={`${unit}-${i}`}
              >
                {editMode ? (
                  <button
                    title="Delete card"
                    className="btn-floating btn-small waves-effect waves-light red card-top-right-btn del-card-btn"
                    onClick={() => {
                      updateCategoryCards(category.id, unit, EAction.delete);
                    }}
                  >
                    <i className="material-icons">delete</i>
                  </button>
                ) : null}

                {currVote && currentSession.active ? (
                  <button
                    title="Uncheck card"
                    className="btn-floating btn-small waves-effect waves-light card-top-right-btn check-card-btn"
                    onClick={() => {
                      handleVoteClick(unit);
                    }}
                  >
                    <i className="material-icons check-icon">check</i>
                    <i className="material-icons close-icon">close</i>
                  </button>
                ) : null}

                <div
                  style={{
                    pointerEvents: initialMode ? "auto" : "none",
                  }}
                  className="card hoverable waves-effect waves-block waves-light"
                >
                  {editMode ? (
                    <div className="card-backdrop del-backdrop" />
                  ) : null}

                  <button
                    disabled={disabledMode}
                    onClick={() => handleVoteClick(unit)}
                    type="button"
                    className="waves-effect waves-teal btn-flat voting-card-btn"
                  >
                    <div
                      className="card-content flex-centered"
                      style={cardStyle(unit)}
                    >
                      <span className="card-title">{unit}</span>
                      <span className="card-title">
                        {category.singular}
                        {unit === 1 ? "" : "s"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
