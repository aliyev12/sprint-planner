import React from "react";
import {
  EAction,
  ICategory,
  IVote,
  ISessionCategory,
  ISession,
  IIsue,
  IRoom,
  IUser,
  IAddCardResult,
} from "../common/models";

interface Props {}

export const Issues = (props: Props) => {
  return (
    <div className="Issues collection">
      <a href="#!" className="collection-item ">
        Alvin
      </a>
      <a href="#!" className="collection-item white-text active blue darken-4">
        Alvin
      </a>
      <a href="#!" className="collection-item ">
        Alvin
      </a>
      <a href="#!" className="collection-item ">
        Alvin
      </a>
    </div>
  );
};

export default Issues;
