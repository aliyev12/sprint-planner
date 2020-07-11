import React from "react";
// import queryString from "query-string";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import M from "materialize-css";
import logo from "./logo-sp-white.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Layout.css";
import { Context, ETheme } from "./Context";

// const ENDPOINT = "http://localhost:3333";
// const socket = io(ENDPOINT);

export const Layout = ({ children }) => {
  const { theme, set__theme } = React.useContext(Context);
  let _sidenav;
  let history = useHistory();
  const [name, set__Name] = React.useState("");
  const [room, set__Room] = React.useState("JavaScript");

  React.useEffect(() => {
    M.Sidenav.init(_sidenav);
  }, []);

  return (
    <div className={`${theme}-theme grid-container`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
                  <button
                    className="btn-floating btn-small waves-effect waves-light theme-switch-btn"
                    // style={{ backgroundColor: "var(--main-color)" }}
                    onClick={() =>
                      set__theme(
                        theme === ETheme.light ? ETheme.dark : ETheme.light
                      )
                    }
                  >
                    <i className="material-icons">
                      {theme === ETheme.light ? "brightness_2" : "wb_sunny"}
                    </i>
                  </button>
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
