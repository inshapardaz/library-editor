import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";

// Local Imports
import TheApp from "/src/theApp";
import { store } from "/src/store";
import reportWebVitals from "/src/reportWebVitals";
import "./styles/index.scss"
//-------------------------------------------------

const root = createRoot(document.getElementById("root"));
root.render(<Provider store={store}>
  <TheApp />
</Provider>);

reportWebVitals();