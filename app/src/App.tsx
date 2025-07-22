import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { theme } from "./theme";
import { Slide } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
// import { ReactQueryDevtools } from "react-query/devtools";
import { useState } from "react";
import "./App.css";
import { useUserStore } from "./global/userState";
// import { deleteAllLocal } from "./utils/localStorage";

const queryClient = new QueryClient();
interface Config {
  REACT_APP_VIDEO_LINK?: string;
  REACT_APP_MAPBOX_TOKEN?: string;
  REACT_APP_MAPBOX_DATASETS_TOKEN?: string;
  REACT_APP_GOOGLE_MAP_API_KEY?: string;
  REACT_APP_GOOGLE_GEOCODE_API_KEY?: string;
  REACT_APP_FIREBASE_API_KEY?: string;
  REACT_APP_FIREBASE_AUTH?: string;
  REACT_APP_FIREBASE_PROJECT?: string;
  REACT_APP_FIREBASE_BUCKET?: string;
  REACT_APP_FIREBASE_MESS?: string;
  REACT_APP_FIREBASE_APP_ID?: string;
  REACT_APP_TUTORIAL_ONE?: string;
  REACT_APP_TUTORIAL_TWO?: string;
  REACT_APP_TUTORIAL_VIDEO?: string;
  REACT_APP_API_URL?: string;
}

export const ConfigContext = React.createContext<Config | null>(null);

export default function App() {
  const [config, setConfig] = useState<Config | null>(null);
  const { initUserInfo } = useUserStore();

  React.useEffect(() => {
    initUserInfo();

    // const actionAfterClosing = (e: BeforeUnloadEvent) => {
    //   e.preventDefault();
    //   deleteAllLocal();
    // };
    // window.addEventListener("beforeunload", actionAfterClosing);
    axios
      .get("/api/config")
      .then((response) => {
        setConfig(response.data);
      })
      .catch((err) => {
        console.error("Failed to load config:", err);
      });
  }, [initUserInfo]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {
            //@ts-ignore
            // }
            <ConfigContext.Provider value={config}>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                TransitionComponent={Slide as React.ComponentType}
              >
                <Outlet />
              </SnackbarProvider>
            </ConfigContext.Provider>
          }
        </ThemeProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-left" /> */}
      </QueryClientProvider>
    </>
  );
}
