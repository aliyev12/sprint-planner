import React from "react";
import { toast } from "react-toastify";
import { EAction, ERoomStatus, ICategory } from "../common/models";
import { isNumOrFloat, categoryActive } from "../common/utils";
import { Context } from "../global/Context";
import "./VotingCards.css";

// let socket: SocketIOClient.Socket;

interface Props {
  category: ICategory;
  updateCategoryCards: (id: string, u: number, a: EAction) => void;
}

export const VotingCards = ({ category, updateCategoryCards }: Props) => {
  // const ENDPOINT = process.env.REACT_APP_ENDPOINT || "localhost:3333";
  const [newUnit, set__newUnit] = React.useState("");

  const { roomStatus, set__roomStatus, currentSession } = React.useContext(
    Context
  );

  React.useEffect(() => {
    // socket = io(ENDPOINT);
  }, []);

  if (!category) return null;

  return (
    <div className="VotingCards">
      <section className="voting-cards">
        {roomStatus === ERoomStatus.editingCards ? (
          <form
            className="add-btn-container"
            onSubmit={(e) => {
              e.preventDefault();
              if (isNumOrFloat(newUnit)) {
                const parsedUnit = parseFloat(newUnit);
                updateCategoryCards(category.id, parsedUnit, EAction.add);
              } else {
                toast.error("Wrong format. Units need to be numbers");
              }
              set__newUnit("");
            }}
          >
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
              <div className="col s12 m6 xl4 voting-card-col" key={unit}>
                {roomStatus === ERoomStatus.editingCards ? (
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

                <div
                  style={{
                    pointerEvents:
                      roomStatus === ERoomStatus.initial &&
                      categoryActive(currentSession, category.id)
                        ? "auto"
                        : "none",
                  }}
                  className="card hoverable waves-effect waves-block waves-light"
                >
                  {roomStatus === ERoomStatus.editingCards ? (
                    <div className="del-backdrop" />
                  ) : null}

                  <button
                    disabled={
                      roomStatus !== ERoomStatus.initial ||
                      !categoryActive(currentSession, category.id)
                    }
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
