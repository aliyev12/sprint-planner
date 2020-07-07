import moment from "moment";

export const formatMessage = (user, text) => {
  return {
    user,
    text,
    // time: moment().format("h:mm a"),
  };
};
