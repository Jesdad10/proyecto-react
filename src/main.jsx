import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/proyecto-react-evaluacion">
        <App />
      </BrowserRouter>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        pauseOnHover={false}
        closeOnClick={false}
        draggable={false}
        closeButton={false}
      />
    </QueryClientProvider>
  </React.StrictMode>
);