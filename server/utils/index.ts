export * from "./messages";
export * from "./constants";

export const isNumOrFloat = (num: string | number) =>
  /^[+-]?\d+(\.\d+)?$/g.test(num.toString());
