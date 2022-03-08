import React from "react";
import Navbar from "../../components/Navbar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { Copyright, generateRandomImageStyle } from "./Login.style";
import ResetForm from "./ResetForm";

export default function ResetPage() {
  return (
    <div style={{ height: "100vh" }}>
      <Navbar position="static" isTransparent={false} />
      <Grid container component="main" sx={{ height: "calc(100vh - 74px)" }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={6} sx={generateRandomImageStyle} />
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          component={Paper}
          elevation={6}
          square
          sx={{ p: 2 }}
        >
          <ResetForm />
          <Copyright />
        </Grid>
      </Grid>
    </div>
  );
}
