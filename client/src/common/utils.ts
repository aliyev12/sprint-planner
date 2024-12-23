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

export const truncate = (
  str: string,
  len: number = 14,
  dots: boolean = false
): string => {
  if (str.length > len && str.length > 0) {
    let new_str = str + " ";
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(" "));
    new_str = new_str.length > 0 ? new_str : str.substr(0, len);
    new_str =
      str.split(" ")[0].length > len
        ? str.split(" ")[0].substr(0, len - 3) + "..."
        : new_str;
    new_str =
      str.split(" ")[0].length <= len && dots ? new_str + "..." : new_str;
    return new_str;
  }
  return str;
};

export const triggedDomEvent = (
  id: string = "select-current-category",
  type: string = "change"
) => {
  const evt = document.createEvent("HTMLEvents");
  evt.initEvent(type, false, true);
  const element = document.getElementById(id);
  if (element) element.dispatchEvent(evt);
};

export const extractRoomId = (str: string): string => {
  const matched = str.match(/20\d{2}-\d{2}-\d{2}-(.+)/gim);
  if (matched && matched.length) return matched[0];
  return str;
};

export const getEndpoint = () => {
  if (window.location.host === "sprint-planner-dun.vercel.app")
    return "https://sprint-planner-luul.vercel.app/";
  return "localhost:3333";
};
