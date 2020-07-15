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

  voteCountKeys.forEach((key) => {
    if (max.count === 0) {
      max = {
        ...max,
        unit: key,
        count: voteCount[key],
        perc: 100,
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

  // 2,2,1,1,1
  // { "12": 2, "4": 3 } => voteCount
  // ["12", "4"] => voteCountKeys
  if (voteCountKeys.length > 1) {
    let hasEqualVotes = false,
      prev = null;
    for (let i = 0; i < voteCountKeys.length; i++) {
      const key = voteCountKeys[i];
      if (prev && voteCount[key] === prev) {
        hasEqualVotes = true;
        break;
      }
      prev = voteCount[key];
    }

    if (hasEqualVotes) {
      max = {
        ...max,
        perc: Math.floor(100 / voteCountKeys.length),
        tie: true, // tie vote
      };
    }
  }

  return max;
};
