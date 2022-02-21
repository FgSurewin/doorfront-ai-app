import React from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useReactToolInternalStore } from "../state/internalState";
import { helpResizeImage, helpSwitchImage } from "./utils";
import { useReactToolsStore } from "../state/reactToolState";

export default function OperationSection() {
  const { stageAttributes, onChangeStageAttributes, scaleConfig } =
    useReactToolInternalStore();
  const { reactToolImageList, changeSelectedImageId, selectedImageId } =
    useReactToolsStore();
  const scaleValue = React.useMemo(() => {
    if (reactToolImageList.length === 0) return 0;
    const result =
      (stageAttributes.scaleX - scaleConfig.minValue) / scaleConfig.minValue;
    return Math.round(result * 100);
  }, [stageAttributes, scaleConfig, reactToolImageList]);

  return (
    <React.Fragment>
      <Stack direction="row" alignItems="center" justifyContent="space-evenly">
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", color: "text.primary" }}
        >
          Change Image
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Box>
          <IconButton
            size="large"
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
          <IconButton
            size="large"
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
      </Stack>
      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="space-evenly">
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", color: "text.primary" }}
        >
          Resize Image
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <IconButton
            size="large"
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
          <Typography variant="subtitle2">{`${scaleValue}%`}</Typography>
          <IconButton
            size="large"
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
        </Stack>
      </Stack>
      <Divider />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        sx={{ width: "100%" }}
      >
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", color: "text.primary" }}
        >
          Confirm your correction
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Button variant="contained" sx={{ color: "white", flexGrow: 0.8 }}>
          Check
        </Button>
      </Stack>
      <Divider sx={{ mb: 2 }} />
    </React.Fragment>
  );
}
