export const toMilliseconds = (val: string): number => {
  const [_amount, measure] = val.split(" ");
  const singularMeasure = measure.replace(/s$/i, "");
  const amount = parseInt(_amount);

  switch (singularMeasure) {
    case "second":
      return amount * 1000;
    case "minute":
      return amount * 60 * 1000;
    case "hour":
      return amount * 60 * 60 * 1000;
    case "day":
      return amount * 24 * 60 * 60 * 1000;
    case "week":
      return amount * 7 * 24 * 60 * 60 * 1000;
    case "year":
      return amount * 52 * 7 * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`time() function implemented improperly. 
      As an argument to this function, make sure to specify the amount, space, and a measurement.
      For example: time(10 secons); time(1 minute); time(5 days) etc;
      Allowed measurements are: second(s), minute(s), hour(s), day(s), week(s), year(s)
      `);
  }
};
