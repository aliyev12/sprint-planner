import React from "react";
import "./CenteredCard.css";

interface Props {
  children: any;
  title?: string;
}

export const CenteredCard = ({ children, title = "Sprint Planner" }: Props) => {
  return (
    <div className="CenteredCard container">
      <div className="card-container">
        <div className="card hoverable">
          <div className="card-content black-text">
            <span className="card-title center">{title}</span>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
