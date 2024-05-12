import "./styles.css";

import ReactDOM from "react-dom/client";
import Main from "./main.jsx";
import { StrictMode } from "react";
import { LocationProvider } from "./utils/LocationContext.jsx";
const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <StrictMode>
    <LocationProvider>
      <Main />
    </LocationProvider>
  </StrictMode>
);
