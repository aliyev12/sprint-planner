import React from "react";
// import queryString from "query-string";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import M from "materialize-css";
// import { useHistory } from "react-router-dom";
// import { Context } from "./Context";
// import io from "socket.io-client";
// import { Chat } from "./Chat";
import { Layout } from "./global/Layout";
import { Home } from "./components/Home";
import { Room } from "./components/Room";
import { Context } from "./global/Context";
import { Join } from "./components/Join";

// const ENDPOINT = "http://localhost:3333";
// const socket = io(ENDPOINT);

function App() {
  const { roomState } = React.useContext(Context);

  // React.useEffect(() => {
  //   M.AutoInit();
  // }, []);

  return (
    <Layout>
      <Router>
        <Switch>
          <Route
            exact
            path="/:roomId"
            render={(routeProps) => {
              if (roomState && roomState.userName) {
                return <Room {...routeProps} />;
              } else {
                return <Join {...routeProps} />;
              }
            }}
          />
          <Route
            exact
            path="/"
            render={(routeProps) => <Home {...routeProps} />}
          />
        </Switch>
      </Router>
    </Layout>
  );
}

export default App;
