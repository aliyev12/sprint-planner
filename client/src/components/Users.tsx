import React from "react";
import { Context } from "../global/Context";
import "./Users.css";
import { truncate } from "../common/utils";

export const Users = ({ users }) => {
  const { socket, currentUser, roomState, currentSession } = React.useContext(
    Context
  );

  if (!currentUser || !currentSession) return null;

  const userDidVote = (userId) => {
    if (!currentSession.session) return false;

    let userVote = null;
    currentSession.session.sessionCategories.forEach((s) => {
      userVote = s.votes.find((v) => v.userId === userId);
    });

    if (!userVote) return false;
    return true;
  };

  return (
    <ul className="Users collection">
      {users && users.length
        ? users.map((user, i) => {
            const userVoted = userDidVote(user.id);
            return (
              <li className="collection-item" key={user.id}>
                {/* <img src="images/yuna.jpg" alt="" className="circle" /> */}

                <div className="user-list-item">
                  <div className="user-name-and-icon">
                    <div className="user-icon">
                      <i className="material-icons circle">account_circle</i>
                    </div>
                    <div className="user-name">{truncate(user.name)}</div>
                  </div>
                  <div className="user-voted green-text">
                    {userVoted ? (
                      <i
                        className="material-icons"
                        title={userVoted ? "User voted" : ""}
                      >
                        check_circle
                      </i>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })
        : null}
    </ul>
  );
};
