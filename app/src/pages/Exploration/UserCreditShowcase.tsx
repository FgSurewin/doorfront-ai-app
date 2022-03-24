import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useUserStore } from "../../global/userState";
import { getUserScoreFromDB } from "../../apis/user";

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
      <Typography
        variant="body1"
        color="text.primary"
        sx={{ textAlign: "center", mt: 1 }}
      >
        Equivalent volunteer hours:{" "}
        {timeConvert(userScore.review * 0.3 + userScore.label * 0.25)}
      </Typography>
      <Divider sx={{ my: 2 }} />
    </>
  );
}

function timeConvert(num: number) {
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.floor(minutes);
  return rhours + " hour(s) and " + rminutes + " minute(s)";
}