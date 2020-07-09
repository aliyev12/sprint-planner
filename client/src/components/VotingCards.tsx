import React from "react";
import { ICategory, IRoom } from "./Room";
import "./VotingCards.css";

interface Props {
  roomData: IRoom;
}

export const VotingCards = ({ roomData }: Props) => {
  console.log("roomData from VotingCards = ", roomData);
  return (
    <div className="VotingCards">
      <section className="actions">
        <button className="waves-effect waves-light btn">
          <i className="material-icons right">create</i>Edit Categories
        </button>
      </section>
      <section className="voting-cards">
        <div className="row">
          {roomData.categories[0].units.map(({ unit }, i) => {
            return (
              <div className="col s12 m6 xl4" key={unit}>
                <div
                  className="card hoverable waves-effect waves-block waves-light"
                  style={{ margin: "3rem", minWidth: "10rem" }}
                >
                  <button
                    className="waves-effect waves-teal btn-flat voting-card-btn"
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      padding: 0,
                      textTransform: "unset",
                    }}
                  >
                    <div
                      className="card-content activator flex-centered"
                      style={{
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <span className="card-title">{unit}</span>
                      <span className="card-title">
                        {roomData.categories[0].singular}
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
