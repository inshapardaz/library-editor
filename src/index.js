import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

// Local Imports
import MyApp from "~/src/myApp";
import { store } from "~/src/store";

// Stylesheets
import "~/src/styles/index.css";
import "antd/dist/reset.css";
//--------------------------------------------------

createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MyApp />
    </Provider>
  </React.StrictMode>
);
