import React from "react";
import Navbar from "../../components/Navbar";
import NotFoundFigure from "../../images/page_not_found.svg";
import { Grid, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <Navbar position="static" isTransparent={false} />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "calc(100vh - 74px)" }}
      >
        <Grid item>
          <Box
            component="img"
            src={NotFoundFigure}
            sx={{ width: "80%", display: "block", m: "0 auto" }}
          />
          <Button
            variant="contained"
            component={RouterLink}
            to="/"
            sx={{
              width: "30%",
              display: "block",
              color: "white",
              m: "60px auto",
              textAlign: "center",
            }}
          >
            Go Back Home
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
