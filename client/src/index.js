import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import rootReducer from "./redux/reducer";
import "./style/style.css";
import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({ reducer: rootReducer });
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
