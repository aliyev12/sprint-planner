import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./global/serviceWorker";
import { GlopalProvider } from "./global/Context";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <GlopalProvider>
      <App />
    </GlopalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
