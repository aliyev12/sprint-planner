import React from "react";
import M from "materialize-css";
import { ToastContainer } from "react-toastify";
import { ETheme } from "../common/models";
import { Context } from "./Context";
import logo from "./logo-sp-white.png";
import "react-toastify/dist/ReactToastify.css";
import "./Layout.css";

export const Layout = ({ children }) => {
  let _sidenav;
  const { theme, set__theme } = React.useContext(Context);

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
                {/* <li>
                  <a href="#">Login</a>
                </li> */}
                <li>
                  <button
                    className="btn-floating btn-small waves-effect waves-light theme-switch-btn"
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
          {/* <li>
            <a href="#">Login</a>
          </li> */}
          <li>
            <button
              className="btn-floating btn-small waves-effect waves-light theme-switch-btn"
              onClick={() =>
                set__theme(theme === ETheme.light ? ETheme.dark : ETheme.light)
              }
            >
              <i className="material-icons">
                {theme === ETheme.light ? "brightness_2" : "wb_sunny"}
              </i>
            </button>
          </li>
        </ul>
      </header>

      <div className="page-content">{children}</div>

      <footer className="page-footer blue darken-4">
        <div className="footer-copyright">
          <div className="container">
            <div className="copyright-text">
              © {new Date().getFullYear()} Copyright Sprint Planner
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
