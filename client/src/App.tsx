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

// const ENDPOINT = "http://localhost:3333";
// const socket = io(ENDPOINT);

function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route
            exact
            path="/room"
            render={(routeProps) => <Room {...routeProps} />}
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
