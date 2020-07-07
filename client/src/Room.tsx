import React from "react";
import "./Room.css";

interface Props {}

export const Room = (props: Props) => {
  return (
    <div className="container">
      <div className="room-grid-container">
        <aside className="users-aside">
          <ul className="collection">
            <li className="collection-item avatar">
              <i className="material-icons circle">account_circle</i>
              {/* <img src="images/yuna.jpg" alt="" className="circle" /> */}
              <span className="title">Title</span>
              <p>
                First Line <br />
                Second Line
              </p>
              <a href="#!" className="secondary-content">
                <i className="material-icons">grade</i>
              </a>
            </li>

            <li className="collection-item avatar">
              <i className="material-icons circle">account_circle</i>
              {/* <img src="images/yuna.jpg" alt="" className="circle" /> */}
              <span className="title">Title</span>
              <p>
                First Line <br />
                Second Line
              </p>
              <a href="#!" className="secondary-content">
                <i className="material-icons">grade</i>
              </a>
            </li>

            <li className="collection-item avatar">
              <i className="material-icons circle">account_circle</i>
              {/* <img src="images/yuna.jpg" alt="" className="circle" /> */}
              <span className="title">Title</span>
              <p>
                First Line <br />
                Second Line
              </p>
              <a href="#!" className="secondary-content">
                <i className="material-icons">grade</i>
              </a>
            </li>

            <li className="collection-item avatar">
              <i className="material-icons circle">account_circle</i>
              {/* <img src="images/yuna.jpg" alt="" className="circle" /> */}
              <span className="title">Title</span>
              <p>
                First Line <br />
                Second Line
              </p>
              <a href="#!" className="secondary-content">
                <i className="material-icons">grade</i>
              </a>
            </li>
          </ul>
        </aside>

        <main>main</main>

        <aside className="issues-aside">
          <div className="collection">
            <a href="#!" className="collection-item black-text">
              Alvin
            </a>
            <a
              href="#!"
              className="collection-item white-text active blue darken-4"
            >
              Alvin
            </a>
            <a href="#!" className="collection-item black-text">
              Alvin
            </a>
            <a href="#!" className="collection-item black-text">
              Alvin
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};
