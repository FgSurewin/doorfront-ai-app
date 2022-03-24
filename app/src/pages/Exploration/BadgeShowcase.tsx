import React from "react";
import Badge_0 from "../../images/Badge_0.svg";
import Badge_1 from "../../images/Badge_1.svg";
import Badge_2 from "../../images/Badge_2.svg";
import Badge_3 from "../../images/Badge_3.svg";
import Badge_4 from "../../images/Badge_4.svg";
import Badge_5 from "../../images/Badge_5.svg";
import Badge_6 from "../../images/Badge_6.svg";
import { Stack, LinearProgress, Box, Typography } from "@mui/material";
import { useUserStore } from "../../global/userState";
import { getUserScoreFromDB } from "../../apis/user";

/* -------------------------------------------------------------------------- */
/*                            Ranking System Design                           */
/* -------------------------------------------------------------------------- */
const badges = [Badge_0, Badge_1, Badge_2, Badge_3, Badge_4, Badge_5, Badge_6];
const baseline = [0, 10, 50, 300, 1000, 2000, 5000];
const rank = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond"];

export default function BadgeShowcase() {
  /* ------------------------------ Global State ------------------------------ */
  const { userInfo, userScore, updateUserScore } = useUserStore();

  /* ----------------------------- Computed Value ----------------------------- */
  const badgeInfo = React.useMemo(() => {
    const result = {
      badge: "",
      currentNum: 0,
      maxNum: 0,
      percentage: 0,
      rank: "",
    };
    if (userScore.score > baseline[baseline.length - 1]) {
      result.badge = badges[badges.length - 1];
      result.currentNum = userScore.score - baseline[baseline.length - 2];
      result.maxNum =
        baseline[baseline.length - 1] - baseline[baseline.length - 2];
      result.percentage = 100;
      result.rank = rank[rank.length - 1];
    } else {
      for (let i = 0; i < baseline.length; i++) {
        if (
          baseline[i] <= userScore.score &&
          userScore.score < baseline[i + 1]
        ) {
          result.badge = badges[i];
          result.currentNum = userScore.score - baseline[i];
          result.maxNum = baseline[i + 1] - baseline[i];
          result.percentage = Math.floor(
            (result.currentNum / result.maxNum) * 100
          );
          result.rank = rank[i];
          break;
        }
      }
    }
    return result;
  }, [userScore]);

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
    <Stack direction="column" sx={{ pb: 2 }} className="BadgeShowcase">
      {badgeInfo.badge !== "" && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ textTransform: "uppercase" }}
            >
              Rank: {badgeInfo.rank}
            </Typography>
            <Box
              component="img"
              src={badgeInfo.badge}
              alt="Badge_1"
              width="50px"
            />
          </Stack>
          <Box
            component="div"
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              mr: 1,
            }}
          >
            <LinearProgress
              variant="determinate"
              value={badgeInfo.percentage}
              sx={{ width: "80%", display: "block" }}
            />
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.primary">
                {badgeInfo.currentNum}/{badgeInfo.maxNum}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Stack>
  );
}
