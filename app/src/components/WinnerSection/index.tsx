import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Winners from "./Winners";

export default function WinnerSection() {
  return (
    <Paper sx={{ bgcolor: "#D6974D" }}>
      <Typography
        variant="h2"
        sx={{ color: "white", textAlign: "center", pt: 6 }}
      >
        Congratulations
      </Typography>
      <Typography
        variant="h2"
        sx={{ color: "white", textAlign: "center", mt: 2 }}
      >
        Winners
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: "#484646",
          textAlign: "center",
          fontWeight: "bold",
          my: 2,
        }}
      >
        Mapathon: Virtual Scavenger Hunt
      </Typography>
      <Winners />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ mt: 4, p: 6 }}
        alignItems={{ xs: "center", sm: "flex-end" }}
      >
        <Box sx={{ flex: { xs: 1, sm: 1 } }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            Rules
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "white", width: { xs: "100%", md: "40%" } }}
          >
            The Mapathon starts at{" "}
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: "#581823",
                width: { xs: "100%", md: "40%" },
                fontWeight: "bold",
              }}
            >
              3pm on 03/12/2022
            </Typography>{" "}
            and ends at{" "}
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: "#581823",
                fontWeight: "bold",
              }}
            >
              3pm on 03/19/2022
            </Typography>
            . The three volunteers who have completed the most work will receive
            the awards. Query image and Validation receive the same scores.
            Scores are based off of quality and accuracy.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#333D58", fontWeight: "bold", mt: 1 }}
          >
            Doorfront reserves the right to interpret the final award
          </Typography>
        </Box>
        <Box sx={{ mt: { xs: 4, sm: 0 } }}>
          <Typography
            variant="body2"
            sx={{ color: "#333D58", fontWeight: "bold" }}
          >
            If you have any questions, please contact us:
          </Typography>
          <Typography variant="body2" sx={{ color: "#333D58" }}>
            Hao Tang:
            <a href="mailto:htang@bmcc.cuny.edu">htang@bmcc.cuny.edu</a>
          </Typography>
          <Typography variant="body2" sx={{ color: "#333D58" }}>
            Jiawei Liu:
            <a href="mailto:jliu021@citymail.cuny.edu">
              jliu021@citymail.cuny.edu
            </a>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
