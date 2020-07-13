import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import { IRoom, IStatResult } from "../common/models";
import { statsData } from "../common/statsHelpers";
import { Context } from "../global/Context";
import "./Stats.css";

interface Props {
  roomData: IRoom;
}

export const Stats = ({ roomData }: Props) => {
  const { currentSession } = React.useContext(Context);
  if (!currentSession) return null;

  const thereIsEnoughDataForChart = (cb: () => IStatResult) => {
    if (
      currentSession &&
      currentSession.session &&
      currentSession.session.sessionCategories &&
      Array.isArray(currentSession.session.sessionCategories) &&
      roomData &&
      roomData.categories &&
      Array.isArray(roomData.categories) &&
      !cb().error &&
      !!cb().topVote.count
    )
      return true;
    return false;
  };

  const stats = statsData(currentSession, roomData);
  console.log("stats = ", stats);
  return (
    <div className="Stats flex-centered">
      <div className="pie-chart-container">
        {thereIsEnoughDataForChart(
          statsData.bind(null, currentSession, roomData)
        ) ? (
          <>
            {stats && stats.topVote ? (
              <h5>
                {stats.topVote.perc}% of users voted for {stats.topVote.unit}{" "}
                {stats.topVote.singleUnit}
                {parseFloat(stats.topVote.unit) === 1 ? "" : "s"}
              </h5>
            ) : null}
            <PieChart
              data={stats.pie}
              animate
              lengthAngle={-360}
              label={({ dataEntry }) => {
                return `${dataEntry.title} (${Math.round(
                  dataEntry.percentage
                )}%)`;
              }}
              labelStyle={{ fontSize: "4px" }}
            />
          </>
        ) : (
          <h5>There is not enough data to view stats</h5>
        )}
      </div>
    </div>
  );
};
