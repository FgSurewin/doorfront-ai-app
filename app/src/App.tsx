import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { theme } from "./theme";
import { Slide } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

import "./App.css";
import { useUserStore } from "./global/userState";
// import { deleteAllLocal } from "./utils/localStorage";

const queryClient = new QueryClient();

export default function App() {
  const { initUserInfo } = useUserStore();

  React.useEffect(() => {
    initUserInfo();

    // const actionAfterClosing = (e: BeforeUnloadEvent) => {
    //   e.preventDefault();
    //   deleteAllLocal();
    // };
    // window.addEventListener("beforeunload", actionAfterClosing);
  }, [initUserInfo]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            TransitionComponent={Slide as React.ComponentType}
          >
            <Outlet />
          </SnackbarProvider>
        </ThemeProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-left" /> */}
      </QueryClientProvider>
    </>
  );
}
