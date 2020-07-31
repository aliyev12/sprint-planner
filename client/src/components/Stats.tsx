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
  if (
    !currentSession ||
    !currentSession.session ||
    !currentSession.session.sessionCategories
  )
    return null;

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

  // finish styling trophywith something nice looking
  const votingResultTxt = () => {
    if (stats && stats.topVote) {
      const vote = `${stats.topVote.unit} ${stats.topVote.singleUnit}${
        parseFloat(stats.topVote.unit) === 1 ? "" : "s"
      }`;
      const partStr = ` users voted for ${vote}`;
      const trophy = (
        <div className="trophy-container flex-centered">
          <div className="trophy">
            <span>Winner:</span>
            <div className="crown-vote">
              <span role="img" aria-label="crown" className="crown">
                👑
              </span>
              <span className="winning-vote">{vote}</span>
            </div>
          </div>
        </div>
      );

      // console.log("stats= ", stats);
      if (stats.topVote.tie) {
        return <h5>Tie vote! Reset and try again</h5>;
      } else if (stats.topVote.perc === 100) {
        return (
          <>
            {trophy}
            <h5>All of the{partStr}</h5>
          </>
        );
      } else {
        return (
          <>
            {trophy}
            <h5>
              {stats.topVote.perc}% of{partStr}
            </h5>
          </>
        );
      }
    }
    return null;
  };

  const stats = statsData(currentSession, roomData);
  return (
    <div className="Stats flex-centered">
      <div className="pie-chart-container">
        {thereIsEnoughDataForChart(
          statsData.bind(null, currentSession, roomData)
        ) ? (
          <>
            {votingResultTxt()}
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
