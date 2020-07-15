import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./components/Home";
import { Join } from "./components/Join";
import { Room } from "./components/Room";
import { Context } from "./global/Context";
import { Layout } from "./global/Layout";
import { Overview } from "./components/Overview";

function App() {
  const { socket, roomState } = React.useContext(Context);

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
            path="/:roomId/overview"
            render={(routeProps) => <Overview {...routeProps} />}
          />
          <Route exact path="/">
            <Home />
          </Route>
          {/* <Route
            exact
            path="/"
            render={(routeProps) => <Home {...routeProps} />}
          /> */}
        </Switch>
      </Router>
    </Layout>
  );
}

export default App;
