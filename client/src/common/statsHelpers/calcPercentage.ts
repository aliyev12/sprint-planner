export const calcPercentage = (
  voteCount: { [key: string]: number },
  singleUnit: string
) => {
  let max = {
    unit: "",
    count: 0,
    perc: 0,
    singleUnit,
    tie: false,
  };
  // { "12": 2, "4": 2, "1": 2, "24": 2 } => voteCount
  // ["12", "4", "1", "24"] => voteCountKeys
  const voteCountKeys = Object.keys(voteCount);
  if (!voteCountKeys.length) return max;

  const totalNumOfVotes = voteCountKeys.reduce(
    (acc, key) => acc + voteCount[key],
    0
  );
  // { "1": 2, "2": 1 } => voteCount
  // ["1", "2"] => voteCountKeys
  voteCountKeys.forEach((key) => {
    if (max.count === 0) {
      max = {
        ...max,
        unit: key,
        count: voteCount[key],
        // perc: 100,
        perc: Math.floor((voteCount[key] / totalNumOfVotes) * 100),
      };
    } else if (voteCount[key] > max.count) {
      max = {
        ...max,
        unit: key,
        count: voteCount[key],
        perc: Math.floor((voteCount[key] / totalNumOfVotes) * 100),
      };
    }
  });

  // if (max.perc === 100) {

  // }

  // { "12": 2, "4": 3 } => voteCount
  // ["12", "4"] => voteCountKeys
  if (voteCountKeys.length > 1) {
    let isTie = false;
    const sortedVotes = voteCountKeys.map((k) => voteCount[k]).sort();
    const last1Sorted = sortedVotes[sortedVotes.length - 1];
    const last2Sorted = sortedVotes[sortedVotes.length - 2];
    if (last1Sorted === last2Sorted) isTie = true;

    if (isTie) {
      max = {
        ...max,
        perc: Math.floor(100 / voteCountKeys.length),
        tie: true, // tie vote
      };
    }
  }

  return max;
};
