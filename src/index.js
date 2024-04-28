import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

// Local Imports
import MyApp from "~/src/myApp";
import { store } from "~/src/store";
import reportWebVitals from "~/src/reportWebVitals";

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
