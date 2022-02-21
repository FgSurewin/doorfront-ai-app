import React from "react";
import { Button, Typography, Stack, Divider, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useExplorationStore } from "../../global/explorationState";
import { HumanLabels } from "../../types/collectedImage";
import { deleteAllLocal } from "../../utils/localStorage";
import { useUserStore } from "../../global/userState";
import { useSnackbar } from "notistack";
import { updateHumanLabels } from "../../apis/collectedImage";
import { getUserScoreFromDB, addUserCredit } from "../../apis/user";

export interface ImageListItemType {
  imageId: string;
  disable: boolean;
  name: string;
  human_labels: HumanLabels[];
}

export interface ImageListItemProps {
  imageList: ImageListItemType[];
}

export default function ImageListItem({ imageList }: ImageListItemProps) {
  const { currentSelectedImage, updateCollectedImageList, collectedImageList } =
    useExplorationStore();
  // * A computed value to determine whether to show the scrollbar
  const showScrollBar = React.useMemo(() => imageList.length > 5, [imageList]);

  const navigate = useNavigate();
  const { userInfo, clearUserInfo, updateUserScore } = useUserStore();
  const { enqueueSnackbar } = useSnackbar();

  /* -------------------------------------------------------------------------- */
  /*                          Handle Validate Function                          */
  /* -------------------------------------------------------------------------- */
  const handleValidate = React.useCallback(
    async (image: ImageListItemType) => {
      try {
        const humanLabelList = image.human_labels;
        const newLabelList = image.human_labels[0].labels;
        // Insert new label list at the head of the array
        humanLabelList.unshift({
          name: userInfo.nickname || "Nobody",
          labels: newLabelList,
        });
        // Send back to Database
        const result = await updateHumanLabels(
          {
            imageId: image.imageId,
            data: humanLabelList,
          },
          {
            clearUserInfo,
            navigate,
            deleteAllLocal,
          }
        );
        if (result.code === 0) {
          // Update global state -> image list -> to disable the buttons
          updateCollectedImageList(
            collectedImageList.map((item) => {
              if (item.image_id === image.imageId) {
                item.human_labels = humanLabelList;
              }
              return item;
            })
          );

          // add review credit
          await addUserCredit({ id: userInfo.id!, type: "review" });
          // Get latest user score from DB
          const res = await getUserScoreFromDB({ id: userInfo.id! });
          // Update global state - user score
          if (res.code === 0) updateUserScore(res.data);
          enqueueSnackbar("Validate Image successfully", {
            variant: "success",
          });
        }
      } catch (e) {
        const error = e as Error;
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    },
    [
      clearUserInfo,
      enqueueSnackbar,
      navigate,
      updateUserScore,
      userInfo,
      collectedImageList,
      updateCollectedImageList,
    ]
  );

  return (
    <Stack
      direction="column"
      divider={<Divider orientation="horizontal" />}
      spacing={2}
      sx={{
        p: 1,
        py: 2,
        overflowY: showScrollBar ? "scroll" : "visible",
        height: "250px",
      }}
    >
      {imageList.map((item, index) => (
        <Stack
          className="imageListItem"
          justifyContent="space-between"
          direction="row"
          key={index}
          sx={{
            p: 1,
            px: 2,
            border:
              currentSelectedImage === item.imageId
                ? "2px solid #d6974d"
                : "none",
          }}
        >
          <Typography variant="h6">{item.name}</Typography>
          <Box>
            <Button
              className="imageListItemButton"
              component={RouterLink}
              to={`/editLabel/${item.imageId}`}
              variant="outlined"
              disabled={item.disable}
              sx={{ cursor: item.disable ? "not-allowed" : "pointer" }}
            >
              {item.disable ? "locked" : "modify"}
            </Button>
            <Button
              className="reviewImageButton"
              variant="contained"
              disabled={item.disable}
              sx={{
                ml: 1,
                color: "white",
                cursor: item.disable ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                handleValidate(item);
              }}
            >
              validate
            </Button>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
