import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import "./Stats.css";
import { Context } from "../global/Context";
import { IRoom, IVote } from "../common/models";

const dataMock = [
  { title: "One", value: 10, color: "#E38627" },
  { title: "Two", value: 15, color: "#C13C37" },
  { title: "Three", value: 20, color: "#6A2135" },
];

const defaultLabelStyle = {
  fontSize: "4px",
  //   fontFamily: "sans-serif",
};

interface Props {
  roomData: IRoom;
}

export const Stats = ({ roomData }: Props) => {
  const { currentSession } = React.useContext(Context);
  if (!currentSession) return null;

  const thereIsEnoughDataForChart = (cb) => {
    if (
      currentSession &&
      currentSession.session &&
      currentSession.session.sessionCategories &&
      Array.isArray(currentSession.session.sessionCategories) &&
      roomData &&
      roomData.categories &&
      Array.isArray(roomData.categories) &&
      !cb().error
    )
      return true;
    return false;
  };

  const getVoteCounts = (votes: IVote[]) => {
    const voteCounts = {};
    votes.forEach((vote, i) => {
      if (voteCounts[vote.unit]) {
        voteCounts[vote.unit] += 1;
      } else {
        voteCounts[vote.unit] = 1;
      }
    });
    return voteCounts;
  };

  const calcPercentage = (
    voteCount: { [key: string]: number },
    singleUnit: string
  ) => {
    const voteCounts = Object.keys(voteCount);
    let max = {
      unit: voteCounts[0],
      count: voteCount[voteCounts[0]],
      perc: 100,
      singleUnit,
    };
    let totalNumOfVotes = 0;

    voteCounts.forEach((key) => {
      totalNumOfVotes += voteCount[key];
    });

    for (let i = 1; i < voteCounts.length; i++) {
      if (voteCount[voteCounts[i]] > max.count)
        max = {
          unit: voteCounts[i],
          count: voteCount[voteCounts[i]],
          perc: Math.floor(totalNumOfVotes / voteCount[voteCounts[i]]),
          singleUnit,
        };
    }

    // count: 2 unit: "2"
    return max;
  };

  const statsData = () => {
    const result = {
      pie: null,
      topVote: null,
      error: null,
    };
    const foundSessionCat = currentSession.session.sessionCategories.find(
      (s) => s.categoryId === currentSession.activeCategoryId
    );
    const foundCat = roomData.categories.find(
      (c) => c.id === currentSession.activeCategoryId
    );
    if (!foundCat) {
      result.error = "Category with activeCategoryId has not been found";
      console.error("Category with activeCategoryId has not been found");
      return result;
    }
    if (!foundSessionCat) {
      result.error =
        "Session category with activeCategoryId has not been found";
      console.error(
        "Session category with activeCategoryId has not been found"
      );
      return result;
    }

    const singleUnit = foundCat.singular; // hour, story point etc
    // const categoryName = foundCat.name;

    const pie = [];
    const voteCounts = getVoteCounts(foundSessionCat.votes);
    const topVote = calcPercentage(voteCounts, singleUnit);
    // foundSessionCat.votes.forEach((vote, i) => {
    //   if (voteCounts[vote.unit]) {
    //     voteCounts[vote.unit] += 1;
    //   } else {
    //     voteCounts[vote.unit] = 1;
    //   }
    // });

    Object.keys(voteCounts).forEach((_vote, i) => {
      const vote = parseFloat(_vote);
      const slice = {
        title: `${vote} ${singleUnit}${vote === 1 ? "" : "s"}`,
        value: voteCounts[vote],
        color: getPieColor(i),
      };
      pie.push(slice);
    });

    result.pie = pie;
    result.topVote = topVote;

    return result;
  };

  if (thereIsEnoughDataForChart(statsData)) {
    console.log("statsData = ", statsData());
  } else {
    console.log("statsData failed = ", statsData());
  }

  console.log("statsData failed = ", statsData());

  const stats = statsData();

  // style stuff :)

  return (
    <div className="Stats flex-centered">
      <div className="pie-chart-container">
        {thereIsEnoughDataForChart(statsData) ? (
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
              labelStyle={defaultLabelStyle}
            />
          </>
        ) : (
          <h1>There is not enough data for pie chart</h1>
        )}
      </div>
    </div>
  );
};

function getPieColor(index) {
  const pieColors = [
    "#90caf9", // blue
    "#ef9a9a", // red
    "#9fa8da", // indigo
    "#ffe082", // amber
    "#80cbc4", // teal
    "#ffcc80", // orange
    "#a5d6a7", // green
    "#fff59d", // yellow
    "#b0bec5", // blue-grey
    "#bcaaa4", // brown
    "#e6ee9c", // lime
    "#b39ddb", // deep-purple
    "#f48fb1", // pink
    "#ce93d8", // purple
    "#81d4fa", // light-blue
    "#eeeeee", // grey
  ];

  if (index < pieColors.length) {
    return pieColors[index];
  } else {
    const randomIndex = Math.floor(Math.random() * pieColors.length) + 1;
    return pieColors[randomIndex];
  }
}
