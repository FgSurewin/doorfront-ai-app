import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import { ReactComponent as Treasure } from "../../images/treasure.svg";
import { useUserStore } from "../../global/userState";
import { addUserBonusCredit } from "../../apis/user";

export default function TreasureShowcase() {
  const {
    userInfo,
    collectedImgNum,
    treasureNum,
    updateCollectedImgNum,
    updateTreasureNum,
    updateUserScore,
  } = useUserStore();
  /* ----------------------------- Computed Value ----------------------------- */
  const isOpen = React.useMemo(() => {
    let result = false;
    result = collectedImgNum === treasureNum;
    return result;
  }, [collectedImgNum, treasureNum]);

  const handleAccept = async () => {
    const result = await addUserBonusCredit({ id: userInfo.id! });
    if (result.code === 0) {
      updateCollectedImgNum(0);
      updateTreasureNum(Math.floor(Math.random() * 50));
      updateUserScore(result.data);
    }
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"🏴‍☠️ Congratulation"}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mb: 2,
              textAlign: "center",
            }}
          >
            <Treasure />
          </Box>

          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontWeight: "bold", my: 1 }}
          >
            🎉 Congrats! You found the treasure!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAccept}
            variant="contained"
            autoFocus
            sx={{ color: "white" }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
