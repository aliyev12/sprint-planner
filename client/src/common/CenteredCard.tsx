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
          <div className="card-content">
            <h3 className="card-title center">{title}</h3>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
