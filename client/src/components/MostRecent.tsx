import React from "react";
import "./MostRecent.css";
import { IRoom } from "../common/models";
import { getVoteCounts, calcPercentage } from "../common";

interface Props {
  roomData: IRoom;
}

export const MostRecent = ({ roomData }: Props) => {
  const foundDefaultIssue = roomData.issues.find((x) => x.id === "default");
  const mostRecentItems = [];
  if (foundDefaultIssue) {
    const mostRecentSession = foundDefaultIssue.sessions.find(
      (s) => s.id === "most-recent"
    );
    if (mostRecentSession) {
      mostRecentSession.sessionCategories.forEach((sessionCategory) => {
        const categoryId = sessionCategory.categoryId;
        const votes = sessionCategory.votes;
        const foundCategory = roomData.categories.find(
          (c) => c.id === categoryId
        );
        const voteCounts = getVoteCounts(votes);
        const percentage = calcPercentage(voteCounts, foundCategory.singular);
        if (!percentage.tie) mostRecentItems.push(percentage);
      });
    }
  }

  console.log("mostRecentItems = ", mostRecentItems);
  // unit: "2", count: 1, perc: 100, singleUnit: "hour"
  return (
    <ul className="MostRecent">
      {mostRecentItems.map((item, i) => (
        <li key={i} className="list-item">
          <span>
            {item.unit} {item.singleUnit}
            {item.unit === 1 ? "" : "s"}
          </span>
          <span className="percent">{item.perc}%</span>
        </li>
      ))}
    </ul>
  );
};
