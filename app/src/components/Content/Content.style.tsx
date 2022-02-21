import React from "react";
import { Grid, SxProps } from "@mui/material";

export interface GridItemProps {
  sx?: SxProps;
}

export const GridItem: React.FC<GridItemProps> = React.memo(function ({
  children,
  sx,
}) {
  return (
    <Grid item xs={12} sm={12} md={12} lg={6} sx={sx}>
      {children}
    </Grid>
  );
});

export const illustrationStyle: SxProps = {
  width: "80%",
  display: "block",
  m: {
    xs: "0 auto",
  },
};

export const firstSectionStyle: SxProps = {
  position: {
    md: "absolute",
    xs: "static",
  },
  borderRadius: 10,
  boxShadow: 15,
  top: "6.25rem",
  left: "6.25rem",
  // right: "6.25rem",
  p: "2.5rem",
  width: {
    lg: "400px",
    sm: "60%",
    xs: "70%",
  },
  m: {
    md: "0",
    xs: "0 auto",
  },
};

export const questionMarkStyle: SxProps = {
  position: "absolute",
  top: "-14%",
  right: 0,
  width: {
    lg: "30%",
    md: "15%",
  },
  display: {
    md: "block",
    xs: "none",
  },
};

export const commaStyle: SxProps = {
  position: "absolute",
  top: {
    lg: "5%",
    xs: "20%",
  },
  right: "0",
  width: {
    lg: "20%",
    md: "10%",
    sm: "10%",
    xs: "20%",
  },
};
