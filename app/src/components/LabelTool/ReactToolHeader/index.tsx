import React from "react";
import WhiterLogo from "../../../images/BigLogo.svg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  //   Container,
  AppBar,
  IconButton,
  Grid,
  Stack,
  Typography,
  Button,
  Tooltip,
  Box,
} from "@mui/material";
import { helpResizeImage, helpSwitchImage } from "../Aside/utils";
import { useReactToolInternalStore } from "../state/internalState";
import { useReactToolsStore } from "../state/reactToolState";

export default function ReactToolHeader() {
  const { stageAttributes, onChangeStageAttributes, scaleConfig } =
    useReactToolInternalStore();
  const {
    reactToolImageList,
    changeSelectedImageId,
    selectedImageId,
    operationsFuncs,
  } = useReactToolsStore();
  const scaleValue = React.useMemo(() => {
    if (reactToolImageList.length === 0) return 0;
    const result =
      (stageAttributes.scaleX - scaleConfig.minValue) / scaleConfig.minValue;
    return Math.round(result * 100);
  }, [stageAttributes, scaleConfig, reactToolImageList]);

  const handleExit = () => {
    const imgNumber = reactToolImageList.length;
    if (imgNumber > 0) {
      if (operationsFuncs.onFailureExit) {
        operationsFuncs.onFailureExit();
      }
    } else {
      if (operationsFuncs.onSuccessExit) {
        operationsFuncs.onSuccessExit();
      }
    }
  };

  return (
    <AppBar position="static" sx={{ py: 1, px: 6 }}>
      <Grid container justifyContent="space-between">
        <Grid item component="img" src={WhiterLogo} alt="DoorFront" />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-evenly"
          sx={{ width: "700px" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            className="switchImageButton"
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "white", textTransform: "uppercase", mr: 1 }}
            >
              Change Image
            </Typography>
            <Tooltip title="Previous Image" arrow>
              <Box>
                <IconButton
                  size="large"
                  sx={{ color: "white" }}
                  disabled={reactToolImageList.length === 0}
                  onClick={() => {
                    const backImageId = helpSwitchImage(
                      selectedImageId,
                      reactToolImageList,
                      "back"
                    );
                    changeSelectedImageId(backImageId);
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip title="Next Image" arrow>
              <Box>
                <IconButton
                  size="large"
                  sx={{ color: "white" }}
                  disabled={reactToolImageList.length === 0}
                  onClick={() => {
                    const nextImageId = helpSwitchImage(
                      selectedImageId,
                      reactToolImageList,
                      "next"
                    );
                    changeSelectedImageId(nextImageId);
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Tooltip>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-evenly"
            className="resizeImageButton"
          >
            <Tooltip title="Resize Image" arrow>
              <Box>
                <IconButton
                  size="large"
                  sx={{ color: "white" }}
                  disabled={
                    stageAttributes.scaleX <= scaleConfig.minValue ||
                    reactToolImageList.length === 0
                  }
                  onClick={() => {
                    const result = helpResizeImage(
                      stageAttributes.scaleX,
                      scaleConfig.buttonStep,
                      scaleConfig.minValue,
                      scaleConfig.maxValue,
                      "minus"
                    );
                    onChangeStageAttributes({ scaleX: result, scaleY: result });
                  }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            </Tooltip>
            <Typography
              variant="subtitle2"
              sx={{ color: "white" }}
            >{`${scaleValue}%`}</Typography>
            <Tooltip title="Resize Image" arrow>
              <Box>
                <IconButton
                  size="large"
                  sx={{ color: "white" }}
                  disabled={
                    stageAttributes.scaleX >= scaleConfig.maxValue ||
                    reactToolImageList.length === 0
                  }
                  onClick={() => {
                    const result = helpResizeImage(
                      stageAttributes.scaleX,
                      scaleConfig.buttonStep,
                      scaleConfig.minValue,
                      scaleConfig.maxValue,
                      "plus"
                    );
                    onChangeStageAttributes({ scaleX: result, scaleY: result });
                  }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
            </Tooltip>
          </Stack>
          <Button
            sx={{
              bgcolor: "#f5222d",
              color: "white",
              "&:hover": { bgcolor: "#ff4d4f" },
            }}
            onClick={handleExit}
            className="exitButton"
          >
            Exit
          </Button>
        </Stack>
      </Grid>
    </AppBar>
  );
}
