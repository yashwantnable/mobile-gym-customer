import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/mulish/400.css";
import "@fontsource/mulish/700.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const clientId = "511854368402-jbufqprfcgkdv11qgfiv0ovqjm2oqmrd.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <App /> 
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
