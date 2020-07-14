import { ICurrentSession, IRoom, IStatResult } from "../models";
import { getVoteCounts, calcPercentage, getPieColor } from ".";

export const statsData = (
  currentSession: ICurrentSession,
  roomData: IRoom
): IStatResult => {
  const result: IStatResult = {
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
    console.error(result.error);
    return result;
  }

  if (!foundSessionCat) {
    result.error = "Session category with activeCategoryId has not been found";
    console.error(result.error);
    return result;
  }

  const singleUnit = foundCat.singular; // hour, story point etc

  const pie = [];
  const voteCounts = getVoteCounts(foundSessionCat.votes);
  const topVote = calcPercentage(voteCounts, singleUnit);

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
