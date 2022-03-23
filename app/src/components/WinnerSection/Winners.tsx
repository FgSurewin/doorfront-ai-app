import { Box, Typography, Stack } from "@mui/material";
import React from "react";

const winnersData = [
  { rank: "1st", name: "Brittany", award: "$50 Amazon Gift Card" },
  { rank: "2nd", name: "zoing", award: "$30 Amazon Gift Card" },
  { rank: "3rd", name: "Terrell", award: "$20 Amazon Gift Card" },
];

export default function Winners() {
  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-around"
      >
        {winnersData.map((item, index) => (
          <Winner
            key={index}
            rank={item.rank}
            name={item.name}
            award={item.award}
          />
        ))}
      </Stack>
    </>
  );
}

function Winner({
  rank,
  name,
  award,
}: {
  rank: string;
  name: string;
  award: string;
}) {
  return (
    <Stack justifyContent="center" direction="column" alignItems="center">
      <Box
        sx={{
          width: "89px",
          height: "89px",
          borderRadius: "50%",
          bgcolor: "#333D58",
          display: "flex",
          alignItems: "center",
          justifyContent: "cneter",
          transform: "translateY(50%)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "white", textAlign: "center", flex: 1 }}
        >
          {rank}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "244px",
          height: "244px",
          borderRadius: "50%",
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "cneter",
        }}
      >
        <Typography
          variant="h2"
          sx={{ color: "#AD9054", textAlign: "center", flex: 1 }}
        >
          {name}
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="h5"
          sx={{ color: "#333D58", textAlign: "center", flex: 1, mt: 2 }}
        >
          {award}
        </Typography>
      </Box>
    </Stack>
  );
}
