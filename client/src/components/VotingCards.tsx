import React from "react";
import { toast } from "react-toastify";
import { EAction, ERoomStatus, ICategory, IResult } from "../common/models";
import { isNumOrFloat, categoryActive } from "../common/utils";
import { Context } from "../global/Context";
import "./VotingCards.css";

// Add UI states when a card is voted and not
// add check button to the top right corner of the card and allow user to check other cards
// switch done editing button to stats button or something like that to view stats
// figure out how to deal with current category dropdown while voting
// See if you need to disable editing etc
// How do you handle situations when some other users can be on a different categy when voting starts

interface Props {
  category: ICategory;
  updateCategoryCards: (id: string, u: number, a: EAction) => void;
}

export const VotingCards = ({ category, updateCategoryCards }: Props) => {
  const [newUnit, set__newUnit] = React.useState("");

  const {
    socket,
    roomState,
    roomStatus,
    set__roomStatus,
    currentSession,
  } = React.useContext(Context);
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

  const handleVoteClick = (unit) => {
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
    roomStatus === ERoomStatus.editingCards;

  const initialMode =
    roomStatus === ERoomStatus.initial &&
    categoryActive(currentSession, category.id);

  const disabledMode =
    roomStatus !== ERoomStatus.initial ||
    !categoryActive(currentSession, category.id);

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
            return (
              <div
                className="col s12 m6 xl4 voting-card-col"
                key={`${unit}-${i}`}
              >
                {editMode ? (
                  <button
                    title="Delete card"
                    className="btn-floating btn-small waves-effect waves-light red del-card-btn"
                    onClick={() => {
                      updateCategoryCards(category.id, unit, EAction.delete);
                    }}
                  >
                    <i className="material-icons">delete</i>
                  </button>
                ) : null}

                {/* <button
                  title="Uncheck card"
                  className="btn-floating btn-small waves-effect waves-light green del-card-btn"
                  onClick={() => {
                    // updateCategoryCards(category.id, unit, EAction.delete);
                  }}
                >
                  <i className="material-icons">check</i>
                </button> */}

                <div
                  style={{
                    pointerEvents: initialMode ? "auto" : "none",
                  }}
                  className="card hoverable waves-effect waves-block waves-light"
                >
                  {editMode ? (
                    <div className="card-backdrop del-backdrop" />
                  ) : null}

                  {/* <div className="card-backdrop voted-backdrop" /> */}

                  <button
                    disabled={disabledMode}
                    onClick={() => handleVoteClick(unit)}
                    type="button"
                    className="waves-effect waves-teal btn-flat voting-card-btn"
                  >
                    <div className="card-content flex-centered">
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
