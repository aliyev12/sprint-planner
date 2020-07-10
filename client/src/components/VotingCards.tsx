import React from "react";
import io from "socket.io-client";
import { ICategory, EAction } from "./Room";
import "./VotingCards.css";
import { Context, ERoomStatus } from "../global/Context";

// let socket: SocketIOClient.Socket;

interface Props {
  category: ICategory;
  updateCategoryCards: (id: string, u: number, a: EAction) => void;
}

export const VotingCards = ({ category, updateCategoryCards }: Props) => {
  // const ENDPOINT = process.env.REACT_APP_ENDPOINT || "localhost:3333";

  const { roomStatus, set__roomStatus } = React.useContext(Context);

  React.useEffect(() => {
    // socket = io(ENDPOINT);
  }, []);

  if (!category) return null;
  return (
    <div className="VotingCards">
      <section className="voting-cards">
        {roomStatus === ERoomStatus.editingCards ? (
          <div className="add-btn-container">
            <button
              title="Add new card"
              className="btn-floating btn-small waves-effect waves-light green add-card-btn"
              onClick={() => {
                updateCategoryCards(category.id, 0.2, EAction.add);
              }}
            >
              <i className="material-icons">add</i>
            </button>
          </div>
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
                      roomStatus === ERoomStatus.initial ? "auto" : "none",
                  }}
                  className="card hoverable waves-effect waves-block waves-light"
                >
                  {roomStatus === ERoomStatus.editingCards ? (
                    <div className="del-backdrop" />
                  ) : null}

                  <button
                    disabled={roomStatus !== ERoomStatus.initial}
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
