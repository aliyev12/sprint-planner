import React from "react";
import { ICategory } from "./Room";
import "./VotingCards.css";

interface Props {
  category: ICategory;
}

export const VotingCards = ({ category }: Props) => {
  if (!category) return null;
  return (
    <div className="VotingCards">
      <section className="voting-cards">
        <div className="row">
          {category.units.map(({ unit }, i) => {
            return (
              <div className="col s12 m6 xl4" key={unit}>
                <div
                  className="card hoverable waves-effect waves-block waves-light"
                  style={{ margin: "3rem", minWidth: "10rem" }}
                >
                  <button
                    className="waves-effect waves-teal btn-flat voting-card-btn grey lighten-2"
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
