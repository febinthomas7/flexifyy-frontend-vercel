import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import FallBack from "./components/FallBack";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Context from "./Context";
import { MessagingProvider } from "./MessageContext";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<FallBack />}>
    <QueryClientProvider client={queryClient}>
      <MessagingProvider>
        <Context>
          <RouterProvider router={router} />
        </Context>
      </MessagingProvider>
    </QueryClientProvider>
  </Suspense>
);
