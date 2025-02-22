import { useContext, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import M from "materialize-css";
import { ToastContainer } from "react-toastify";
import { ETheme } from "../common/models";
import { Context } from "./Context";
import logo from "./logo-sp-white.png";
import "react-toastify/dist/ReactToastify.css";
import "./Layout.css";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const sidenavRef = useRef<HTMLUListElement>(null);
  const sidenavInstanceRef = useRef<M.Sidenav | null>(null);
  const { theme, set__theme, currentUser } = useContext(Context);

  useEffect(() => {
    // Initialize Materialize sidenav
    if (sidenavRef.current) {
      sidenavInstanceRef.current = M.Sidenav.init(sidenavRef.current);
    }

    // Clean up the sidenav instance when component unmounts
    return () => {
      try {
        if (sidenavInstanceRef.current) {
          // Check if the instance and its element still exist
          if (
            sidenavRef.current &&
            document.body.contains(sidenavRef.current)
          ) {
            sidenavInstanceRef.current.destroy();
          }
          sidenavInstanceRef.current = null;
        }
      } catch (error) {
        console.warn("Error cleaning up sidenav:", error);
      }
    };
  }, []);

  const toggleTheme = () => {
    set__theme(theme === ETheme.light ? ETheme.dark : ETheme.light);
  };

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
              <Link to="/" className="brand-logo">
                <img src={logo} width="100" alt="Sprint Planner Logo" />
              </Link>

              <a
                href="#!"
                data-target="mobile-demo"
                className="sidenav-trigger"
                onClick={(e) => e.preventDefault()}
              >
                <i className="material-icons">menu</i>
              </a>
              <ul className="right hide-on-med-and-down">
                {currentUser ? (
                  <li className="username-list-item">
                    <span>{currentUser.name}</span>
                  </li>
                ) : null}
                <li>
                  <button
                    className="btn-floating btn-small waves-effect waves-light theme-switch-btn"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${
                      theme === ETheme.light ? "dark" : "light"
                    } theme`}
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

        <ul className="sidenav" id="mobile-demo" ref={sidenavRef}>
          {currentUser ? (
            <li className="username-list-item sidenav-username">
              <span>{currentUser.name}</span>
            </li>
          ) : null}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <button
              className="btn-floating btn-small waves-effect waves-light theme-switch-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === ETheme.light ? "dark" : "light"
              } theme`}
            >
              <i className="material-icons">
                {theme === ETheme.light ? "brightness_2" : "wb_sunny"}
              </i>
            </button>
          </li>
        </ul>
      </header>

      <div className="page-content">{children || <Outlet />}</div>

      <footer className="page-footer blue darken-4">
        <div className="footer-copyright">
          <div className="container">
            <div className="copyright-text">
              <span>© {new Date().getFullYear()} Abdul Aliyev</span>
              <a
                className="waves-effect waves-light btn-small  darken-4"
                href="https://www.aaliyev.com/contact"
                target="_blank"
              >
                <i className="material-icons left">mail</i>get in touch
              </a>
            </div>
            <Link
              className="grey-text text-lighten-4 right footer-logo-link"
              to="/"
            >
              <img src={logo} width="50" alt="Sprint Planner Logo" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
