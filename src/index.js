import "./styles.css";

import ReactDOM from "react-dom/client";
import Main from "./main";
import { StrictMode } from "react";
import { Leva } from "leva";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <StrictMode>
    <Main />
    <Leva collapsed />
  </StrictMode>
);
