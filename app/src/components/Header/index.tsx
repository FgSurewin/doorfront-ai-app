import React from "react";
import Navbar from "../Navbar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Button, Stack, Typography } from "@mui/material";
import {
  BackgroundVideo,
  HeaderTitle,
  HeaderSubtitle,
  HeaderWrapperStyle,
  HeaderButtonStyle,
} from "./Header.style";
import { Link as RouterLink } from "react-router-dom";

export default function Header() {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 80 });
  return (
    <div style={HeaderWrapperStyle}>
      <Navbar position="fixed" isTransparent={!trigger} />
      <BackgroundVideo />
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="column"
        sx={{ height: "100vh" }}
      >
        <HeaderTitle />
        <HeaderSubtitle />
        <Button
          component={RouterLink}
          to="/exploration"
          variant="contained"
          sx={HeaderButtonStyle}
        >
          <Typography variant="h5">Explore</Typography>
        </Button>
      </Stack>
    </div>
  );
}
