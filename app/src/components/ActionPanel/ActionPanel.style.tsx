import { Box, CircularProgress, SxProps, Typography } from "@mui/material";

export const QueryButtonStyle: SxProps = { color: "white" };
export const LabelButtonStyle: SxProps = {
  color: "white",
  mt: 2,
  bgcolor: "#d4380d", //
  "&:hover": { bgcolor: "#ff7875" },
};
export const NextButtonStyle: SxProps = {
  mt: 2,
  color: "white",
  bgcolor: "text.primary",
  "&:hover": { bgcolor: "#212030" },
};

export function CircularProgressWithLabel({
  uploadProgress,
}: {
  uploadProgress: number;
}) {
  return (
    <Box sx={{ position: "relative", display: "block", m: "0 auto" }}>
      <CircularProgress
        variant="determinate"
        value={uploadProgress}
        sx={{ m: "0 auto", display: "block", mb: 4 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {uploadProgress > 0 && (
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${Math.round(uploadProgress)}%`}</Typography>
        )}
      </Box>
    </Box>
  );
}
