import React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { FirstSectionData, SecondSectionData, curve } from "./data";
import {
  GridItem,
  illustrationStyle,
  firstSectionStyle,
  questionMarkStyle,
  commaStyle,
} from "./Content.style";

export default function Content() {
  const videoLink = process.env.REACT_APP_TUTORIAL_VIDEO 
  const videoRef = React.useRef<HTMLVideoElement>(null);
  return (
    <>
      <div style={{ backgroundColor: "rgba(225, 207, 185, 0.15)" }}>
        <Container maxWidth="xl">
        <Box
                sx={{
                  position: {
                    sm: "relative",
                    xs: "static",
                  },
                  mt:"5%"
                }}
              >
              <video
                src={videoLink}
                ref={videoRef}
                controls
                style={{width:"100%", height:"100%"}}
              />
              </Box>
          <Grid
            container
            sx={{ pt: { sm: 10, xs: 5 } }}
            rowSpacing={{ sm: 15, xs: 5 }}
          >

            <GridItem>
              <Box
                sx={{
                  position: {
                    sm: "relative",
                    xs: "static",
                  },
                }}
              >
                <Paper sx={firstSectionStyle}>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                    {FirstSectionData.title}
                  </Typography>
                  <Typography variant="h6">
                    {FirstSectionData.content}
                  </Typography>
                  <Box
                    component="img"
                    src={FirstSectionData.questionMark}
                    alt="questionMark"
                    sx={questionMarkStyle}
                  />
                </Paper>
                <Box
                  component="img"
                  src={FirstSectionData.dot}
                  alt="dot"
                  sx={{
                    width: {
                      md: "50%",
                      xs: "0",
                    },
                  }}
                />
              </Box>
            </GridItem>
            <GridItem>
              <Box
                component="div"
                sx={{
                  textAlign: {
                    lg: "right",
                  },
                }}
              >
                <Box
                  component="img"
                  src={FirstSectionData.illustration}
                  alt="illustration"
                  sx={illustrationStyle}
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid
            container
            direction="row-reverse"
            sx={{ pt: 10 }}
            rowSpacing={{ sm: 15, xs: 10 }}
          >
            <GridItem sx={{ position: "relative" }}>
              <Box sx={{ px: 6, pt: 10 }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
                >
                  {SecondSectionData.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {SecondSectionData.content}
                </Typography>
                <Box
                  component="img"
                  src={SecondSectionData.comma}
                  alt="comma"
                  sx={commaStyle}
                />
              </Box>
            </GridItem>
            <GridItem>
              <Box
                component="img"
                src={SecondSectionData.whole}
                alt="whole"
                sx={illustrationStyle}
              />
            </GridItem>
          </Grid>
        </Container>
      </div>
      <Box component="img" src={curve} alt="curve" sx={{ width: "100%" }} />
    </>
  );
}
