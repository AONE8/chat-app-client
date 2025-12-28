import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import router from "@routes";
import store from "@store/index.ts";
import client from "@api/httpClient.ts";

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={client}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
        {/* <ReactQueryDevtools buttonPosition="bottom-right" /> */}
      </QueryClientProvider>
      <Toaster />
    </StrictMode>
  );
  return;
}

export default App;
