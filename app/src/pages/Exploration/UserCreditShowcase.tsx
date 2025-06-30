import React from "react";
import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material";
import { useUserStore } from "../../global/userState";
import { getUserScoreFromDB } from "../../apis/user";
import HelpIcon from "@mui/icons-material/Help";
import {timeConvert} from "../../utils/volunteerTimeCalc"

export default function UserCreditShowcase() {
  /* ------------------------------ Global State ------------------------------ */
  const { userInfo, userScore, updateUserScore } = useUserStore();

  /* -------------------------------------------------------------------------- */
  /*                        Handle OnMounted & OnUpdated                        */
  /* -------------------------------------------------------------------------- */
  React.useEffect(() => {
    async function innerFunc() {
      const { code, data: score } = await getUserScoreFromDB({
        id: userInfo.id!,
      });
      if (code === 0) {
        updateUserScore(score);
      }
    }
    innerFunc();
  }, [updateUserScore, userInfo.id]);
  return (
    <>
      <Stack
        className="UserCreditShowcase"
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        justifyContent="space-around"
        alignItems="center"
      >
        <Box>
          <Typography variant="body1" color="text.primary">
            Labels: {userScore.label}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="text.primary">
            Create: {userScore.create}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="text.primary">
            Modify: {userScore.modify}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="text.primary">
            Review: {userScore.review}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Tooltip
          title={
            <React.Fragment>
              <Typography variant="body1" color="inherit">
                DoorFront appreciates your generous contribution and is pleased
                to issue you a volunteer service letter in acknowledgement of
                your efforts. For those who would like to request a volunteer
                service letter, please contact Dr. Hao Tang for more
                information.
              </Typography>
              <Typography variant="body2">
                (Dr. Hao Tang:{" "}
                <a href="mailto:htang@bmcc.cuny.edu">htang@bmcc.cuny.edu</a>)
              </Typography>
            </React.Fragment>
          }
        >
          <HelpIcon sx={{ transform: "translateY(10%)", mr: 1 }} />
        </Tooltip>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ textAlign: "center", mt: 1 }}
        >
          Equivalent volunteer hours:{" "}
          {timeConvert(userScore.review + userScore.label)}
        </Typography>
      </Stack>
      <Divider sx={{ my: 2 }} />
    </>
  );
}

// function timeConvert(num: number) {
//   const hours = num / 60;
//   const rhours = Math.floor(hours);
//   const minutes = (hours - rhours) * 60;
//   const rminutes = Math.floor(minutes);
//   return rhours + " hour(s) and " + rminutes + " minute(s)";
// }