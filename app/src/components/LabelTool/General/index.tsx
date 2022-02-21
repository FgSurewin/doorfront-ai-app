import { Box, Divider, Typography } from "@mui/material";

export function ReactToolAsideTitle({ text }: { text: string }) {
  return (
    <Box sx={{ pt: 1 }}>
      <Typography
        variant="subtitle2"
        sx={{
          textTransform: "uppercase",
          textAlign: "center",
          mb: 1,
          color: "text.primary",
          fontWeight: "bold",
        }}
      >
        {text}
      </Typography>
      <Divider sx={{ borderBottomWidth: 3, bgcolor: "text.primary" }} />
    </Box>
  );
}
