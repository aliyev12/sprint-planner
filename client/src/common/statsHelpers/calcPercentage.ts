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

  let allEqual = true,
    prev = voteCount[voteCountKeys[0]];
  for (let i = 0; i < voteCountKeys.length; i++) {
    const key = voteCountKeys[i];
    if (voteCount[key] !== prev) {
      allEqual = false;
      break;
    }
    prev = voteCount[key];
  }

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
        perc: Math.floor(totalNumOfVotes / voteCount[key]),
      };
    }
  });

  if (allEqual) {
    max = {
      ...max,
      perc: Math.floor(100 / voteCountKeys.length),
      tie: true, // tie vote
    };
  }

  return max;
};
