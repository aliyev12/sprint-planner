import React from "react";
// import queryString from "query-string";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { useHistory } from "react-router-dom";
// import { Context } from "./Context";
// import io from "socket.io-client";
// import { Chat } from "./Chat";
import { Layout } from "./Layout";
import { Home } from "./Home";
import { Room } from "./Room";
import { Context } from "./Context";
import { Join } from "./Join";

// const ENDPOINT = "http://localhost:3333";
// const socket = io(ENDPOINT);

function App() {
  const { roomState } = React.useContext(Context);
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
          ></Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
}

export default App;
