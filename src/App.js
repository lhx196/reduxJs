import React from "react";
import "./App.css";
import Page from "./view/page";
// import { createStore } from "redux";
import { createStore, applyMiddleware,logger,thunk } from "./redux/redux";
// import { Provider } from "react-redux";

const initState = {
  count: 0,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case "add":
      state.count += 1;
      return { ...state };
    case "dec":
      state.count -= 1;
      return { ...state };
    default:
      return state;
  }
};

const store = createStore(reducer,applyMiddleware(thunk,logger));
// const store = createStore(reducer);

function App() {
  return (
    <div className="App">
      {/* <Provider > */}
      <Page store={store} />
      {/* </Provider> */}
    </div>
  );
}

export default App;