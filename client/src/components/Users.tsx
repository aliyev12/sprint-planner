import React from "react";
import "./Users.css";

export const Users = ({ users }) => {
  return (
    <ul className="Users collection">
      {users && users.length
        ? users.map((user, i) => {
            return (
              <li className="collection-item avatar" key={user.id}>
                <i className="material-icons circle">account_circle</i>
                {/* <img src="images/yuna.jpg" alt="" className="circle" /> */}
                <span className="title">{user.name}</span>
                <a href="#!" className="secondary-content">
                  <i className="material-icons">grade</i>
                </a>
              </li>
            );
          })
        : null}
    </ul>
  );
};
