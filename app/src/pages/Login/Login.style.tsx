import Dog from "../../images/dog_T.jpg";
import { SxProps, Typography } from "@mui/material";

export const generateRandomImageStyle: SxProps = {
  // backgroundImage: "url(https://source.unsplash.com/random)",
  backgroundImage: `url(${Dog})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  backgroundPosition: "center",
  objectFit: "cover",
};

/* -------------------------------------------------------------------------- */
/*                         React Component - Copyright                        */
/* -------------------------------------------------------------------------- */
export function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 2 }}
    >
      {"Copyright © DoorFront 2021"}
    </Typography>
  );
}
