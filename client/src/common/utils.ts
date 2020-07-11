import { ICurrentSession } from "./models";

export const isNumOrFloat = (num: string | number) =>
  /^[+-]?\d+(\.\d+)?$/g.test(num.toString());

export const categoryActive = (
  currentSession: ICurrentSession,
  categoryId: string
) => {
  if (
    currentSession &&
    currentSession.active &&
    currentSession.activeCategoryId === categoryId
  )
    return true;
  return false;
};
