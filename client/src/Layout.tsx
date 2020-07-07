import React from "react";
// import queryString from "query-string";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import M from "materialize-css";
import logo from "./logo-sp-white.png";
import "./Layout.css";

// const ENDPOINT = "http://localhost:3333";
// const socket = io(ENDPOINT);

export const Layout = ({ children }) => {
  let _sidenav;
  let history = useHistory();
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState("JavaScript");

  React.useEffect(() => {
    M.Sidenav.init(_sidenav);
  }, []);

  return (
    <div className="grid-container">
      <header>
        <nav>
          <div className="nav-wrapper blue darken-4">
            <div className="container">
              <a href="/" className="brand-logo">
                <img src={logo} width="100" alt="Sprint Planner Logo" />
              </a>

              <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
              <ul className="right hide-on-med-and-down">
                <li>
                  <a href="sass.html">Sass</a>
                </li>
                <li>
                  <a href="badges.html">Components</a>
                </li>
                <li>
                  <a href="collapsible.html">Javascript</a>
                </li>
                <li>
                  <a href="mobile.html">Mobile</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <ul
          className="sidenav"
          id="mobile-demo"
          ref={(sidenav) => {
            _sidenav = sidenav;
          }}
        >
          <li>
            <a href="sass.html">Sass</a>
          </li>
          <li>
            <a href="badges.html">Components</a>
          </li>
          <li>
            <a href="collapsible.html">Javascript</a>
          </li>
          <li>
            <a href="mobile.html">Mobile</a>
          </li>
        </ul>
      </header>

      <div className="page-content">{children}</div>

      <footer className="page-footer blue darken-4">
        <div className="footer-copyright">
          <div className="container">
            <div className="copyright-text">
              © {new Date().getFullYear()} Copyright Abdul Aliyev
            </div>
            <a className="grey-text text-lighten-4 right" href="/">
              <img src={logo} width="50" alt="Sprint Planner Logo" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
