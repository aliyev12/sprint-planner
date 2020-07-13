import { IVote } from "../models";

export const getVoteCounts = (votes: IVote[]) => {
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
